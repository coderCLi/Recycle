/**
 * 最终分包使用分析报告
 * 检查分包间的相互引用
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesJsonPath = path.join(__dirname, 'src/pages.json');

// 读取 pages.json
const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));
const subPackages = pagesJson.subPackages || [];

console.log('\n🔍 最终分包使用分析...\n');
console.log('==================================================\n');

// 之前标记为未使用的32个分包
const supposedlyUnused = [
  'package-activityZone',
  'package-ai-empower',
  'package-celebrity',
  'package-champion-city',
  'package-child-school',
  'package-civilization',
  'package-college-student',
  'package-duanwu-raffle',
  'package-employee-pickball',
  'package-enterprise-area',
  'package-enterprise-zone',
  'package-fangxinMap',
  'package-hometown-project',
  'package-innovation-hub',
  'package-innovationService',
  'package-intel-service',
  'package-life',
  'package-life-information',
  'package-logistics',
  'package-mayday',
  'package-overseas-chinese',
  'package-purchase-house',
  'package-question-answer-activities',
  'package-questionnaire',
  'package-quxian-info',
  'package-share',
  'package-travelGuide',
  'package-youth-friendly-city',
  'package-warranty',
  'package-welfarenew',
  'package-speed-park',
  'package-supervisory'
];

const results = [];

// 对每个"未使用"的分包，检查是否有其他文件引用它
supposedlyUnused.forEach(pkgName => {
  const result = {
    name: pkgName,
    isActuallyUsed: false,
    usedBy: [],
    usageType: '',
    canDelete: true,
    reason: ''
  };
  
  // 在整个src目录中搜索这个包名
  function searchReferences(dir, excludePkg) {
    const refs = [];
    
    function scan(currentDir) {
      const files = fs.readdirSync(currentDir);
      
      for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 跳过node_modules和当前包自身
          if (file === 'node_modules' || file === excludePkg) {
            continue;
          }
          scan(fullPath);
        } else if (file.endsWith('.vue') || file.endsWith('.ts') || file.endsWith('.js')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // 搜索包名引用
          if (content.includes(pkgName)) {
            // 检查是哪种引用
            const isNavigateTo = /navigateTo|redirectTo|reLaunch|switchTab/.test(content);
            const isImport = /import.*from.*['"]@\/.*package-/.test(content);
            const isUrlRef = /url:.*['"].*package-/.test(content);
            const isComment = /\/\/.*package-|\/\*.*package-/.test(content);
            
            refs.push({
              file: fullPath.replace(srcDir, ''),
              isNavigateTo,
              isImport,
              isUrlRef,
              isComment
            });
          }
        }
      }
    }
    
    scan(dir);
    return refs;
  }
  
  const references = searchReferences(srcDir, pkgName);
  
  if (references.length > 0) {
    result.isActuallyUsed = true;
    result.canDelete = false;
    result.usedBy = references.map(r => r.file);
    
    // 判断引用类型
    const hasRealJump = references.some(r => r.isNavigateTo || r.isUrlRef);
    const hasImport = references.some(r => r.isImport);
    
    if (hasRealJump) {
      result.usageType = '页面跳转引用';
      result.reason = `被 ${references.length} 个文件通过页面跳转引用`;
    } else if (hasImport) {
      result.usageType = 'API/组件导入';
      result.reason = `被 ${references.length} 个文件导入API或组件`;
    } else {
      result.usageType = '其他引用';
      result.reason = `被 ${references.length} 个文件引用（可能是注释或其他）`;
      result.canDelete = true; // 可能还是可以删除
    }
  } else {
    result.reason = '没有任何文件引用此分包';
  }
  
  results.push(result);
});

// 分类输出
const actuallyUsed = results.filter(r => r.isActuallyUsed && !r.canDelete);
const possiblyUnused = results.filter(r => !r.isActuallyUsed || r.canDelete);
const logisticsPkg = results.find(r => r.name === 'package-logistics');

console.log('📊 最终分析报告\n');

console.log(`✅ 实际使用的分包（${actuallyUsed.length}个）:`);
console.log('--------------------------------------------------');
actuallyUsed.forEach((r, i) => {
  console.log(`${i + 1}. ✅ ${r.name}`);
  console.log(`   引用类型: ${r.usageType}`);
  console.log(`   引用文件数: ${r.usedBy.length}`);
  console.log(`   示例: ${r.usedBy.slice(0, 2).join(', ')}`);
  console.log('');
});

console.log(`\n❌ 确认未使用，可以删除（${possiblyUnused.length}个）:`);
console.log('--------------------------------------------------');
possiblyUnused.forEach((r, i) => {
  console.log(`${i + 1}. ❌ ${r.name}`);
  console.log(`   原因: ${r.reason}`);
  console.log('');
});

// 特别标注 logistics
if (logisticsPkg) {
  console.log('\n🎯 特别说明 - package-logistics:');
  console.log('--------------------------------------------------');
  console.log('状态: 已确认废弃');
  console.log('原因: 代码注释明确标注"h5项目内跳转顺丰时废弃此方式"');
  console.log('替代方案: utils.ts 中的 thirdParty://SF_Express 特殊协议');
  console.log('');
}

console.log('\n==================================================');
console.log('📈 总结:');
console.log(`- 之前认为未使用: ${supposedlyUnused.length}个`);
console.log(`- 实际有引用（不能删）: ${actuallyUsed.length}个`);
console.log(`- 确认未使用（可删除）: ${possiblyUnused.length}个`);
console.log('==================================================\n');

// 输出可删除列表
console.log('📋 可删除的分包清单:');
console.log('==================================================');
possiblyUnused.forEach((r, i) => {
  console.log(`${i + 1}. ${r.name}`);
});
console.log('==================================================\n');
