export function expireTime(str) {
    if (!str) {
        return;
    }
    let NowTime = new Date().getTime();
    //IOS系统直接使用new Date('2018-10-29 11:25:21')，在IOS上获取不到对应的时间对象。
    let ostr = formatDate(str);
    
    let totalSecond = Date.parse(ostr.replace(/-/g, '/')) - NowTime || [];
    if (totalSecond < 0) {
        return;
    }
    console.log(totalSecond, 'totalSecond');

    return totalSecond
}
export function formatDate(str){
    if (str.length !== 14) {
        throw new Error("输入的日期字符串长度不正确");
    }
    
    // 提取各个部分
    let year = str.substring(0, 4);
    let month = str.substring(4, 6);
    let day = str.substring(6, 8);
    let hour = str.substring(8, 10);
    let minute = str.substring(10, 12);
    let second = str.substring(12, 14);
    
    // 返回格式化的日期字符串
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function dataFamte (item, type) {
    if (!item) return ''
    let data = ''
    if (type == 'yyyy-mm-dd') {
      let y = item.slice(0, 4)
      let m = item.slice(4, 6)
      let d = item.slice(6)
      data = y + '-' + m + '-' + d
    } else if (type == 'hh:mm:ss') {
      let h = item.slice(0, 2)
      let m = item.slice(2, 4)
      let s = item.slice(4)
      data = h + '-' + m + '-' + s
    } else if (type == 'yyyy-mm-dd hh:mm:ss') {
      let y = item.slice(0, 4)
      let m = item.slice(4, 6)
      let d = item.slice(6, 8)
      let h = item.slice(8, 10)
      let mm = item.slice(10, 12)
      let s = item.slice(12)
      data = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }
    return data
  }