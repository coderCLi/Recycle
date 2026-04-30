/*
 * @Description: 环境信息配置
 * @Author: chenyulong
 * @Date: 2024-11-08 16:11:11
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-13 09:58:03
 * @Remark: https://cn.vite.dev/config/build-options
 */
import path from 'node:path'
import dayjs from 'dayjs'
import { defineConfig, loadEnv } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import ViteRestart from 'vite-plugin-restart'
import packageJson from './package.json'
const scripts = packageJson['uni-app'].scripts
// console.log('所有自定义运行指令 -> ', scripts)
import progress from 'vite-plugin-progress'
import viteCompression from 'vite-plugin-compression'
// import minipic from 'vite-plugin-minipic'

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  // console.log("process.env.VITE_USER_NODE_ENV -> ", process.env.VITE_USER_NODE_ENV)
  // console.log("mode === process.env.VITE_USER_NODE_ENV -> ", mode === process.env.VITE_USER_NODE_ENV)
  // mode: 区分生产环境还是开发环境
  // console.log('command, mode -> ', command, mode)
  // console.log('process.env -> ', process.env)
  // 平台信息
  const { UNI_PLATFORM, UNI_CUSTOM_SCRIPT, UNI_CUSTOM_DEFINE } = process.env
  // console.log('UNI_PLATFORM -> ', UNI_PLATFORM, ' UNI_CUSTOM_SCRIPT -> ', UNI_CUSTOM_SCRIPT, ' UNI_CUSTOM_DEFINE -> ', UNI_CUSTOM_DEFINE)
  const uniqueEnv = UNI_CUSTOM_DEFINE && JSON.parse(UNI_CUSTOM_DEFINE)
  console.log('\x1b[33m%s\x1b[0m', '基准平台 -> ', UNI_PLATFORM)
  const isCustom = !!UNI_CUSTOM_DEFINE;
  console.log('\x1b[33m%s\x1b[0m', '是否自定义运行/发行配置 -> ', isCustom)
  if(!isCustom){
    // 本地开发环境
    if(mode === 'development'){
      console.log('\x1b[31m%s\x1b[0m', ' 请使用package.json中uni-app.scripts字段下的自定义指令或HBuilderX运行时点击所需的环境');
      console.log('\x1b[33m%s\x1b[0m', '运行模式 -> 可执行指令提示如下：');
      Object.keys(scripts).forEach(key => {
        console.log(scripts[key].title);
        console.log('\x1b[32m%s\x1b[0m', ` -> npm run dev:custom ${key}`);
      })
    } else if(mode === 'production'){
      console.log('\x1b[31m%s\x1b[0m', ' 请使用package.json中uni-app.scripts字段下的自定义指令或HBuilderX发行时点击自定义发行，选择所需的环境');
      console.log('\x1b[33m%s\x1b[0m', '发行模式 -> 可执行指令提示如下：');
      Object.keys(scripts).forEach(key => {
        console.log(scripts[key].title);
        console.log('\x1b[32m%s\x1b[0m', ` -> npm run dev:custom ${key}`);
      })
    }
    // 终止服务，抛出错误
    process.exit(1);
  }
  console.log('\x1b[33m%s\x1b[0m', '自定义运行/发行指令 -> ', UNI_CUSTOM_SCRIPT)
  // console.log('自定义运行/发行参数 -> ', uniqueEnv)

  // 基础配置
  const dotEnv = loadEnv(mode, path.resolve(process.cwd(), '.'))
  // console.log('环境变量 .env -> ', dotEnv);

  // 合并环境变量
  const env = {
    ...dotEnv,
    ...uniqueEnv,
  }
  // console.log('环境变量 合并 -> ', env);

  const {
    VITE_APP_HOST,
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_SERVER_OTHERURL,
    // VITE_UPLOAD_BASEURL,
    VITE_AUTHORIZE_URL,
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_APP_PROXY,
    VITE_APP_PROXY_PREFIX,
    VITE_USER_NODE_ENV,
    VITE_APP_ID,
    VITE_HUIBAODING_MINI_ORIGIN_ID,
    VITE_HUIBAODING_MINI_APPID,
    VITE_BAODING_CENTER_COORDS,
    // VITE_THIRD_PARTY_APP_ID,
    VITE_APP_VERSION,
    VITE_APP_PUBLIC_KEY,
    VITE_BMAP_API_URL,
    // VITE_UNIAPP_STATIC_BASE_URL,
    // VITE_STATISTICS_BASEURL,
    VITE_STATISTICS_APP_KEY,
    VITE_LOGO_URL,
    VITE_LOGO_BASE64,
    VITE_SHARE_TITLE,
    VITE_SHARE_CONTENT,
    VITE_ENV_VERSION,
    DEPLOY_ENV
  } = env

  let _VITE_ENV_VERSION_ = VITE_ENV_VERSION;
  // 非生产环境，使用体验版小程序，方便测试用，取决于使用哪种终端打包命令，比如：npm run build:h5-dev 或 npm run build:h5-test 或 npm run build:h5-prod
  // if(DEPLOY_ENV !== 'pro'){
  //   _VITE_ENV_VERSION_ = "2";
  // }
  
  const defineExports: Record<string, string> = {
    __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
    __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY),
    __VITE_SERVER_BASEURL__: JSON.stringify(VITE_SERVER_BASEURL),
    __VITE_SERVER_OTHERURL__: JSON.stringify(VITE_SERVER_OTHERURL),
    __VITE_APP_PROXY_PREFIX__: JSON.stringify(VITE_APP_PROXY_PREFIX),
    __VITE_USER_NODE_ENV__: JSON.stringify(VITE_USER_NODE_ENV),
    __VITE_APP_ID__: JSON.stringify(VITE_APP_ID),
    __VITE_HUIBAODING_MINI_ORIGIN_ID__: JSON.stringify(VITE_HUIBAODING_MINI_ORIGIN_ID),
    __VITE_HUIBAODING_MINI_APPID__: JSON.stringify(VITE_HUIBAODING_MINI_APPID),
    __VITE_BAODING_CENTER_COORDS__: JSON.stringify(VITE_BAODING_CENTER_COORDS),
    // __VITE_THIRD_PARTY_APP_ID__: JSON.stringify(VITE_THIRD_PARTY_APP_ID),
    // __VITE_UPLOAD_BASEURL__: JSON.stringify(VITE_UPLOAD_BASEURL),
    __VITE_AUTHORIZE_URL__: JSON.stringify(VITE_AUTHORIZE_URL),
    __VITE_APP_VERSION__: JSON.stringify(VITE_APP_VERSION),
    // __VITE_APP_PUBLIC_KEY__: JSON.stringify(VITE_APP_PUBLIC_KEY),
    __VITE_BMAP_API_URL__: JSON.stringify(VITE_BMAP_API_URL),
    // __VITE_UNIAPP_STATIC_BASE_URL__: JSON.stringify(VITE_UNIAPP_STATIC_BASE_URL),
    // __VITE_STATISTICS_BASEURL__: JSON.stringify(VITE_STATISTICS_BASEURL),
    __VITE_STATISTICS_APP_KEY__: JSON.stringify(VITE_STATISTICS_APP_KEY),
    __VITE_LOGO_URL__: JSON.stringify(VITE_SERVER_BASEURL + VITE_LOGO_URL),
    // __VITE_LOGO_BASE64__: JSON.stringify(VITE_LOGO_BASE64),
    __VITE_SHARE_TITLE__: JSON.stringify(VITE_SHARE_TITLE),
    __VITE_SHARE_CONTENT__: JSON.stringify(VITE_SHARE_CONTENT),
    __VITE_ENV_VERSION__: JSON.stringify(_VITE_ENV_VERSION_),
    __DEPLOY_ENV__: JSON.stringify(DEPLOY_ENV),
  }
  console.log('\x1b[32m%s\x1b[0m', '全局暴露的变量 defineExports -> ');
  console.log('\x1b[32m%s\x1b[0m', defineExports);

  // 太长了, 单独拿出来赋值, 不打印了
  defineExports.__VITE_LOGO_BASE64__ = JSON.stringify(VITE_LOGO_BASE64);
  defineExports.__VITE_APP_PUBLIC_KEY__ = JSON.stringify(VITE_APP_PUBLIC_KEY);

  return defineConfig({
    // logLevel: 'info', // 或者 'debug'
    
    envDir: './', // 自定义env目录

    plugins: [
      // minipic(),
      // 配置 gzip 压缩插件
      viteCompression({
        // options
        verbose: true,   // 是否在控制台输出压缩结果
        disable: false,   // 是否禁用
        threshold: 1024 * 10,   // 压缩的门槛大小
        algorithm: 'gzip',   // 压缩的算法
        ext: '.gz',  // 压缩后的文件扩展名
        deleteOriginFile: false // 源文件压缩后是否删除，如果设置了删除，h5运行正常，小程序运行会报错
      }),
      Uni(),
      // {
      //   // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
      //   // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
      //   // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
      //   name: 'fix-vite-plugin-vue',
      //   configResolved(config) {
      //     const plugin = config.plugins.find((p) => p.name === 'vite:vue')
      //     if (plugin && plugin.api && plugin.api.options) {
      //       plugin.api.options.devToolsEnabled = false
      //     }
      //   },
      // },
      AutoImport({
        imports: ['vue', 'uni-app'],
        dts: 'src/types/auto-import.d.ts',
        eslintrc: { enabled: true },
        vueTemplate: true, // default false
      }),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
      // h5环境增加 BUILD_TIME 和 BUILD_BRANCH
      UNI_PLATFORM === 'h5' && {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace('%BUILD_TIME%', dayjs().format('YYYY-MM-DD HH:mm:ss'))
        },
      },
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === 'h5' &&
      mode === 'production' &&
      visualizer({
        filename: './node_modules/.cache/visualizer/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),

      progress(),
    ],

    define: defineExports,

    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        }
      },
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ],
      },
    },

    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        // '@utils': path.join(process.cwd(), './src/utils'),
        // '@encrypt': path.join(process.cwd(), './src/static/encrypt'),
        '@images': path.join(process.cwd(), './src/static/images'),
        // '@api': path.join(process.cwd(), './src/api'),
      },
    },

    server: {
      host: VITE_APP_HOST,
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY)
        ? {
            [VITE_APP_PROXY_PREFIX]: {
              target: VITE_SERVER_BASEURL,
              changeOrigin: true,
              rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), ''),
            },
            "/minio": {
              target: VITE_SERVER_BASEURL,
              changeOrigin: true,
              rewrite: (path) => path.replace(new RegExp(`^`), ''),
            }
          }
        : undefined,
    },

    build: {
      // vite 打包后的单个文件默认大于500kb会报警告。通过设置chunkSizeWarningLimit可以将修改其大小限制
      // chunkSizeWarningLimit: 700, // 单位是KB
      // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
      // assetsInlineLimit: 4096,
      // 方便非h5端调试
      sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      target: 'es6',
      // 开发环境不用压缩
      // minify: mode === 'development' ? false : 'terser',
	    minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: VITE_DELETE_CONSOLE === 'true',
          // drop_console: DEPLOY_ENV === 'pro' ? true : false,
          // drop_debugger: true,
        }
      },
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 20*1024, // 单位b
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          // manualChunks(id) {
          //   // console.log('manualChunks id -> ', id)
          //   // // 只有极少数活动页面使用了这个库，单独处理
          //   // if (id.includes('html2canvas')) {
          //   //   return 'html2canvas'
          //   // }
          //   // if (id.includes('node_modules')) {
          //   //   return 'vendor'
          //   // }
          //   if (id.includes('node_modules')) {
          //     return id
          //       .toString()
          //       .split('node_modules/')[1]
          //       .split('/')[0]
          //       .toString()
          //   }
          //   if(id.includes('uni_modules/uview-plus')){
          //     return 'uview-plus-vendor'
          //   }
          //   if(id.includes('src/package-') || id.includes('src/pages') || id.includes('src/page-')){
          //     const packageName = id.split('/src/')[1].split('/')[0];
          //     // console.log('packageName -> ', packageName)
          //     return packageName + '-vendor';
          //   } 
          //   if(id.includes('/pina')){
          //     return 'pina-vendor'
          //   }

          // }
        },
      }
    },
  })
};
