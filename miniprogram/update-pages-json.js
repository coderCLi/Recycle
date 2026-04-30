/**
 * 从 pages.json 中移除未使用的分包配置
 */
const fs = require('fs');
const path = require('path');

const pagesJsonPath = path.join(__dirname, 'src/pages.json');

// 要删除的25个分包
const packagesToRemove = [
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

console.log('\n🗑️  开始从 pages.json 中移除未使用的分包配置...\n');

// 读取 pages.json
const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));

console.log(`移除前分包数量: ${pagesJson.subPackages.length}`);

// 过滤掉要删除的分包
const originalCount = pagesJson.subPackages.length;
pagesJson.subPackages = pagesJson.subPackages.filter(pkg => {
  return !packagesToRemove.includes(pkg.root);
});

const removedCount = originalCount - pagesJson.subPackages.length;
console.log(`移除后分包数量: ${pagesJson.subPackages.length}`);
console.log(`已移除: ${removedCount}个分包\n`);

// 写回文件（格式化）
fs.writeFileSync(pagesJsonPath, JSON.stringify(pagesJson, null, '\t'), 'utf8');

console.log('✅ pages.json 已更新\n');

// 输出保留的分包列表
console.log('📋 保留的分包列表:');
console.log('==================================================');
pagesJson.subPackages.forEach((pkg, index) => {
  console.log(`${index + 1}. ${pkg.root} (${pkg.pages.length}个页面)`);
});
console.log('==================================================\n');
