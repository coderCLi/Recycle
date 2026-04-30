/**
 *
 * @param dateStr 日期字符串 
 */

export function formatDate (dateStr, type) { 
  const date = new Date(dateStr)
  const month = date.getMonth() + 1 // 月份从 0 开始，所以加 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0') // 处理小时为两位数
  const minutes = String(date.getMinutes()).padStart(2, '0') // 处理分钟为两位数
  let formattedDate
  if (type == 'MMDD') {
    return formattedDate = `${month}月${day}日`
  } else {
    formattedDate = `${month}月${day}日${hours}:${minutes}`

  }
  return formattedDate
}

// 格式化活动时间 2025-05-15 10:00:00  --> 20250515100000 --> 需要的时间
export function formatActivDate(str){ 
  if(str == null || str == ""){
    return "";
  }
    let date = str.replace(/[-: ]/g, ""); 
    // 提取各个部分
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);
    let hour = date.substring(8, 10);
    let minute = date.substring(10, 12);
    let second = date.substring(12, 14);
    const dateInfo = {
      topDate: `${month}月${day}日${hour}:${minute}`,
      bottomDate: `${month}月${day}日`,
      strTime: `${year}${month}${day}${hour}`,
    }
    // 返回格式化的日期字符串
    return dateInfo;
  }
