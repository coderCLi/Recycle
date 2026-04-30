/*
 * @Description: 业务工具类
 * @Author: chenyulong
 * @Date: 2024-10-31 16:24:02
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-11-25 13:38:20
 * @Remark: 
 */

/**
 * 清除空格
 * @param str
 * @param is_global 是否替换所有空格
 * @returns {string}
 * @constructor
 */
export function trim(str: string, is_global: boolean) {
	is_global = is_global || true;
	let result;
	result = str.replace(/(^\s+)|(\s+$)/g, "");
	if (is_global) {
		result = result.replace(/\s/g, "");
	}
	return result;
}

/**
 * 处理手机号 隐藏中间⤴4位 133****1234
 * @param {Object} phone
 */
export function filterPhone(phone: string) {
	if (phone) {
		phone = String(phone).replace(/\s/g, "");
		return phone.substr(0, 3) + ' ' + '****' + ' ' + phone.substr(phone.length - 4);
	}
	return phone;
}

/**
 * 格式化身份证号 隐藏部分 15位：11014*******23  18位：110232********9223
 * @param {Object} number 
 */
export function filterIdNumber(number: string) {
	if (number) {
		number = String(number).replace(/\s/g, "");
		if (trim(number, true).length <= 15) {
			return number.substr(0, 5) + '********' + number.substr(14, 2);
		}
		if (trim(number, true).length > 15 && trim(number, true).length <= 18) {
			return number.substr(0, 6) + '********' + number.substr(14, 4);
		}
	}
	return number;
}

/**
 * 格式化身份证号 添加空格
 * @param {Object} number
 */
export function formatIdNumber(number: string) {
	if (number) {
		number = String(number).replace(/\s/g, "");
		if (trim(number, true).length > 6 && trim(number, true).length < 16) {
			return number.substr(0, 6) + ' ' + number.substr(6);
		}
		if (trim(number, true).length >= 16 && trim(number, true).length < 23) {
			return number.substr(0, 6) + ' ' + number.substr(6, 8) + ' ' + number.substr(14);
		}
	}
	return number;
}

/**
 * @param [*] arr 数组
 * @param [*] key 去重根据的key值，默认为id
 * @description 根据数组对象的某一个KEY值，进行去重
 */
export default function arrEq (arr:Array<any>, key = "id"){
	let hash: { [key: string]: boolean } = {};
	arr = arr.reduce((preVal, curVal) => {
	  hash[curVal[key]] ? "" : (hash[curVal[key]] = true && preVal.push(curVal));
	  return preVal;
	}, []);
	return arr;
  }

 /**
  * 姓名脱敏
  * @param {string} value 姓名
  * @returns {string} 脱敏后的性名
  */
 export function ellipsisName (value: string) : string {
	console.log(value)
	if (!value) return '';
	if (value.length > 1) {
	  return value.substring(0,1)+'*'+value.substring(2,value.length)
	}
	return value
  }
  
  /**
   * 手机号脱敏
   * @param {string} value 手机号
   * @returns {string} 脱敏后的手机号
   */
  export function ellipsisPhone (value: string) : string {
	return filterPhone(value)
  }     
  