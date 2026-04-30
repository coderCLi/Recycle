/**
 * 正则大全
 */
export default {
  // 金额：纯数字、小数点后两位
  checkMoney(source: string){
    const reg = /(^-?[1-9]([0-9]+)?(\.\d{0,2})?$)|(^-?[0]{1}(\.\d{0,2})?$)/
    return reg.test(source)
  },
  // Email地址
  checkEmail(source: string){
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return reg.test(source)
  },
  // 手机号码
  checkPhone(source: string){
    const reg = /^(1[3-9][0-9])\d{8}$/
    return reg.test(source)
  },
  // 客服电话 7-12位
  checkCustomerTel(source: string){
    const reg = /(^[0-9]{3}-?[0-9]{4,8}$)|(^[0-9]{4}-?[0-9]{3,7}$)/
    return reg.test(source)
  },
  // 电话号码
  checkTel(source: string){
    const reg = /^((\d{3,4}-)|\d{3.4}-)?\d{7,8}$/
    return reg.test(source)
  },
  // 国内电话号码
  checkLocalTel(source: string){
    const reg = /\d{3}-\d{8}|\d{4}-\d{7}/
    return reg.test(source)
  },
  // 身份证号
  checkId(source: string){
    const reg = /^\d{8,18}|[0-9x]{8,18}|[0-9X]{8,18}$/
    const idCardPattern = /^(?:\d{15}|\d{17}[\dXx])$/;
    return reg.test(source) && idCardPattern.test(source)
  },
  checkIdNew(source: string) {
      // 支持15位和18位身份证
      const idCardPattern = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]$|^[1-9]\d{5}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}$/;
      return idCardPattern.test(source);
  },
  // 帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)
  checkAccount(source: string){
    const reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
    return reg.test(source)
  },
  // 英文
  checkEn(source: string){
    const reg = /^[A-Za-z]{4,40}$/
    return reg.test(source)
  },
  // 汉字
  checkHz(source: string){
    const reg = /^[\u4e00-\u9fa5]{0,}$/
    return reg.test(source)
  },
  // 数字
  checkNum(source: string){
    const reg = /^[0-9]*$/
    return reg.test(source)
  },
  // 检验验证码
  checkCode(source: string){
    const reg = /^[0-9]{4}$/
    return reg.test(source)
  },
  // 密码，数字、字母、特殊符号，包含两种或两种以上的组合，长度8-16位
  checkPass(source: string){
    // 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
    // const reg = /^[a-zA-Z]\w{5,17}$/
    const reg = /^(?![\d]+$)(?![A-Za-z]+$)(?![!@#$%^&*()\-\_=+\[\]{}|\\:;\"'<>,.?/~`]+$)[\dA-Za-z!@#$%^&*()\-\_=+\[\]{}|\\:;\"'<>,.?/~`]{8,16}$/
    return reg.test(source)
  },
  passHint: "请输入正确的密码",
  passRule: "（数字、字母、特殊符号，包含两种或两种以上的组合，长度8-16位）",
  // 强密码(必须包含大小写字母、数字、特殊字符，长度不低于8位)
  checkStrongPass(source: string){
    //  const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
	//  const reg = /(?=.*[a-zA-Z])(?=.*\d)(?=.*[#@!~%^&*])[a-zA-Z\d#@!~%^&*]{8,}/;
	const reg = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}/;
    return reg.test(source)
  },
  // 日期格式
  checkDate(source: string){
    const reg = /^\d{4}-\d{1,2}-\d{1,2}/
    return reg.test(source)
  },
  // 域名
  checkNetName(source: string){
    const reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\/.?/
    return reg.test(source)
  },
  // InternetURL
  checkInternetURL(source: string){
    const reg = /^[a-zA-z]+:\/[^\s]*$/
    return reg.test(source)
  },
  // xml文件
  checkXml(source: string){
    const reg = /^([a-zA-Z]+-?)+[a-zA-Z0-9]+\\.[x|X][m|M][l|L]$/
    return reg.test(source)
  },
  // 双字节字符
  checkDoubleChart(source: string){
    const reg = /[^\x00-\xff]/
    return reg.test(source)
  },
  // 空白行的正则表达式
  checkBlankRow(source: string){
    const reg = /\n\s*\r/
    return reg.test(source)
  },
  // HTML标记的正则表达式
  checkHtml(source: string){
    const reg = /^<(\S*?)[^>]*>.*?<\/\1>|<.*? \/>$/
    return reg.test(source)
  },
  // 首尾空白字符的正则表达式，可以用来删除行首行尾的空白字符(包括空格、制表符、换页符等等)
  checkWhiteChart(source: string){
    const reg = /^\s*|\s*$/
    return reg.test(source)
  },
  // 腾讯QQ号
  checkQQ(source: string){
    const reg = /^[1-9][0-9]{4,}$/
    return reg.test(source)
  },
  // 中国邮政编码为6位数字
  checkChinaPost(source: string){
    const reg = /^[1-9]\d{5}(?!\d)$/
    return reg.test(source)
  },
  // IP地址
  checkIp(source: string){
    const reg = /^\d+\.\d+\.\d+\.\d+$/
    return reg.test(source)
  },
  // IP地址
  checkIpDetail(source: string){
    const reg = /^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$/
    return reg.test(source)
  },
  // 可以输入含有^%&',;=?$\"等字符
  checkSpecialChart(source: string){
    const reg = /[^%&',;=?$\x22]+/
    return reg.test(source)
  },
  // 禁止输入含有~的字符
  checkForbidChart(source: string){
    const reg = /[^~\x22]+/
    return reg.test(source)
  },
  // 中文、英文、数字但不包括下划线等符号
  checkEnNumZnNo_(source: string){
    const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
    return reg.test(source)
  },
  // 中文、英文、数字包括下划线
  checkEnNumZn_(source: string){
    const reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    return reg.test(source)
  },
    //姓名的验证
  checkName(source: string){
    const reg = /^[a-zA-Z\u4e00-\u9fa5·]{2,40}$/
    return reg.test(source)
  },
  // 由数字、26个英文字母或者下划线组成的字符串
  checkEnNum_(source: string){
    const reg = /^\w+$/
    return reg.test(source)
  },
  // 由数字和26个英文字母组成的字符串
  checkAllEnNum(source: string){
    const reg = /^[A-Za-z0-9]+$/
    return reg.test(source)
  },
  // 长度为3-20的所有字符
  checkAllChart(source: string){
    const reg = /^.{3,20}$/
    return reg.test(source)
  },
  // n位的数字
  checkBitNum(source: string){
    const reg = /^\d{n}$/
    return reg.test(source)
  },
  // m-n位的数字
  checkNumMToN(source: string){
    const reg = /^\d{m,n}$/
    return reg.test(source)
  },
  // 零和非零开头的数字
  checkOrNoZeroNum(source: string){
    const reg = /^(0|[1-9][0-9]*)$/
    return reg.test(source)
  },
  // 非零开头的最多带两位小数的数字
  checkNoZeroNum(source: number){
	  //  0不校验
	 if(source==0){
		return true
	 }
    const reg = /^-?([1-9][0-9]*)+(.[0-9]{1,2})?$/
    return reg.test(String(source))
  },
  // 带1-2位小数的正数或负数
  checkDigital1t2Num(source: string){
    const reg = /^(\-)?\d+(\.\d{1,2})?$/
    return reg.test(source)
  },
  // 正数、负数、和小数
  checkRegularNum(source: string){
    const reg = /^(\-|\+)?\d+(\.\d+)?$/
    return reg.test(source)
  },
  // 有1~3位小数的正实数
  checkReal1T3PNum(source: string){
    const reg = /^[0-9]+(.[0-9]{1,3})?$/
    return reg.test(source)
  },
  // 非零的正整数
  checkNoZeroPNum(source: string){
    const reg = /^\+?[1-9][0-9]*$/
    return reg.test(source)
  },
  // 非零的负整数
  checkNoZeroNNum(source: string){
    const reg = /^-[1-9]\d*$/
    return reg.test(source)
  },
  // 浮点数
  checkFloat(source: string){
    const reg = /^(-?\d+)(\.\d+)?$ 或 ^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/
    return reg.test(source)
  }
}
