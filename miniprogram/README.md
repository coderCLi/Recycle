### h5、小程序跨平台源码说明

##### 前端主要技术
uniApp（基础跨端框架） + vite + vue3 + ts + uview-plus（手机端ui组件库）

##### vue2升级vue3注意事项
https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html

##### 手机端跨端组件参考文档
https://uiadmin.net/uview-plus/components/intro.html

##### 状态管理
https://pinia.vuejs.org/zh/core-concepts/getters.html

##### 组件开发要求
必须按照现有组件示例开发，后续方便维护和升级，组件对应的props.js中为动态可配置项属性（外部可自定义传入），静态属性可直接在组件中使用，无需在props.js中配置。

##### bridgeSdk使用说明
统一封装项目中的公用方法，h5、小程序调用时，无需再考虑内层实现，有问题只需api内层统一修改即可；该文件也作为sdk的聚合入口，所有sdk的引用均从该文件中进行；vue文件中建议直接通过this使用，比如：`this.bridgeSdk.xxx()`，不建议重复引用；
js文件中可按需引用bridge.ts或utils.ts文件，使用其中对应的方法即可，更多功能请查看bridge.ts、utils.ts、decimal.ts等文件；
页面调用示例：
1. 获取客户端环境信息 `await this.bridgeSdk.getEnvironment()`
2. url解析 `const res = this.bridgeSdk.getUrlObj()`
3. 获取随机数 `const res = this.bridgeSdk.keyStr()`
4. 生成uuid `const res = this.bridgeSdk.generateUUID()`
5. 获取设备信息 `const res = this.bridgeSdk.getDeviceInfo()`
6. 获取屏幕尺寸信息 `const res = this.bridgeSdk.getWindowInfo()`
7. 存储中获取信息 `this.bridgeSdk.getStorageSync()`
8. 存储中设置信息 `this.bridgeSdk.setStorageSync()`
9. 删除存储的信息 `this.bridgeSdk.removeStorageSync(')`
10. 清除所有存储信息 `this.bridgeSdk.clearStorageSync()`
11. 获取系统信息 `const res = this.bridgeSdk.getSystemInfoSync()`
12. 打开外部链接 `this.bridgeSdk.openOuterPage()`
13. 退出登录 `this.bridgeSdk.logout()`
14. 获取用户信息 `this.bridgeSdk.getUserInfo()`
15. 检测是否登录（自动拉登录） `const isLogin = await this.bridgeSdk.checkLogin()`
17. 跳转登录页面 `this.bridgeSdk.toLogin()`
18. 获取当前页面路由及配置信息 `const router = this.bridgeSdk.getCurrentRouter()`
19. 获取两坐标点间距离 `const distance = this.bridgeSdk.getDistanceFromTowPoints()`
20. 查找路由与delta层级 `const route = this.bridgeSdk.getPageFromRouter()`
21. 指定返回级数或页面名称返回页面 `this.bridgeSdk.navigateBackTo()`
22. 统一跳转方法（打开小程序、h5页面、小程序页面等）：`this.bridgeSdk.jumpPage()`
23. 通过短路径获取static静态资源完整路径 `const res = this.bridgeSdk.importMainStatic()`
24. aes加密 `const res = this.bridgeSdk.aesEncrypt()`
24. aes解密 `const res = this.bridgeSdk.aesDecrypt()`
25. rsa加密 `const res = this.bridgeSdk.encryptString()`
26. 非空校验 `const res = this.bridgeSdk.checkIsEmpty()`
27. 打开地图 `this.bridgeSdk.openMap()`
28. 调用hbd-js-sdk中api `this.bridgeSdk.hi.xxx()` 具体api文档参考：https://izhuzi.top/hbd-docs/#/
29. 返回首页 `this.bridgeSdk.toFirstPage()`
30. confirm弹窗 `this.bridgeSdk.showConfirm()`
31. alert弹窗 `this.bridgeSdk.showAlert()`
32. toast提示 `this.bridgeSdk.showToast()`
32. 动态参数解析 `this.bridgeSdk.dynamicParamsToStaticParams()`
33. 自动更新用户信息 `this.bridgeSdk.updateUserInfo()`
34. 数字处理类 `this.bridgeSdk.decimal.plus()` `this.bridgeSdk.decimal.minus()` `this.bridgeSdk.decimal.multiply()` `this.bridgeSdk.decimal.divide()` `this.bridgeSdk.decimal.eq()`
35. 打电话 `this.bridgeSdk.makePhoneCall()`
36. 扫码 `this.bridgeSdk.scanCode()`
37. 获取渠道标识 `this.bridgeSdk.getChannel()`
38. 是否开发环境 `this.bridgeSdk.isDev()`
39. 判断指定页面是否是tabbar页 `this.bridgeSdk.isTabbar()`
40. 通过tabbar索引获取tabbar页面路径 `this.bridgeSdk.getTabPage()`
41. 跳转本项目首页，支持H5、小程序 `this.bridgeSdk.toUniAppFirstPage()`
43. 路线规划导航 `this.bridgeSdk.routePlan()`
44. 活动白名单拦截 `this.bridgeSdk.whitelist.checkWhiteListPermission()`
45. 执行上级页面的指定方法 `this.bridgeSdk.execPrePageMethod()`
46. 执行上级页面的指定方法及回退 `this.bridgeSdk.navigateBackWithMethodExecution()`
47. 校验是否实名, 未实名时自动拉起实名 `this.bridgeSdk.checkIdentityAuth()`

##### 页面跳转
1. 使用this.bridgeSdk.jumpPage进行系统内页面跳转、小程序跳转、外部h5页面跳转、打电话、扫码等，同时支持微信小程序和App端，支持登录验证、实名验证、人脸验证等，详细配置请参考该方法的具体实现，后续会按需扩展更多功能。
2. 使用this.bridgeSdk.jumpPage页面跳转时支持解析动态变量，无论是小程序页面、h5页面均可这么配置参数，只要dynamicParamsToStaticParams方法中扩展好参数解析逻辑，理论上能满足绝大多数场景的需求，管理端可自由控制发布的服务的权限控制；

##### 页面跳转-动态参数解析示例
1.1 太行步道功能
解析前配置：
```js
https://www.bdthi.cn/#/pages/index?needLogin=true&__hbd__encryptData__=true_name::$realName,phone::$phone,id_no::$idcard,encryptMode::aes,encryptKey::35f3609fe08824ef,encryptIv::abe8ab1234567890,__r__::$timestamp
```
解析后的跳转第三方时的实际地址：
```js
https://www.bdthi.cn/#/pages/index?__hbd__encryptData__=xaUTkCJOfGjYFwXfFNJi9qXzPp+VsqERh91WW2CAbwUCDFOPfL0Knu66twnUA9PhYXFliNb+WG7KvlqvzEPi/Q==
```

1.2 停车服务功能
解析前配置：
```js
https://dev.ttpark.cn/MobileServer/web/sdk/buttjoin/index.html?userGroupID=2&tAppID=498&signType=DEP5&needLogin=true&__hbd__encryptData__=tel::$phone,timestamp::$timestamp,encryptMode::des,encryptKey::1FB0438CD0C7E0A2,__hbd__encryptData__replace::sign
```
解析后的跳转第三方时的实际地址：
```js
https://dev.ttpark.cn/MobileServer/web/sdk/buttjoin/index.html?userGroupID=2&tAppID=498&signType=DEP5&sign=+RGCpf6huvKVOr3FsjzicjZvIIpEZ4XyWVFDZEq2Tw9HDq3XRBREkjmivc+QTXeN
```

1.3 文明专区功能
解析前配置：
```js
https://life.hihihi.com.cn/dt/#/?needLogin=true&userId=$id&userName=$nickname&phone=$phone&activityId=643950a9-47dc-413b-bd70-6299b7cc8443
``` 
解析后的跳转第三方时的实际地址：
```js
https://life.hihihi.com.cn/dt/#/?userId=216237&userName=HBD_NXpQsem4om&phone=18342803026&activityId=643950a9-47dc-413b-bd70-6299b7cc8443
```
参详细参数说明请参考src/utils/utils.ts中dynamicParamsToStaticParams的方法实现；

##### 页面回退
1. 使用this.bridgeSdk.navigateBackTo方法进行页面回退，支持返回指定层级页面、指定路由页面，支持回退时调用上个页面的方法实现一些特殊的逻辑，比如更新页面数据等；
```js
this.bridgeSdk.navigateBackTo({
    delta: 1,
    success(page) {
        console.log(page);
        // 这里调用上个页面的方法，注意可能为空，onBack是上个页面methods中定义的方法
        page && page.onBack && page.onBack();
    }
});
```

##### 数字精度处理
项目中涉及到金额、价格等数字处理时，统一使用decimal.ts中的方法进行精度处理，避免小数点精度丢失；
````js
console.log("decimal plus", this.bridgeSdk.decimal.plus(0.1, 0.2));
console.log("decimal minus", this.bridgeSdk.decimal.minus(0.1, 0.2));
console.log("decimal multiply", this.bridgeSdk.decimal.multiply(0.1, 0.2));
console.log("decimal divide", this.bridgeSdk.decimal.divide(0.1, 0.2));
console.log("decimal eq", this.bridgeSdk.decimal.eq(this.bridgeSdk.decimal.plus(0.1, 0.2), 0.3));
```

##### 校验登录
需要登录的功能（涉及到用户信息或业务功能要求本身如此）：如果未登录点击时，统一提示："您还未登录，是否去登录？"，点击左侧的 否 时关闭弹窗，点击右侧的 去登录 时跳转登录页面，登录后返回到来源页。uniapp项目调用jumpPage时传needLogin: true可实现校验登录逻辑；app端自行实现逻辑。

##### 埋点统计
目前支持app端webview h5页面埋点统计、小程序原生页面埋点统计、小程序webview h5埋点统计、普通h5页面埋点统计;
某个功能想埋点的话，直接调用this.trackCustom方法即可，详细配置请参考该方法的具体实现；
```js
this.trackCustom(
    // 埋点事件名称，必填，比如：点击了国庆活动领奖按钮
    "event_name",
    // 额外信息，非必填，可省略
    JSON.stringify({
        // 自定义属性
        "phone": "18342803026",
        "nickname": "小可爱"    
    })
)
```
已集成的埋点统计功能，无需再重复如下功能：
1. 页面跳转已添加埋点统计功能，路由拦截器中统一处理了。
2. 接口请求时已添加埋点统计功能，请求拦截器中统一处理了。
3. jumpPage方法中在关键节点处，比如：跳转小程序、打电话、打开第三方h5页面等，已添加埋点统计功能。

##### 功能建设
所有功能：如果存在功能未开放或未开发时，提示："功能建设中，敬请期待！"，uniapp项目，调用jumpPage方法时，传：isBuilding：true即可；app端自行实现逻辑。

##### 请求接口
请求接口时支持验证登录，未登录时跳转到登录页面；支持请求报文加密、响应报文解密、签名，仅需添加配置项即可开启或关闭；接口调用参考：src/api/demo.ts中相关配置及src/utils/http.ts中请求封装说明；

多个异步请求同时发起时，getToken接口和本地代码会生成多对加解密密钥、偏移量，部分交易会因为密钥、偏移量与后台不一致造成解密异常，开发时采用await方式处理并发请求

1. A请求检测到无token时------调用生成token接口（携带前端生成的aesKey A）------服务端接受A的请求，生成新的token、iv A并返回给前端，然后调用A请求继续实际交易，此时前端用的密钥、偏移量可能是A对应的，也可能是B对应的
2. B请求检测到无token时------调用生成token接口（携带前端生成的aesKey B）------服务端接受B的请求，生成新的token、iv B并返回给前端，然后调用B请求继续实际交易，此时前端用的密钥、偏移量可能是A对应的，也可能是B对应的

因为A、B请求的响应时间不固定，不确定谁先返回，就会概率性出现后台使用B的密钥、偏移量加密时，前端此时使用A的密钥、偏移量解密时，导致解密异常，报错Error: Malformed UTF-8 data这样的错误，目前测试微信小程序首次进入（无缓存时）必现，h5端无问题。

##### 项目启动
运行项目依赖的node版本：v18及以上，经测试，v20.17.0、v18.20.4均可以

##### 拦截器
src/interceptors/request.ts 请求拦截器，请求前处理，如请设置请求头
src/interceptors/route.ts 路由拦截器，路由跳转前处理参数等

##### 环境切换
旧版环境信息配置文件.env.development、.env.production由于无法满足多环境自由切换配置需求，不利于自动化部署场景环境的自由切换，已废除，仅保留.env基础的配置信息，请在package.json中uni-app.scripts字段下进行所需环境的独特配置；

##### 运行与发行
HBuilderX运行时点击所需的环境，HBuilderX发行时点击自定义发行，选择所需的环境，npm运行自定义命令示例
`npm run dev:custom mp-weixin-dev` 使用自定义脚本运行
`npm run build:custom mp-weixin-pro` 使用自定义脚本发行

##### 静态资源
分包静态资源目录必须叫static，不能使用assets之类的名字，否则会被打包进主包，导致主包体积过大；

##### sdk资源包引用
1. 一般来说，放在static下对应的平台目录下即可，如static/web/library/sdk/countly.web.js，static/mp-weixin/library/sdk/countly.wx.js，务必注意自己下载的sdk的多端兼容性，建议在bridge.ts或utils.ts中按需定义sdk的统一的管理入口，配合uniApp的条件编译机制，分别编写多端的单独适配代码，不要直接在页面中调用sdk的api，除非该sdk能同时满足多端；
2. uniApp运行和发行模式对static文件夹下的某些sdk的处理逻辑不一致，某些特殊情况下会出现偶尔编译失败，读不到sdk内容的情况，这个时候可以把sdk文件挪到utils/library/sdk下，可解决该问题；

##### 命名规则
分包名、组件名保持一致，英文单词间用-连接，如pages-index、components-header，不要再使用驼峰了；

##### 用户信息获取
1、非敏感用户信息页面中获取方式：
```js
// 引入
import { useBaseStore, useUserStore } from "@/store/index";
// 绑定计算属性
computed: {
    ...mapState(useUserStore, {
        // 非敏感用户信息，比如昵称、头像等
      userInfo: "userInfo",
      // 登录状态
      isLogined: "isLogined"
    })
}
```
2、敏感用户信息页面中获取方式：
```js
// 包含用户身份证号、真实姓名、手机号等敏感信息，请保证先登录，再获取用户信息，该方式不会自动拉登录，未登录时返回null
const userInfo = this.bridgeSdk.getUserInfo()
// 包含用户身份证号、真实姓名、手机号等敏感信息，该方式在用户未登录时会直接拉登录，已登录时直接返回用户信息
const userInfoAutoLogin = await this.bridgeSdk.checkLogin()
```

##### 登录拦截回调
有一些场景需要登录，当用户未登录时，会自动拉起登录功能，此时接口或者初始化逻辑未正确按预期执行，导致页面显示异常，往往我们需要在登录完成后返回来源页时，重新走一遍初始化逻辑或接口调用；目前已经支持在登录完成后回调来源页的__loadData__方法，具体使用方式如下：
在来源页添加方法如下：
```js
methods: {
    // 登录完成后回调该方法，当然如果不需要这种回调，可以不定义该方法
    __loadData__() {
        // 重新初始化逻辑或接口调用
    }
}
```

##### 登录拦截配置说明
1、页面进入时需要验证登录，未登录时自动拉起登录
```json
// 页面配置项中添加needLogin: true
{
    "path": "pages/app-h5/third-h5",
    "style": {
        "navigationBarTitleText": ""
    },
    // 默认无需登录
    "needLogin": true
}
```
2、jumpPage方法进行页面跳转时需要验证登录，未登录时自动拉起登录，单独参数配置是否验证自动登录
```js
this.bridgeSdk.jumpPage({
    url: "/pages/index/index",
    // 默认不验证登录
    needLogin: true
})
```
3、jumpPage方法进行页面跳转时需要验证登录，未登录时自动拉起登录，验证url参数中是否有needLogin=true，如果有，则验证登录，否则不验证登录
```
// 默认不验证登录
this.bridgeSdk.jumpPage("/pages/index/index?needLogin=true")
```
4、接口调用时需要验证登录，未登录时自动拉起登录
```
http('/foo2', data, { 
    // 默认不验证登录
    login: true
})
```

##### 加解密配置说明
请求报文需要加密，响应报文需要解密
```js
http('/foo', data, { 
    // 请求报文默认加密（aes加密），可省略此参数，false表示不加密
    encrypt: true, 
    // 响应报文默认解密（aes解密），可省略此参数，false表示不解密
    decrypt: true
})
```

##### http请求
src/utils/http.ts作为工程的基础请求模块，默认可通过参数配置请求是否加密、响应是否解密、请求之前是否验证登录等逻辑；
现作如下说明：
1、默认已经自动开启了请求报文加密、响应报文解密；无需单独配置；
2、模块中已经自动处理了登录失效、token失效等常见情况，无需单独处理；
3、外部调用时，可通过http方法进行请求，外部直接获取到的结果就是内层result了，说明如下：
```js
方案一：
// config非必需
try {
    // 仅当请求成功时resolve后才会执行后续逻辑；否则会中断，默认异常情况已经在请求中自动处理，异常弹窗提示，各交易无需单独处理；
    const result = await http(url, data, config);
    // 请求成功处理
    // ...
} 
// 某些场景下如果必须在具体的交易中捕获异常时，请求时在config中添加配置项：{catchError: true}，然后在catch中处理，否则会报错，不配置时catch中代码不生效；
catch (error) {
    // 请求失败处理
}

方案二：
http(url, data, config).then(result => {
    // 请求成功处理
    // ...
})
// 某些场景下如果必须在具体的交易中捕获异常时，请求时在config中添加配置项：{catchError: true}，然后在catch中处理，否则会报错，不配置时catch中代码不生效；
.catch(error => {
    // 请求失败处理
});

```

##### 状态栏与导航栏配置
App内项目内默认取消了系统状态栏、导航栏，这样做为了实现项目内完全的沉浸式开发体验，不再局限于App本身的两者的限制，目前项目中支持多种使用的方式。
方式一，建议此方案：
此方式需要页面中引入容器组件vc-container作为根元素，vc-container组件会自动处理状态栏与导航栏的显示与隐藏，具体使用方式如下：
* 步骤1：页面配置文件中配置状态栏与导航栏，配置如下：
```json
{
    "path": "package-charm/charm/charm",
    "style": {
        "navigationBarTitleText": "验证手机号"
    },
    // 取消状态栏显示，无该字段时或true时，显示状态栏
    "statusBar": false,
    // 取消导航栏显示，无该字段时或true时，显示导航栏
    "navigationBar": false,
    // 状态栏背景色，无该字段时，默认白色
    "statusBarBackgroundColor": "#aae1f5",
    // 导航栏背景色，无该字段时，默认白色
    "navigationBarBackgroundColor": "#aae1f5",
    // 导航栏底部线条，如果是导航栏背景色设置了白色，显示线条，设置其他颜色时，一律自动取消该线条，无该字段时，默认显示
    "navigationBarBorder": false,
    // 导航栏标题颜色，无该字段时，默认白色
    "navigationBarTitleColor": "#fff"
    // 是否占用剩下的全部屏幕高度（去除状态栏、导航栏）
    "isFullScreen": true,
    // 当需要禁用页面的滚动功能时，页面中自定义实现滚动逻辑时，此时isFullScreen必须为true时才生效
    "disableScroll": true,
}
```
* 步骤2：页面中使用全局组件vc-container作为根元素：
```html
<!-- 当然也支持传 :props-data="propsData"，同名属性配置项优先级json首选，建议尽量用json配置，除非特殊场景，才在该组件上使用props-data传参形式 -->
<vc-container>
    <!-- 页面内容 -->
</vc-container>
```
`该方式直接在配置文件中处理状态栏与导航栏的显示与隐藏，简单快捷。`

方式二：
在页面中直接使用全局状态栏与导航栏组件，具体使用方式如下：
```html
<vc-status-bar />
<vc-navbar />
<!-- <vc-navbar :props-data="propsData" /> -->
```
```js
// 可省略，默认使用页面配置的标题navigationBarTitleText的值
// propsData: {
//     props: {
//         title: {
//             value: "放心消费"
//         },
//         // 是否占用剩下的全部屏幕高度（去除状态栏、导航栏）
//         isFullScreen: {
                value: true,
//         },
//         // 当需要禁用页面的滚动功能时，页面中自定义实现滚动逻辑时，此时isFullScreen必须为true时才生效
//         disableScroll: {
                value: true,
//         },
//         // 是否开启自定义左上角返回拦截事件, 开启后可以组件上监听navBack事件, 用户点击左上角返回时会触发该事件 
//         customLeftBack: {
                value: true,
//         }
//     }
// }
```
该方式更灵活一些，但使用处理比较麻烦。

方式三：
不需要导航栏、状态栏，但是需要知道这两部分的高度，然后自定义状态栏与导航栏，具体使用方式如下：
```js
import { mapState } from 'pinia';
import { useBaseStore } from "@/store/index";

// 通过方法获取
onLoad() {
    // 获取状态栏高度
    const res = await this.bridgeSdk.getDeviceInfo()
    // 获取状态栏高度
    const statusBarHeight = res.statusBarHeight;
    // 获取导航栏高度
    const navBarHeight = res.navigationBarHeight;
}

// 使用computed计算属性获取
computed: {
    // 获取状态栏高度 navigationBarInfo.statusBarHeight 
    // 获取导航栏高度 navigationBarInfo.navigationBarHeight
    ...mapState(useBaseStore, ['navigationBarInfo']),
}
```
该方式使用更灵活，适用于一些特殊场景页面。

##### 页面交互细节
1. 未登录时提示登录，使用统一封装的登录提示组件，具体使用方式如下：
```html
<vc-login v-if="!isLogined" />
```
```js
import { mapState } from 'pinia'
import { useBaseStore, useUserStore } from "@/store/index";
computed: {
    ...mapState(useUserStore, {
        isLogined: "isLogined"
    })
}
```
2. 数据为空时提示空状态，使用统一封装的空状态组件，具体使用方式如下：
```html
<vc-empty />
```

##### 统一modal弹窗
具体使用方式如下：
```html
<!-- 完全自定义标题、内容、按钮，优先级最高 -->
<vc-modal>
    <template #title>
        title
    </template>
    <template #content>
        content
    </template>
    <template #cancelBtn>
        cancelBtn
    </template>
    <template #confirmBtn>
        confirmBtn
    </template>
</vc-modal>
<!-- 简化模式 -->
<vc-modal />
```
```js
// 页面中建议采用简化模式使用弹窗，负责需求可以选择自定义弹窗
// 只有确认按钮的alert弹窗
this.bridgeSdk.showAlert({
  content: "您是否知道已经快过年了，不想再加班了啊？",
  confirmText: "我知道了",
  confirmCallback: (res) => {
    console.log("点击确认", res);
  }
});
// 有确认、取消按钮的confirm弹窗
this.bridgeSdk.showConfirm({
  content: "您是否知道已经快过年了，不想再加班了啊？",
  confirmText: "我知道了",
  cancelText: "算了",
  confirmCallback: (res) => {
    console.log("点击确认", res);
  },
  cancelCallback: (res) => {
    console.log("点击取消", res);
  }
});
```

##### 分享功能
1. 右上角全局分享菜单（App全局分享，小程序系统分享），支持App微信好友分享、微信小程序好友分享
```js
onLoad(options) {
    // 自定义分享内容，如果不设置的话，小程序使用默认分享内容，App使用默认分享内容，如下字段按需修改，一般只需要修改title、path、imageUrl即可
    this.onShareAppMessageData = {
        // 转发标题，当前小程序名称	
        title: "更多服务",
        // 转发路径，当前页面 path ，必须是以 / 开头的完整路径	
        path: "/pages/more/more?subjectId=" + this.subjectId + "&orderFlag=" + this.orderFlag + "&pageType=" + this.type,
        // 自定义图片路径，支持PNG及JPG，显示图片长宽比是 5:4，小程序使用页面默认截图，h5使用logo图base64
        imageUrl: "https://life.hihihi.com.cn/hbdbucket/2024/12/16/09/wx241216093202395001616.png",
        // 如下为App专用参数
        content: "更多服务，让生活更美好！",
        // 值为miniCard或无该字段时，点击卡片跳转小程序，值为url时，点击卡片跳转如下url对应的网站
        shareType: "miniCard",
        // shareType为url时，跳转到该网站，否则字段留做备用，仅当shareType为miniCard且微信不支持小程序跳转时，才会跳转到该网站
        url: "https://www.baidu.com",
        // 值为miniCard或无该字段时，点击卡片跳转的微信小程序原始id
        miniAPPID: "",
        // 值为miniCard或无该字段时，点击卡片跳转的微信小程序页面路径
        miniAPPPath: "",
        // 分享类型 0：好友列表，1：朋友圈，2：收藏
        type: "0",
        // 是否开启页面截图功能，默认false，仅App有效
        capturePage: true
    };
}
// 必须写该方法，否则小程序端分享功能不可用，显示为灰色按钮
onShareAppMessage(res) {
    return this.bridgeSdk.onShareAppMessage(this.onShareAppMessageData);
}
```
2. 按钮分享组件，点击按钮弹出分享菜单，当需要自定义分享内容时，可以使用该组件，具体使用方式如下：
```html
<vc-share :props-data="shareFriendData">
    <view class="share-title box">
        <image :src="staticBaseUrl+'/hbdimage/recommendHbd/wx.png'" mode="widthFix" class="imgdom"></image>
        微信好友分享
    </view>
</vc-share>
```
```js
// 当全局分享、按钮分享组件都配置了分享内容时，点击右上角分享时，使用onShareAppMessageData数据，点击按钮时，使用shareFriendData数据。
mounted() {
    // App、小程序右上角分享菜单数据
    this.onShareAppMessageData = {
        // 转发标题，当前小程序名称	
        title: "推荐大连海创嗨创生活",
        // 转发路径，当前页面 path ，必须是以 / 开头的完整路径	
        path: "/package-recommend-hbd/recommendHbd/recommendHbd",
        // 自定义图片路径，支持PNG及JPG，显示图片长宽比是 5:4，小程序使用页面默认截图，h5使用logo图base64
        imageUrl: "https://life.hihihi.com.cn/hbdimage/recommendHbd/bg.png",
        // 如下为App专用参数
        content: "推荐大连海创嗨创生活，让生活更美好！",
        // 值为miniCard或无该字段时，点击卡片跳转小程序，值为url时，点击卡片跳转如下url对应的网站
        shareType: "url",
        // shareType为url时，跳转到该网站，否则字段留做备用，仅当shareType为miniCard且微信不支持小程序跳转时，才会跳转到该网站
        url: "",
        // 值为miniCard或无该字段时，点击卡片跳转的微信小程序原始id
        miniAPPID: "",
        // 值为miniCard或无该字段时，点击卡片跳转的微信小程序页面路径
        miniAPPPath: "",
        // 分享类型 0：好友列表，1：朋友圈，2：收藏
        type: "0"
    };
},
data() {
    return {
        // 微信分享好友
        shareFriendData: { 
            props: {
                type: { 
                    value: '0'
                }, 
                shareType: { 
                    value: 'url'
                }
            }
        }
    }
},
onShareAppMessage(res) {
    return this.bridgeSdk.onShareAppMessage(this.onShareAppMessageData);
}
```

##### 动态更新标题
```js
// 通过方法设置
this.$refs.container.setNavPropsData({
    title: {
        value: options.title
    }
});
// 直接修改
this.propsData.props.title.value = options.title;
```

##### 可用屏幕高度
```js
import { mapState } from 'pinia';
import { useBaseStore } from "@/store/index.ts";
// 屏幕最大可用高度（去除状态栏、导航栏高度后）
computed: {
    ...mapState(useBaseStore, {
        maxAviHeightWithNav: 'maxAviHeightWithNav'
    })
}
```

##### 页面涉及用户信息的标准写法
这样可以做到不登录时提示登录，不执行多余逻辑，已登录时按正常流程执行，当然如果页面不需要用户信息相关的逻辑，可以不用按照如下的写法，直接在页面中使用已登录状态判断即可，不确定时建议这样写。
适用场景：onLoad等初始化方法依赖于用户信息的情况，比如接口调用前获取userId等，如果页面初始化不调用接口，不获取用户信息，下面代码可以忽略。
```html
<template>
<view>
    <!-- 已登录时 -->
    <temple v-if="isLogined">   
        <view v-for="item in orderList" @click="itemClick(item)">
            <card-vue :item="item"></card-vue>
        </view>
    </temple>
    <!-- 未登录时，提示登录 -->
    <vc-login v-else />
</view>
</template>
```
```js
import { mapState } from 'pinia';
import { useUserStore } from "@/store/index.ts";
export default {
    name: "orderList",
    data() {
        return {
            orderList: []
        };
    },
    computed: {
       ...mapState(useUserStore, {
            isLogined: "isLogined"
       })
    },
    onLoad (options) {
        this.options = options;
        // 每个页面必须这么写
        if(!this.bridgeSdk.isTokenValid()){
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
            return;
        }
        this.__loadData__();
    },
    methods: {
        // 该方法在登录完成（App或小程序登录完成）后会被回调，初始化逻辑都放这里，以确保逻辑正常
        async __loadData__() {
            // 如下代码用过需要用户信息就这么写，否则可忽略
            // 获取用户信息，可能为空
            this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo;
            // 用户信息为空时，不执行后续逻辑，组件vc-login会提示登录
            if(!this.userInfo){
                return;
            }
            // const { userType, mctId, userId, detailInfoUserId, dateType } = this.options;
            // if (this.bridgeSdk.checkIsEmpty(mctId)) {
            //     this.userType = userType
            //     this.mctId = mctId
            //     this.detailInfoUserId = detailInfoUserId
            //     this.userId = userId
            //     this.dateType = dateType
            // }
            // this.orderListInit()
        }
    }
};
...

##### 已开发通用组件
1. vc-back 左侧返回箭头组件
2. vc-banner 轮播图组件
3. vc-container：页面容器组件，包含导航头、状态栏
4. vc-empty：空状态组件
5. vc-menus 菜单组件
6. vc-navbar 导航栏组件
7. vc-status-bar 状态栏组件
8. vc-popover 气泡组件
9. vc-proto 协议组件
10. vc-safe-bottom 安全底部组件
11. vc-search-box 搜索框组件
12. vc-share 分享组件
13. vc-login 登录提示组件
14. vc-modal 模态框组件
...


##### 缓存中用户信息
```
{
    "userId": "E1876194368699202501210000119",
    "sex": "1",
    "userName": "陈晨晨",
    "idCard": "210121198812210221",
    "head": "hbdbucket/2025/01/14/11/public250122145500995003459.jpg",
    "mobile": "18888888888",
    "isRealname": "1",
    "isFace": "0",
    "birthday": "1988-12-21",
    "nickName": "HBD_g0H125kjd1",
    "desMobile": "188****8888",
    "desUserName": "陈*晨",
    "desIdCard": "210***********0221",
    "desNickName": "H************1",
    "isLogin": "1"
}
```

##### 打包部署
1. 使用终端打包命令
```
// 开发环境打包h5，带调试信息，打开大连海创嗨创生活小程序时会跳转到体验版小程序
npm run build:h5-dev
// 测试环境打包h5，带调试信息，打开大连海创嗨创生活小程序时会跳转到体验版小程序
npm run build:h5-test
// 生产环境打包h5，自动关闭调试信息，打开大连海创嗨创生活小程序时会跳转到正式版小程序
npm run build:h5-prod
```

##### 分支说明
1. master分支：主分支，用于保存正式版本，此时代码需要稳定可靠，一般是预生产分支(如dev_pre_20250121)合并过来的代码，预生产上线验证没问题的话，此时合并该分支到master分支。
2. 开发测试分支：合并开发的功能特性分支，如果同时开发的功能过多时，但是需要分批上线时，可以创建dev_test_20250121等类似分支用户部署测试环境测试，测试无问题后，再合并到dev_release_20250121预生产分支准备上线。
3. dev_release分支：合并准备上线的功能分支, 按上线日期进行命名, 例如: dev_release_20250121, 上线无问题了, 再合并回master分支。
4. *_fixed_bug_日期：生产有问题了请基于master分支拉取 *_fixed_bug_日期 分支进行修复，再上线验证，如果没问题的话，再合并回master分支。

##### 版本管理
开发及投产注意事项:
1. 以后每个人开发的功能, 都要基于master分支新建开发分支, 命名: 功能名_上线时间, 例如: 答题活动_20250306, 每个任务开发完务必确保自测完全无问题(h5、小程序真机都测下), 再提交到各自的分支, 提交的时候务必备注好[需求名/功能名] 开发的功能名/修复的问题描述等信息.
2. 涉及到的功能bug, 大家在各自的功能分支上进行修改, 所有的bug都要单独修改并提交, 提交的时候要标注bug修复的编号(对应测试文档中的bug编号), 不允许合并提交多个bug, 以防哪个bug没修复好造成已修复好的bug可能也无法上线发布, 请确保h5、小程序真机都测下没问题, 再提交到各自的分支.
3. 每次上线的功能都会在上线前几日由产品或项目经理确定, 然后再由我合并这些需要上线的功能分支, 我会新建dev_pre_上线时间, 例如: dev_pre_20250307, 然后打包部署到预生产环境交给测试和客户复测, 待测试无问题了就准备封板投产,如果存在问题, 重复步骤2、3
4. 投产稳定运行24小时无问题的话, 上述投产分支会被合并到master分支作为生产的完整备份分支, 完整上线流程结束, 如果线上出现了问题, 基于生产分支拉取新的分支, 比如: master_20250307_fixed_bug, 修复后提交分支代码后, 联系我合并到dev_pre_20250307, 然后打包部署到预生产环境交给测试和客户复测, 待测试无问题了就准备封板投产.
 如果业务需要部署测试时, 通知我合并代码, 告诉我具体的功能分支, 大家不要再自己合并了.
 
其他未尽事宜，后续再补充。
