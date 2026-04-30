/**
 * 百度地图文档：https://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/widget
 * 
 */
let isBaiduMapLoad = false;
import * as beans from "@/utils/beans";
let _win: any = globalThis;
import * as bridgeSdk from "./bridge";

// /**
//  * 添加定位点marker
//  * @param lng 
//  * @param lat 
//  */
// export const addLocationPoint = (lng: number, lat: number) => {
//     const baiduMap = beans.getGlobalThis().vueBaiduMap;

//     var point = new BMap.Point(lng, lat); // 创建点坐标

//     baiduMap.centerAndZoom(point, 12); // 初始化地图，设置中心点坐标和地图级别
//     baiduMap.enableScrollWheelZoom(true);
    
//     var marker = new BMap.Marker(point);
//     baiduMap.addOverlay(marker);

//     // 跳动的动画
//     marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
// }
  
/**
 * 地图sdk初始化
 * @returns
 */
export const InitBaiduMap = () => {
    return new Promise(async (resolve, reject) => {
      // #ifdef H5
      if(!isBaiduMapLoad){
        _win.BMAP_PROTOCOL = "https";
        _win.BMap_loadScriptTime = (new Date).getTime(); 
        await bridgeSdk.loadScript(__VITE_BMAP_API_URL__);
        await bridgeSdk.loadlink("https://api.map.baidu.com/res/webgl/10/bmap.css");
        isBaiduMapLoad = true;
      }

      // 先销毁原有地图实例，防止实例过多时造成页面崩溃自动刷新
      console.log("InitBaiduMap vueBaiduMap: ", beans.getGlobalThis().vueBaiduMap);
      if(beans.getGlobalThis().vueBaiduMap){
        beans.getGlobalThis().vueBaiduMap.clearOverlays();
        // beans.getGlobalThis().vueBaiduMap.destroy();
        beans.getGlobalThis().vueBaiduMap = null;
        console.log("vueBaiduMap destroy");
      }
      // setTimeout(() => {
        beans.getGlobalThis().vueBaiduMap = new BMap.Map("container", {
          // 构造底图时，关闭底图可点功能
          // enableMapClick:false
        });
        console.log("vueBaiduMap instance: ", beans.getGlobalThis().vueBaiduMap);
        // resolve(null);
      // }, 600);

      // // 引入百度地图API
      // var BMap = new bmap({
      //   ak: "teTdKifWjqeR540eVtMOrd3nVU6Mp4lu", //小程序
      // });
      // console.log("BMap: ", BMap);
      resolve(null);
      // #endif
      // #ifdef MP
      resolve(null);
      // #endif
    });
};
/**
 * 标记地图点，地图未初始化时自动初始化地图
 * @param  地图点 markerpoints 
markerpoints= [
    {
    id: Number(item.markersId),//markerId
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    height: 35,//高度
    width: 25,//宽度
    title:item.locationName,//标题
    address:item.address,//地址
    }
]
lng 经度  
lat 纬度
* @returns
*/
export const showMarker = async ({ markerpoints, lng, lat } : { markerpoints: any; lng: any; lat: any; }) => {
    return new Promise(async (resolve, reject) => {
      // #ifdef H5
      await InitBaiduMap();
      console.log("showMarker arguments: ", markerpoints, lng, lat);
      renderMarker({ markerpoints, lng, lat });
      resolve(markerpoints);
      // #endif
      // #ifdef MP
      resolve(markerpoints);
      // #endif
    });
};
  
/**
 * 渲染地图上的marker点，一般用于动态切换地图marker场景
 * @param  
*/
export const renderMarker = ({ markerpoints, lng, lat, zoom } : { markerpoints: any; lng: any; lat: any; zoom: any}) => {
  // #ifdef H5
  if(!isBaiduMapLoad){
    throw new Error("百度地图未加载！请调用showMarker方法渲染marker点 或 调用InitBaiduMap后再调用该方法渲染marker点！");
  }
  
  // markerpoints = [
  //   {
  //       "latitude": 38.8964091,
  //       "longitude": 115.4739283,
  //       "height": 35,
  //       "width": 25,
  //       "address": "乐凯大街与北二环交口南行200米路西"
  //   }
  // ];
  console.log("renderMarker markerpoints: ", markerpoints);
  
  if(!markerpoints){
    return;
  }
  
  const baiduMap = beans.getGlobalThis().vueBaiduMap;
  // 清空所有标记(标记点、路线等)
  baiduMap.clearOverlays();

  // 缩放控件type有四种类型: BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/  
  // var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); // 右下角，仅包含平移和缩放按钮
  // baiduMap.removeControl(top_right_navigation); 

  // addLocationPoint(lng, lat); // 添加定位点marker

  let point = new BMap.Point(lng, lat);
  // 初始化地图，设置中心点坐标和地图级别
  baiduMap.centerAndZoom(point, zoom || 12); 
  // 初始化地图,用城市名设置地图中心点
  // baiduMap.centerAndZoom("保定", 12);   

  // 启用滚轮放大缩小
  baiduMap.enableScrollWheelZoom();

  // 右下角，仅包含平移和缩放按钮
  baiduMap.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL, offset: new BMap.Size(3, 5)}));  

  // 比例尺控件
  baiduMap.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL, offset: new BMap.Size(75, 5)}));    

  // 定位控件
  const locationControl = new BMap.GeolocationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL, offset: new BMap.Size(40, 25)});
  // 添加定位事件
  locationControl.addEventListener("locationSuccess", function (e: any) {
    console.log("locationSuccess: ", e)
  });
  locationControl.addEventListener("locationError", function (e: { message: any; }) {
    console.log("locationError: ", e)
  });
  baiduMap.addControl(locationControl);    

  markerpoints.forEach((item: { height: any; width: any; info?: any; address?: any; longitude: any; latitude: any; title: any; iconPhotoUrl: any; }, index: any) => {
    console.log("item: ", item);
    const title = item.title || item.address;

    let point = new BMap.Point(item.longitude, item.latitude);
    let marker = null;
    if(item.iconPhotoUrl){
      // 本地走代理，防止出现跨域造成图片下载失败，导致marker无法渲染，正式环境走的nginx代理，一般不会出问题
      const iconUrl = process.env.NODE_ENV === "development" ? "/minio/"+ item.iconPhotoUrl.split("/minio/")[1] : item.iconPhotoUrl;
      // console.log("iconUrl: ", iconUrl);
      var myIcon = new BMap.Icon(iconUrl, new BMap.Size(32, 32));
      marker = new BMap.Marker(point, { icon: myIcon });
    }
    else {
      marker = new BMap.Marker(point)
    }
    marker.title = title;
    baiduMap.addOverlay(marker);

    marker.addEventListener("click", function (i: any) {
      console.log("marker click: ", i);
      uni.showToast({
        title: i.currentTarget.title,
        icon: "none"
      });
    });
  });
  // #endif

  // #ifdef MP
  
  // #endif
};


// 全局变量
let currentVisibleMarkers: any[] = [];
let renderTimeout: any = null;

export const specialRenderMarker = ({ markerpoints, lng, lat, zoom, isPoint }: { 
  markerpoints: any; 
  lng: any; 
  lat: any; 
  zoom: any;
  isPoint: any 
}) => {
  // #ifdef H5
  if (!isBaiduMapLoad) {
    throw new Error("百度地图未加载！请调用showMarker方法渲染marker点 或 调用InitBaiduMap后再调用该方法渲染marker点！");
  }
  
  console.log("renderMarker markerpoints count: ", markerpoints?.length || 0);
  
  if (!markerpoints || markerpoints.length === 0) {
    return;
  }

  const baiduMap = beans.getGlobalThis().vueBaiduMap;
  
  // 清空所有标记和之前的超时
  baiduMap.clearOverlays();
  if (renderTimeout) {
    clearTimeout(renderTimeout);
    renderTimeout = null;
  }
  
  // 设置中心点和缩放级别
  if (isPoint) {
    const point = new BMap.Point(lng, lat);
    baiduMap.centerAndZoom(point, zoom || baiduMap.getZoom());
  }
 
  
  // 添加地图控件
  addMapControls(baiduMap);

  // 存储所有点数据
  baiduMap._allMarkers = markerpoints;

  // 根据数据量决定渲染策略
  if (markerpoints.length > 500) {
    // 海量点使用分块加载+可视区域渲染
    renderMarkersInViewport(baiduMap);
  } else {
    // 少量点直接渲染
    renderMarkersInBatches(baiduMap, markerpoints);
  }

  // 添加地图事件监听
  setupMapEvents(baiduMap);
  // #endif
};

// 添加地图控件
function addMapControls(baiduMap: any) {
  // 启用滚轮放大缩小
  baiduMap.enableScrollWheelZoom();

  // 右下角，仅包含平移和缩放按钮
  baiduMap.addControl(new BMap.NavigationControl({
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT, 
    type: BMAP_NAVIGATION_CONTROL_SMALL, 
    offset: new BMap.Size(3, 5)
  }));  

  // 比例尺控件
  baiduMap.addControl(new BMap.ScaleControl({
    anchor: BMAP_ANCHOR_BOTTOM_LEFT, 
    type: BMAP_NAVIGATION_CONTROL_SMALL, 
    offset: new BMap.Size(75, 5)
  }));    

  // 定位控件
  const locationControl = new BMap.GeolocationControl({
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT, 
    type: BMAP_NAVIGATION_CONTROL_SMALL, 
    offset: new BMap.Size(40, 25)
  });
  
  locationControl.addEventListener("locationSuccess", (e: any) => {
    console.log("locationSuccess: ", e);
  });
  
  locationControl.addEventListener("locationError", (e: { message: any; }) => {
    console.log("locationError: ", e);
  });
  
  baiduMap.addControl(locationControl);
}

// 设置地图事件监听
function setupMapEvents(baiduMap: any) {
  // 移除旧的事件监听
  baiduMap.removeEventListener('zoomend');
  baiduMap.removeEventListener('moveend');
  
  // 添加缩放事件监听
  baiduMap.addEventListener('zoomend', () => {
    const currentZoom = baiduMap.getZoom();
    window.dispatchEvent(new CustomEvent('mapZoomChange', { detail: currentZoom }));
    
    // 延迟执行可视区域更新，避免频繁触发
    if (renderTimeout) clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
      if (baiduMap._allMarkers && baiduMap._allMarkers.length > 500) {
        renderMarkersInViewport(baiduMap);
      }
    }, 300);
  });
  
  // 添加移动结束事件
  baiduMap.addEventListener('moveend', () => {
    // 延迟执行可视区域更新，避免频繁触发
    if (renderTimeout) clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
      if (baiduMap._allMarkers && baiduMap._allMarkers.length > 500) {
        renderMarkersInViewport(baiduMap);
      }
    }, 300);
  });
}

// 渲染可视区域内的标记点
function renderMarkersInViewport(baiduMap: any) {
  const bounds = baiduMap.getBounds();
  const allMarkers = baiduMap._allMarkers;
  
  // 计算当前可视区域内的点
  const visibleMarkers = allMarkers.filter((item: any) => {
    const point = new BMap.Point(item.longitude, item.latitude);
    return bounds.containsPoint(point);
  });
  
  console.log(`显示 ${visibleMarkers.length}/${allMarkers.length} 个标记点`);
  
  // 避免不必要的重绘
  if (JSON.stringify(currentVisibleMarkers) === JSON.stringify(visibleMarkers.map((m: any) => m.id))) {
    return;
  }
  
  currentVisibleMarkers = visibleMarkers.map((m: any) => m.id);
  
  // 清空现有标记
  baiduMap.clearOverlays();
  
  // 分批渲染可视区域内的标记
  renderMarkersInBatches(baiduMap, visibleMarkers);
}

// 分批渲染标记，避免阻塞UI
function renderMarkersInBatches(baiduMap: any, markersData: any[], batchSize = 200) {
  let index = 0;
  const total = markersData.length;
  
  function renderBatch() {
    const batchEnd = Math.min(index + batchSize, total);
    
    for (; index < batchEnd; index++) {
      const item = markersData[index];
      createMarker(baiduMap, item);
    }
    
    if (index < total) {
      // 使用setTimeout分批渲染，避免阻塞UI
      setTimeout(renderBatch, 0);
    }
  }
  
  renderBatch();
}

// 创建单个标记点
function createMarker(baiduMap: any, item: any) {
  const point = new BMap.Point(item.longitude, item.latitude);
  let marker = null
  
  if (item.iconPhotoUrl) {
    const iconUrl = process.env.NODE_ENV === "development" 
      ? "/minio/"+ item.iconPhotoUrl.split("/minio/")[1] 
      : item.iconPhotoUrl;
    
    const myIcon = new BMap.Icon(iconUrl, new BMap.Size(item.width || 32, item.height || 32));
    marker = new BMap.Marker(point, { icon: myIcon });
  } else {
    marker = new BMap.Marker(point);
  }
  
  marker.title = item.title || item.address;
  baiduMap.addOverlay(marker);
  
  // 添加文字标签
  if (item.label) {
    const label = new BMap.Label(item.label.text || '', {
      position: point,
      offset: new BMap.Size(item.label.offsetX || 15, item.label.offsetY || -25)
    });
    
    label.setStyle({
      color: item.label.color || '#fff',
      fontSize: item.label.fontSize || '14px',
      fontWeight: item.label.fontWeight || 'bold',
      backgroundColor: 'transparent',
      border: 'none'
    });
    
    baiduMap.addOverlay(label);
  }
  
  marker.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent('mapMarkerClick', { detail: item }));
  });
}
export const specialInitBaiduMap = ({lng, lat, zoom}: {lng: any, lat: any, zoom: any}) => {
  console.log('地图渲染的经纬度',lng,lat);
  
    return new Promise(async (resolve, reject) => {
        // #ifdef H5
        if(!isBaiduMapLoad){
            _win.BMAP_PROTOCOL = "https";
            _win.BMap_loadScriptTime = (new Date).getTime(); 
            await bridgeSdk.loadScript(__VITE_BMAP_API_URL__);
            await bridgeSdk.loadlink("https://api.map.baidu.com/res/webgl/10/bmap.css");
            isBaiduMapLoad = true;
        }

        // 清除旧地图实例
        if(beans.getGlobalThis().vueBaiduMap){
            beans.getGlobalThis().vueBaiduMap.clearOverlays();
            // 移除所有事件监听
            beans.getGlobalThis().vueBaiduMap.removeEventListener('zoomend');
            beans.getGlobalThis().vueBaiduMap = null;
        }

        // 创建新地图实例
        const map = new BMap.Map("container");
        const point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, zoom || 15);
        
        // 存储地图实例
        beans.getGlobalThis().vueBaiduMap = map;
        const baiduMap = beans.getGlobalThis().vueBaiduMap;
        resolve(map);
        // #endif
        
        // #ifdef MP
        resolve(null);
        // #endif
    });
};
