/*
 * @Description: WGS84 坐标转换为百度坐标
 * @Author: chenyulong
 * @Date: 2025-02-21 13:54:14
 * @LastEditors: chenyulong
 * @LastEditTime: 2025-02-22 16:39:50
 * @Remark: 误差10米内
 */

// 以下是之前定义的转换函数代码
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var pi = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

// 判断是否在国内
function outOfChina(lat: number, lon: number) {
    if (lon < 72.004 || lon > 137.8347) return true;
    if (lat < 0.8293 || lat > 55.8271) return true;
    return false;
}

// WGS-84转换GCJ-02
function wgs84ToGcj02(latlon: { lat: number; lng: number; }[]) {
    var point = [];
    for (const item of latlon) {
        if (outOfChina(item.lat, item.lng)) {
            point.push({ lat: item.lat, lng: item.lng });
            return point;
        }
        var dLat = transformLat(item.lng - 105.0, item.lat - 35.0);
        var dLon = transformLon(item.lng - 105.0, item.lat - 35.0);
        var radLat = item.lat / 180.0 * pi;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        var lat = item.lat + dLat;
        var lng = item.lng + dLon;
        point.push({ lat: lat, lng: lng });
    }
    return point;
}

// GCJ-02转换BD-09
function gcj02ToBd09(lng: number, lat: number) : { lng: number; lat: number } {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return { lng: bd_lng, lat: bd_lat };
}

// 纬度转换
function transformLat(x: number, y: number) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

// 经度转换
function transformLon(x: number, y: number) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

/**
 * WGS84坐标转换为百度坐标
 * @param wgs84Points WGS84坐标数组
 * @returns 百度坐标数组
 */
export function wgs84tobd09(wgs84Points: { lat: number; lng: number; }[]) {
    // // 假设你传入的WGS84坐标数组
    // var wgs84Points = [
    //     { lat: 39.90923, lng: 116.397428 },
    //     { lat: 31.230416, lng: 121.473701 }
    // ];

    // 先将WGS84坐标转换为GCJ02坐标
    var gcj02Points = wgs84ToGcj02(wgs84Points);

    // 再将GCJ02坐标转换为BD-09坐标
    var bd09Points: { lng: number; lat: number }[] = [];
    for (var i = 0; i < gcj02Points.length; i++) {
        var bd09Point = gcj02ToBd09(gcj02Points[i].lng, gcj02Points[i].lat);
        bd09Points.push(bd09Point);
    }

    console.log("WGS84坐标转换为百度坐标结果: ", bd09Points);

    return bd09Points;
}

/**
 * 
 * @param bd_lng 百度经度
 * @param bd_lat 百度纬度
 * @returns 转换后的GCJ-02坐标
 */
export function bd09ToGcj02(bd_lng: number, bd_lat: number) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return { lng: gg_lng, lat: gg_lat }
}
