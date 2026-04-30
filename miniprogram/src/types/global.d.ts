declare const __UNI_PLATFORM__:
  | 'h5'
  | 'app'
  | 'mp-alipay'
  | 'mp-baidu'
  | 'mp-jd'
  | 'mp-kuaishou'
  | 'mp-lark'
  | 'mp-qq'
  | 'mp-toutiao'
  | 'mp-weixin'
  | 'quickapp-webview'
  | 'quickapp-webview-huawei'
  | 'quickapp-webview-union'

declare const __VITE_APP_PROXY__: true | false

declare const __VITE_USER_NODE_ENV__: string

declare const __VITE_APP_PROXY_PREFIX__: string

declare const __VITE_SERVER_BASEURL__: string

declare const __VITE_SERVER_OTHERURL__: string

// declare const __VITE_UNIAPP_STATIC_BASE_URL__: string

declare const __VITE_ENV_VERSION__: string

declare const __VITE_STATISTICS_APP_KEY__: string

// declare const __VITE_STATISTICS_BASEURL__: string

declare const __VITE_BMAP_API_URL__: string

declare const __VITE_AUTHORIZE_URL__: string

declare const __DEPLOY_ENV__: string

// declare const __VITE_UPLOAD_BASEURL__: string

declare const __VITE_APP_VERSION__: string

declare const __VITE_APP_PUBLIC_KEY__: string

declare const __VITE_APP_ID__: string

// declare const __VITE_THIRD_PARTY_APP_ID__: string

declare const __VITE_HUIBAODING_MINI_ORIGIN_ID__: string

declare const __VITE_HUIBAODING_MINI_APPID__: string

declare const __VITE_BAODING_CENTER_COORDS__: string

declare const __VITE_LOGO_URL__: string

declare const __VITE_LOGO_BASE64__: string

declare const __VITE_SHARE_TITLE__: string

declare const __VITE_SHARE_CONTENT__: string

declare const BMap: any

interface Window {
  callJavascriptSendCoordinate: (lng: any, lat: any) => void;
}

declare module '@encrypt/sm/sm.func.js' {
  const sm2Tools: any;
  export default sm2Tools;
}

declare const BMapGL: any
declare const BMAP_STATUS_SUCCESS: number
declare const BMAP_DRIVING_POLICY_DEFAULT: number
declare const BMAP_DRIVING_POLICY_FIRST_HIGHWAYS: number
declare const BMAP_DRIVING_POLICY_AVOID_HIGHWAYS: number
declare const BMAP_DRIVING_POLICY_AVOID_CONGESTION: number