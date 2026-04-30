// 完整文档请参考：https://github.com/MikeMcl/big.js
// 解决js精度问题

// @ts-ignore
import Big from 'big.js';

// 加法
export const plus = (num1: string, num2: string): string => {
  return Big(num1).plus(num2).toString();
};

// 减法
export const minus = (num1: string, num2: string): string => {
  return Big(num1).minus(num2).toString();
};

// 乘法
export const multiply = (num1: string, num2: string): string => {
  return Big(num1).times(num2).toString();
};

// 除法
export const divide = (num1: string, num2: string): string => {
  return Big(num1).div(num2).toString();
};

// 等于
export const eq = (num1: string, num2: string): boolean => {
  return Big(num1).eq(num2);
};

// toFixed
export const toFixed = (num: string, decimalPlaces: number): string => {
  return Big(num).toFixed(decimalPlaces);
}
