<template>
    <vc-modal ref="modal"></vc-modal>
    <input v-if="mockData.search" type="text" v-model="mockData.keyword">
    <button v-if="mockData.showMap" @click="getLocation(1)">展示当前位置</button>
    <button v-if="mockData.search" @click="getLocation(2)">搜索</button>
    <button v-if="mockData.showMap" @click="getLocation(3)">展示路线</button>
    <button v-if="mockData.showMap" @click="getLocation(4)">导航去目标位置</button>
    <button v-if="mockData.showMap" @click="getLocation(5)">展示多个标记点</button>
    <button v-if="mockData.showMap" @click="getLocation(6)">转换地址为经纬度</button>
    <button v-if="mockData.showMap" @click="getLocation(7)">转换经纬度为地址</button>
    <div>
        <input type="text" v-model="mockData.keyword">
        <button @click="getLocation(1)">查询</button>
        <div>icon</div>
    </div>


    <button v-if="mockData.showMap" @click="showScale">显示比例尺</button>
    <button v-if="mockData.showMap" @click="showZoom">显示放大缩小</button>
    <button v-if="mockData.showMap" @click="backLocation()">显示定位控件</button>

    <div id='result'>
        点击展示详细的地址：
        <div id='result_l' ref="result_l">{{ Loa }}</div>
    </div>
    <div v-if="mockData.showMap" id="container"></div>
</template>

<script setup lang="ts">

let baiduMap: any

type AddressData = {
    longitude?: number;     // 当前经度
    latitude?: number;      // 当前纬度

    defaultLongitude: number;      // 默认经度
    defaultLatitude: number;       // 默认纬度

    centerLongitude?: number;         // 地图中心点经度
    centerLatitude?: number;         // 地图中心点纬度

    // 终点坐标
    finallAddress?: string    //终点位置
    finalLongitude?: number;  // 终点经度
    finalLatitude?: number;  // 终点纬度

    // 过程坐标
    waypoints?: {
        longitude: number;
        latitude: number;
    }[];

    zoom: number;      // 缩放比例
    // 是否允许滚轮缩放
    showMap?: number;      // 是否展示地图 0不展示 1展示
    search?: number;      // 是否展示搜索框 0不展示 1展示
    keyword?: string;        // 搜索关键字
    navigationWay?: number;      // 导航方式 1驾车 2骑行 3步行 4公共交通
    policy?: any;           // 导航策略
    // BMAP_DRIVING_POLICY_DEFAULT  默认
    // BMAP_DRIVING_POLICY_FIRST_HIGHWAYS  优先高速
    // BMAP_DRIVING_POLICY_AVOID_HIGHWAYS  避免高速
    // BMAP_DRIVING_POLICY_AVOID_CONGESTION  避免拥堵
    markerpoints?: {            // 标记点数据
        opts?: {                // 标记点的配置
            width: number,      // 标记点的宽度
            height: number,     // 标记点的高度
            title: string,      // 标记点的标题
        },
        info?: string,    // 标记点弹出信息
        setContent?: string,  // 标记点的弹出信息的内部内容
        point: {                // 标记点的坐标
            longitude: number,
            latitude: number,
        };
    }[];






};

// 保定
// longitude: 115.490696,
// latitude: 38.8579735,

//北京
// longitude: 116.407395,
// latitude: 39.904211,

// 大连
// longitude: 121.642094,
// latitude: 38.921483,

// 点击位置经纬度：116.40367661001633,39.92401618393337
// 故宫博物馆

// 点击位置经纬度：116.43572815061235,39.908631741086275
// 北京站
const mockData = ref<AddressData>({
    // longitude: undefined,
    // latitude: undefined,
    defaultLongitude: 121.642094,
    defaultLatitude: 38.921483,
    // centerLongitude: undefined,
    // centerLatitude: undefined,


    zoom: 15,
    showMap: 1,
    search: 1,
    keyword: '火车站',
    policy: BMAP_DRIVING_POLICY_AVOID_CONGESTION,
    markerpoints: [
        {
            opts: {
                width: 100,
                height: 50,
                title: '第一步行街'
            },
            info: '这里是1633，337',
            setContent: `<a style="color: blue;">111</a>`,

            point: {
                longitude: 116.40367661001633,
                latitude: 39.92401618393337
            },
        },
        {
            opts: {
                width: 100,
                height: 50,
                title: '第二步行街'
            },
            setContent: `<a style="color: red;">222</a>`,
            info: '这里是1600，300',
            point: {
                longitude: 116.41,
                latitude: 39.93
            },
        },
    ],
});

// 获取当前位置
const getLocation = (type) => {
    baiduMap = new BMapGL.Map("container")
    var geolocation = new BMapGL.Geolocation();
    geolocation.getCurrentPosition((position: any) => {
        console.log('当前位置', position.point)
        mockData.value.longitude = position.point.lng;
        mockData.value.latitude = position.point.lat;
        baiduMap.clearOverlays() // 清空所有标记(标记点、路线等)
        nextTick(() => {
            switch (type) {
                case 0:
                    //只获取位置(默认当前)
                    break;
                case 1:
                    //展示位置(默认当前，可传值)
                    showPoint()
                    break;
                case 2:
                    // 搜索
                    getKeywordLocation()
                    break;
                case 3:
                    // 展示路线图
                    showWay()
                    break;
                case 4:
                    // 传入目标地址 使用当前位置(或默认位置)导航至目标地址
                    goPoint()
                    break;
                case 5:
                    // 展示多个标记点
                    showMarker()
                    break;
                case 6:
                    // 地址转为经纬度
                    transformToLoa()
                    break;
                case 7:
                    // 经纬度转为地址
                    transformToName()
                    break;
                default:
                    break;
            }
        });
        return
    }, (error: any) => {
        console.error('获取当前位置失败：', error)
    })

}


const getKeywordLocation = () => {
    // 以当前位置(或默认位置)搜索并展示结果(默认不展示地图,只展示结果列表)
    var point = new BMapGL.Point(mockData.value.longitude, mockData.value.latitude); // 创建点坐标 
    baiduMap.centerAndZoom(point, mockData.value.zoom); // 初始化地图，设置中心点坐标和地图级别
    var searchResults
    var options = {
        onSearchComplete: function (results) {
            // 判断状态是否正确
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                console.log('results', results)
                searchResults = results
                console.log('searchResults', searchResults)
            }
        }
    };

    var local = new BMapGL.LocalSearch(baiduMap, options);
    local.search(mockData.value.keyword);



    // // 遍历结果并输出
    // for (var i = 0; i < results.length; i++) {
    //     console.log(results[i].title);
    //     console.log(results[i].address);
    //     console.log(results[i].point.lng, results[i].point.lat);
    // }

    // 以当前位置(或默认位置)搜索限制范围
}

onMounted( () => {
    // baiduMap = new BMapGL.Map("container")
    getLocation(1)
})

// 展示位置(默认当前，可传值)
const showPoint = (longitude?: number, latitude?: number) => {
    var point = new BMapGL.Point(longitude || mockData.value.longitude, latitude || mockData.value.latitude); // 创建点坐标 
    baiduMap.centerAndZoom(point, mockData.value.zoom); // 初始化地图，设置中心点坐标和地图级别
    baiduMap.enableScrollWheelZoom(true);
    var marker = new BMapGL.Marker(point);
    baiduMap.addOverlay(marker);
}

const showWay = () => {
    // 以传入点(或当前位置、或默认位置)为中心建立地图并导航至目标位置
    // 接受中间点参数
    var point = new BMapGL.Point(mockData.value.longitude, mockData.value.latitude);
    baiduMap.centerAndZoom(point, mockData.value.zoom);
    baiduMap.enableScrollWheelZoom(true);

    var driving = new BMapGL.DrivingRouteLine(baiduMap, {
        renderOptions: {
            map: baiduMap,
            autoViewport: true,
            enableDragging: true,
        }
    })

    var start = new BMapGL.Point(116.236532, 39.904113661);
    var end = new BMapGL.Point(116.545486, 40.006040);
    var way = new BMapGL.Point(116.36315661025989, 39.904113661);

    driving.search(start, end, {
        waypoints: [way]
    });
}

const goPoint = () => {
    // 以传入点(或当前位置、或默认位置)为中心建立地图并导航至目标位置
    var point = new BMapGL.Point(mockData.value.longitude, mockData.value.latitude);
    baiduMap.centerAndZoom(point, mockData.value.zoom);

    var output = "从A到B驾车需要";
    var searchComplete = function (results) {
        if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
            return;
        }
        var plan = results.getPlan(0);
        output += plan.getDuration(true) + "\n";                //获取时间
        output += "总路程为：";
        output += plan.getDistance(true) + "\n";             //获取距离
    }
    // 开车导航至目标地点
    var transit = new BMapGL.DrivingRoute(baiduMap, {
        renderOptions: { map: baiduMap },
        policy: mockData.value.policy,
        onSearchComplete: searchComplete,
        onPolylinesSet: function () {
            setTimeout(function () { alert(output) }, 1000);
        }
    });
    // 开车导航只接受点坐标作为起终点  // 若为地址 则需要先转换为经纬度
    var start = new BMapGL.Point(116.404844, 39.911836);
    var end = new BMapGL.Point(116.308102, 40.056057);
    transit.search(start, end);
}


// 展示点标记
const showMarker = () => {

    // 百度地图API功能
    var point = new BMapGL.Point(116.40, 39.92); // 创建点坐标
    // var point = new BMapGL.Point(mockData.value.centerLongitude, mockData.value.centerLatitude); // 创建点坐标
    console.log('point', mockData.value.longitude, mockData.value.latitude)
    baiduMap.centerAndZoom(point, mockData.value.zoom); // 初始化地图，设置中心点坐标和地图级别
    baiduMap.enableScrollWheelZoom(true);
    if (mockData.value.markerpoints) {
        mockData.value.markerpoints.forEach((item, index) => {
            var opts = {
                width: item.opts?.width,
                height: item.opts?.height,
                title: item.opts?.title
            };
            var infoWindow = new BMapGL.InfoWindow(item.info, opts);
            var point = new BMapGL.Point(item.point.longitude, item.point.latitude);
            var marker = new BMapGL.Marker(point);
            baiduMap.addOverlay(marker);

            marker.addEventListener('click', function () {
                baiduMap.openInfoWindow(infoWindow, point); // 开启信息窗口
            });

            infoWindow.setContent(item.setContent);
        })
    } else {
        var point = new BMapGL.Point(mockData.value.longitude, mockData.value.latitude); // 创建点坐标
        console.log('point', mockData.value.longitude, mockData.value.latitude)
        baiduMap.centerAndZoom(point, mockData.value.zoom); // 初始化地图，设置中心点坐标和地图级别
        var marker = new BMapGL.Marker(new BMapGL.Point(mockData.value.longitude, mockData.value.latitude));
        baiduMap.addOverlay(marker);
    }
}

const Loa = ref('')
// 转换地址为经纬度 添加标记点并展示
const transformToLoa = () => {
    var geoc = new BMapGL.Geocoder();
    geoc.getPoint("保定市人民政府", function (rs) {
        console.log('rs', rs)
        mockData.value.longitude = rs.lng;
        mockData.value.latitude = rs.lat;
        showPoint(rs.lng, rs.lat)
        Loa.value = `经度为${rs.lng},纬度为${rs.lat}`
    }, "保定市")
}

// 转换经纬度为地址 添加标记点并展示
const transformToName = (longitude?: number, latitude?: number) => {
    // longitude: 121.642094,
    // latitude: 38.921483,
    // 百度地图API功能
    var point = new BMapGL.Point(longitude || mockData.value.longitude, latitude || mockData.value.latitude); // 创建点坐标
    showPoint(longitude || mockData.value.longitude, latitude || mockData.value.latitude);
    var geoc = new BMapGL.Geocoder();
    geoc.getLocation(point, function (rs) {
        console.log('ponint', point)
        console.log('rs', rs)
        var addComp = rs.addressComponents;
        Loa.value = addComp.province + "- " + addComp.city + ", " + addComp.district + "- " + addComp.street + "- " + addComp.streetNumber;
    })
}

// 比例尺 放大缩小 定位
const showScale = () => {
    var scaleControl = new BMapGL.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT,
        offset: new BMapGL.Size(100, 200),  // 控制比例尺的位置
        showZoomInfo: true,
    })

    // 将 ScaleControl 添加到地图中
    baiduMap.addControl(scaleControl);
}
const showZoom = () => {
    var zoomCtrl = new BMapGL.ZoomControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        offset: new BMapGL.Size(100, 200),  // 控制比例尺的位置
    })

    // 将 ScaleControl 添加到地图中
    baiduMap.addControl(zoomCtrl);
}

const backLocation = () => {
    // 创建定位控件
    var locationControl = new BMapGL.LocationControl({
        // 控件的停靠位置（可选，默认左上角）
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        // 控件基于停靠位置的偏移量（可选）
        offset: new BMapGL.Size(100, 200),  // 控制比例尺的位置
    });
    // 将控件添加到地图上
    baiduMap.addControl(locationControl);
}





// 计算位置并展示列表




</script>

<style lang="scss" scoped>
#container {
    width: 100%;
    height: 500px;
}
</style>