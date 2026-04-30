export function getClosestTime(targetTimes) {
  // 获取当前时间并转换为分钟数
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  // 初始化最小差值和最接近的时间
  let minDiff = Infinity;
  let closestTime = null;

  // 遍历所有目标时间点，找出最接近的时间
  targetTimes.forEach(time => {
    const [hours, minutes] = time.split(':').map(Number);
    const targetTimeInMinutes = hours * 60 + minutes;
    
    // 计算时间差（考虑跨天情况）
    let diff = Math.abs(currentTimeInMinutes - targetTimeInMinutes);
    // 处理跨天情况（24小时 = 1440分钟）
    diff = Math.min(diff, 1440 - diff);
    
    if (diff < minDiff) {
      minDiff = diff;
      closestTime = time;
    }
  });

  return closestTime;
}

// 使用示例
// const targetTimes = ['3:00', '12:00', '18:00', '23:59'];
// const closestTime = getClosestTime(targetTimes);
// console.log(`当前时间最接近：${closestTime}`);