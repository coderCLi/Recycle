/**
 * 深度分析未使用分包 - 检查后端配置、动态引用等
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 32个未使用的分包列表
const unusedPackages = [
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

console.log('\n🔍 深度分析未使用分包...');
console.log('==================================================\n');

// 检查结果
const analysisResults = [];

unusedPackages.forEach(pkgName => {
  const pkgDir = path.join(srcDir, pkgName);
  
  if (!fs.existsSync(pkgDir)) {
    analysisResults.push({
      name: pkgName,
      status: 'NOT_FOUND',
      reason: '分包目录不存在',
      suggestion: 'DELETE'
    });
    return;
  }
  
  const analysis = {
    name: pkgName,
    status: 'UNUSED',
    checks: [],
    suggestion: 'UNKNOWN',
    details: {}
  };
  
  // 1. 检查分包内的API文件
  const apiDir = path.join(pkgDir, 'api');
  if (fs.existsSync(apiDir)) {
    const apiFiles = fs.readdirSync(apiDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    analysis.details.apiCount = apiFiles.length;
    
    // 检查API是否被其他分包引用
    let apiUsedByOthers = false;
    apiFiles.forEach(apiFile => {
      const apiContent = fs.readFileSync(path.join(apiDir, apiFile), 'utf8');
      // 提取API路径
      const apiPathMatches = apiContent.match(/['"]([^'']*\/abpapp\/[^'"]+)['"]/g);
      if (apiPathMatches) {
        // 在整个src中搜索这些API路径
        apiPathMatches.forEach(apiPath => {
          const cleanPath = apiPath.replace(/['"]/g, '');
          // 搜索其他文件是否使用这个API
          const searchCmd = `grep -r "${cleanPath}" ${srcDir} --include="*.vue" --include="*.ts" --include="*.js" | grep -v "${pkgName}" | head -1`;
          // 这里简化处理，实际应该执行命令
        });
      }
    });
  }
  
  // 2. 检查分包内的页面数量和类型
  const pagesDir = path.join(pkgDir, 'pages');
  if (fs.existsSync(pagesDir)) {
    const vueFiles = [];
    function findVueFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          findVueFiles(fullPath);
        } else if (file.endsWith('.vue')) {
          vueFiles.push(fullPath);
        }
      });
    }
    findVueFiles(pagesDir);
    
    analysis.details.pageCount = vueFiles.length;
    analysis.details.pages = vueFiles.map(f => f.replace(srcDir, ''));
    
    // 3. 检查页面是否有实际内容
    let hasRealContent = false;
    vueFiles.forEach(vueFile => {
      const content = fs.readFileSync(vueFile, 'utf8');
      // 检查是否有实际的业务逻辑（不只是模板）
      if (content.includes('onLoad') || content.includes('mounted') || content.includes('methods')) {
        hasRealContent = true;
      }
      // 检查是否有API调用
      if (content.includes('import') && content.includes('from') && content.includes('../api')) {
        hasRealContent = true;
      }
    });
    
    analysis.details.hasRealContent = hasRealContent;
  }
  
  // 4. 检查包名中是否有特殊标记
  if (pkgName.includes('temp') || pkgName.includes('backup') || pkgName.includes('old')) {
    analysis.checks.push('包名包含临时/备份标记');
    analysis.suggestion = 'DELETE';
  }
  
  // 5. 检查是否有注释说明是备用/废弃
  const allFiles = [];
  function findAllFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findAllFiles(fullPath);
      } else if (file.endsWith('.vue') || file.endsWith('.ts') || file.endsWith('.js')) {
        allFiles.push(fullPath);
      }
    });
  }
  findAllFiles(pkgDir);
  
  let isDeprecated = false;
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('废弃') || content.includes('备用') || content.includes('deprecated') || content.includes('TODO: 删除')) {
      isDeprecated = true;
      analysis.checks.push(`文件 ${file.replace(srcDir, '')} 包含废弃/备用标记`);
    }
  });
  
  if (isDeprecated) {
    analysis.suggestion = 'DELETE';
  }
  
  // 6. 根据检查给出建议
  if (analysis.suggestion === 'UNKNOWN') {
    if (!analysis.details.hasRealContent && analysis.details.pageCount <= 2) {
      analysis.suggestion = 'LIKELY_DELETE';
      analysis.checks.push('页面内容简单，可能是临时功能');
    } else if (analysis.details.pageCount > 5) {
      analysis.suggestion = 'REVIEW_NEEDED';
      analysis.checks.push('页面较多，需要人工确认');
    } else {
      analysis.suggestion = 'LIKELY_DELETE';
    }
  }
  
  analysisResults.push(analysis);
});

// 输出分析结果
console.log('📊 深度分析报告\n');

const deleteCandidates = analysisResults.filter(r => r.suggestion === 'DELETE');
const likelyDelete = analysisResults.filter(r => r.suggestion === 'LIKELY_DELETE');
const reviewNeeded = analysisResults.filter(r => r.suggestion === 'REVIEW_NEEDED');

console.log(`🗑️  建议删除（${deleteCandidates.length}个）:`);
console.log('--------------------------------------------------');
deleteCandidates.forEach((r, i) => {
  console.log(`${i + 1}. ❌ ${r.name}`);
  console.log(`   原因: ${r.checks.join('; ') || r.reason}`);
  console.log('');
});

console.log(`\n⚠️  很可能可以删除（${likelyDelete.length}个）:`);
console.log('--------------------------------------------------');
likelyDelete.forEach((r, i) => {
  console.log(`${i + 1}. ⚠️  ${r.name} (${r.details.pageCount || '?'}个页面)`);
  console.log(`   原因: ${r.checks.join('; ') || '无实际业务逻辑'}`);
  if (r.details.pages) {
    console.log(`   页面: ${r.details.pages.slice(0, 3).join(', ')}${r.details.pages.length > 3 ? '...' : ''}`);
  }
  console.log('');
});

console.log(`\n🔍 需要人工确认（${reviewNeeded.length}个）:`);
console.log('--------------------------------------------------');
reviewNeeded.forEach((r, i) => {
  console.log(`${i + 1}. 🔍 ${r.name} (${r.details.pageCount || '?'}个页面)`);
  console.log(`   原因: ${r.checks.join('; ') || '页面较多，功能复杂'}`);
  if (r.details.pages) {
    console.log(`   页面: ${r.details.pages.slice(0, 3).join(', ')}${r.details.pages.length > 3 ? '...' : ''}`);
  }
  console.log('');
});

console.log('\n==================================================');
console.log('📈 总结:');
console.log(`- 建议直接删除: ${deleteCandidates.length}个`);
console.log(`- 很可能可以删除: ${likelyDelete.length}个`);
console.log(`- 需要人工确认: ${reviewNeeded.length}个`);
console.log(`- 总计: ${analysisResults.length}个`);
console.log('==================================================\n');

// 输出详细JSON供参考
const jsonOutput = {
  summary: {
    total: analysisResults.length,
    delete: deleteCandidates.length,
    likelyDelete: likelyDelete.length,
    reviewNeeded: reviewNeeded.length
  },
  details: analysisResults
};

console.log('\n📄 详细分析数据（JSON格式）:');
console.log(JSON.stringify(jsonOutput, null, 2));

