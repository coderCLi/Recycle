/*
 * @Description: 位置坐标转换
 * @Author: zjw
 * @Date: 2025年1月3日11:48:27
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-02-21 15:00:53
 * @Remark: 
 */

 
// 定义一些常量
const x_PI = 3.14159265358979324 * 3000.0 / 180.0
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323
 
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换 / 即百度转谷歌、高德
 * @param { Number } bd_lon
 * @param { Number } bd_lat
 */
export function bd09togcj02 (bd_lon: number, bd_lat: number) {
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0
  var x = bd_lon - 0.0065
  var y = bd_lat - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  var gg_lng = z * Math.cos(theta)
  var gg_lat = z * Math.sin(theta)
  return [gg_lng, gg_lat]
}
 
/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换 / 即谷歌、高德 转 百度
 * @param { Number } lng
 * @param { Number } lat
 */
export function gcj02tobd09 (lng: number, lat: number) {
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
  var bd_lng = z * Math.cos(theta) + 0.0065
  var bd_lat = z * Math.sin(theta) + 0.006
  // 38.88007727054499 115.47092897951282
  // console.log(bd_lng, bd_lat)
  return {
    lat: bd_lng,
    lng: bd_lat
  }
}
 
/**
 * WGS84坐标系转火星坐标系GCj02 / 即WGS84 转谷歌、高德
 * @param { Number } lng 
 * @param { Number } lat 
 */
export function wgs84togcj02 (lng: number, lat: number) {
  if (outOfChina(lng, lat)) {
    return [lng, lat]
  }
  else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = lat / 180.0 * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    const mglat = lat + dlat
    const mglng = lng + dlng
    return [mglng, mglat]
  }
}
 
/**
 * GCJ02（火星坐标系） 转换为 WGS84 / 即谷歌高德转WGS84
 * @param { Number } lng 
 * @param { Number } lat 
 */
export function gcj02towgs84 (lng: number, lat: number) {
  if (outOfChina(lng, lat)) {
    return [lng, lat]
  }
  else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = lat / 180.0 * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    const mglat = lat + dlat
    const mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}
 
/**
 * 百度坐标系转wgs84坐标系
 * @param {*} lng 
 * @param {*} lat 
 */
export function bd09towgs84 (lng: number, lat: number) {
  // 百度坐标系先转为火星坐标系
  const gcj02 = bd09togcj02(lng, lat)
  // 火星坐标系转wgs84坐标系
  const result = gcj02towgs84(gcj02[0], gcj02[1])
  return result
}
 
/**
 * wgs84坐标系转百度坐标系，不准确，存在500米左右的偏差，改用wgs84ToBd.ts中转换方法，10米内误差
 * @param {*} lng 
 * @param {*} lat 
 */
export function wgs84tobd09 (lng: number, lat: number) {
  // wgs84先转为火星坐标系
  const gcj02 = wgs84togcj02(lng, lat)
  // 火星坐标系转百度坐标系
  const result = gcj02tobd09(gcj02[0], gcj02[1])
  return result
}
 
/**
 * 经度转换
 * @param { Number } lng 
 * @param { Number } lat 
 */
function transformlat (lng: number, lat: number) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
  return ret
}
 
/**
 * 纬度转换
 * @param { Number } lng 
 * @param { Number } lat 
 */
function transformlng (lng: number, lat: number) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
  return ret
}
 
/**
 * 判断是否在国内，不在国内则不做偏移
 * @param {*} lng 
 * @param {*} lat 
 */
function outOfChina (lng: number, lat: number) {
  return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
}

// 百度地图坐标转化腾讯地图坐标
export function baiduToTencentCoord (lat: number, lon: number) {
	let xPi = Math.PI * 3000 / 180;
	let x = lon;
	let y = lat;
	let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi);
	let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi);
	const txLon = z * Math.cos(theta) + 0.0065;
	const txLat = z * Math.sin(theta) + 0.006;
  return {
    lng: txLon,
    lat: txLat
  }
}
