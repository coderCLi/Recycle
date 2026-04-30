/**
 * 严格检查分包使用情况 - 查找实际的页面跳转引用
 */
const fs = require('fs');
const path = require('path');

const pagesJsonPath = path.join(__dirname, 'src/pages.json');
const srcDir = path.join(__dirname, 'src');

// 读取 pages.json
const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));

// 获取所有分包
const subPackages = pagesJson.subPackages || [];
console.log(`\n🔍 开始严格检查分包使用情况...`);
console.log(`==================================================\n`);

// 用于统计
const unusedPackages = [];
const usedPackages = [];
let totalPageCount = 0;

// 遍历所有分包
subPackages.forEach(pkg => {
  const pages = pkg.pages || [];
  totalPageCount += pages.length;
  
  const rootPath = `/${pkg.root}`;
  let isUsed = false;
  const usageDetails = [];
  
  // 查找所有 .vue, .ts, .js 文件
  function scanDir(dir) {
    if (isUsed) return; // 已经找到引用就停止
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (isUsed) break;
      
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过 node_modules 和分包自身目录
        if (file === 'node_modules' || file === pkg.root) {
          continue;
        }
        scanDir(fullPath);
      } else if (file.endsWith('.vue') || file.endsWith('.ts') || file.endsWith('.js')) {
        // 跳过当前分包内的文件
        if (fullPath.includes(`/${pkg.root}/`)) {
          continue;
        }
        
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // 检查各种跳转方式
        const patterns = [
          // uni.navigateTo 等跳转
          `navigateTo.*${rootPath}`,
          `redirectTo.*${rootPath}`,
          `reLaunch.*${rootPath}`,
          `switchTab.*${rootPath}`,
          `preloadRule.*${pkg.root}`,
          // 路径引用
          `url:.*['"]${rootPath}`,
          `url:.*['"].*${pkg.root}`,
          // toServicePage 调用
          `toServicePage.*${pkg.root}`,
          // 直接的包名引用
          `['"]/${pkg.root}/`,
          `["']/${pkg.root}/`,
        ];
        
        for (const pattern of patterns) {
          if (new RegExp(pattern).test(content)) {
            isUsed = true;
            usageDetails.push({
              file: fullPath.replace(srcDir, ''),
              pattern: pattern
            });
            break;
          }
        }
      }
    }
  }
  
  scanDir(srcDir);
  
  if (isUsed) {
    usedPackages.push({
      root: pkg.root,
      pageCount: pages.length,
      details: usageDetails
    });
  } else {
    unusedPackages.push({
      root: pkg.root,
      pageCount: pages.length,
      pages: pages.map(p => p.path)
    });
  }
});

// 输出结果
console.log(`📊 严格检查统计报告`);
console.log(`==================================================\n`);

console.log(`总分包数量: ${subPackages.length}`);
console.log(`总分包页面数: ${totalPageCount}\n`);

if (unusedPackages.length > 0) {
  console.log(`❌ 未使用的分包（${unusedPackages.length}个，共${unusedPackages.reduce((sum, p) => sum + p.pageCount, 0)}个页面）:`);
  console.log(`--------------------------------------------------\n`);
  
  unusedPackages.forEach((pkg, index) => {
    console.log(`${index + 1}. ❌ ${pkg.root} (${pkg.pageCount}个页面)`);
    console.log(`   页面列表:`);
    pkg.pages.forEach(page => {
      console.log(`      - ${page}`);
    });
    console.log('');
  });
  
  console.log(`\n==================================================`);
  console.log(`⚠️  建议：这些分包在代码中没有被任何页面跳转引用`);
  console.log(`   可能可以安全删除，但请确认是否是保留功能`);
} else {
  console.log(`✅ 所有分包都有实际使用！`);
  console.log(`--------------------------------------------------\n`);
  
  // 显示使用详情
  usedPackages.forEach(pkg => {
    console.log(`✅ ${pkg.root} (${pkg.pageCount}个页面)`);
    if (pkg.details.length > 0) {
      console.log(`   引用位置:`);
      pkg.details.slice(0, 2).forEach(detail => {
        console.log(`      - ${detail.file}`);
      });
      if (pkg.details.length > 2) {
        console.log(`      ... 还有${pkg.details.length - 2}个引用`);
      }
    }
    console.log('');
  });
}

console.log(`\n📈 汇总:`);
console.log(`--------------------------------------------------`);
console.log(`总分包数: ${subPackages.length}`);
console.log(`使用中: ${usedPackages.length}`);
console.log(`未使用: ${unusedPackages.length}`);
console.log(`未使用比例: ${((unusedPackages.length / subPackages.length) * 100).toFixed(1)}%`);
console.log(`==================================================\n`);
