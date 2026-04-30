#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 pages.json
const pagesJsonPath = path.join(__dirname, 'src/pages.json');
const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));

// 获取所有分包
const subPackages = pagesJson.subPackages || [];

// 统计所有分包页面
const allSubPackagePages = [];
subPackages.forEach(pkg => {
  const root = pkg.root;
  pkg.pages.forEach(page => {
    const fullPath = `/${root}/${page.path}`;
    allSubPackagePages.push({
      root,
      pagePath: page.path,
      fullPath,
      title: page.style?.navigationBarTitleText || '未命名'
    });
  });
});

console.log(`\n📊 分包统计报告`);
console.log(`=${'='.repeat(60)}`);
console.log(`\n总分包数量: ${subPackages.length}`);
console.log(`总分包页面数: ${allSubPackagePages.length}\n`);

// 读取所有源代码文件
const srcDir = path.join(__dirname, 'src');
const allCodeFiles = [];

function readDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readDir(fullPath);
    } else if (file.match(/\.(vue|ts|js)$/)) {
      allCodeFiles.push(fullPath);
    }
  });
}

readDir(srcDir);

// 在所有代码文件中搜索分包路径
const usedPackages = new Set();
const unusedPackages = new Set();

allSubPackagePages.forEach(pkg => {
  const shortPath = pkg.fullPath; // 例如: /package-more/more/more
  const rootPath = `/${pkg.root}`; // 例如: /package-more
  
  let isUsed = false;
  
  // 搜索所有代码文件
  for (const file of allCodeFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      // 检查是否引用了这个分包页面
      if (content.includes(shortPath) || content.includes(rootPath)) {
        isUsed = true;
        break;
      }
    } catch (e) {
      // 忽略读取错误的文件
    }
  }
  
  if (isUsed) {
    usedPackages.add(pkg.root);
  } else {
    unusedPackages.add(pkg.root);
  }
});

// 按分包整理
const packageUsage = {};
subPackages.forEach(pkg => {
  const isUsed = !unusedPackages.has(pkg.root);
  packageUsage[pkg.root] = {
    isUsed,
    pageCount: pkg.pages.length,
    pages: pkg.pages.map(p => ({
      path: p.path,
      title: p.style?.navigationBarTitleText || '未命名'
    }))
  };
});

// 输出结果
console.log('📦 未使用的分包 (可能可以删除):');
console.log(`-${'-'.repeat(59)}`);
let unusedCount = 0;
Object.keys(packageUsage).sort().forEach(root => {
  if (!packageUsage[root].isUsed) {
    unusedCount++;
    console.log(`\n❌ ${root} (${packageUsage[root].pageCount}个页面)`);
    packageUsage[root].pages.forEach(page => {
      console.log(`   - ${page.path} [${page.title}]`);
    });
  }
});

console.log(`\n\n📦 正在使用的分包:`);
console.log(`-${'-'.repeat(59)}`);
let usedCount = 0;
Object.keys(packageUsage).sort().forEach(root => {
  if (packageUsage[root].isUsed) {
    usedCount++;
    console.log(`\n✅ ${root} (${packageUsage[root].pageCount}个页面)`);
  }
});

console.log(`\n\n📈 汇总:`);
console.log(`-${'-'.repeat(59)}`);
console.log(`总分包数: ${subPackages.length}`);
console.log(`使用中: ${usedCount}`);
console.log(`未使用: ${unusedCount}`);
console.log(`未使用比例: ${((unusedCount / subPackages.length) * 100).toFixed(1)}%`);
console.log(`\n`);
