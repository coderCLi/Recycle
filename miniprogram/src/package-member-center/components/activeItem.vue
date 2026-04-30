<template>
  <view class="activeItem" @click="goActivity(info)"> <slot></slot></view>
</template>

<script>
export default {
  name: "activeItem",
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isHBD: false,
    };
  },
  mounted() {
    this.h5Iframe = false;
    // #ifdef H5
    this.h5Iframe = location?.href?.indexOf("channel=h5Iframe") > -1;
    // #endif

    this.isHBD = this.bridgeSdk.isInHiApp();
  },
  methods: {
    // 跳转到活动详情
    async goActivity(item) {
      console.log("goActivity ", item);
      // this.bridgeSdk.jumpPage(item)
      // return
      let plat = await this.bridgeSdk.getEnvironment();
      console.log(plat);
      let url = "";
      switch (plat) {
        case "miniProgram":
          url = item.application.miniUrl;
          break;
        case "web":
          url = item.application.androidUrl || item.application.iosUrl;
          break;
        case "ios":
          url = item.application.iosUrl;
          break;
        case "andriod":
          url = item.application.androidUrl;
          break;
        default:
          url = item.application.androidUrl;
          break;
      }
      if (this.isHBD) {
        this.toServicePageByHDD(url, {
          ...item.application,
          serviceName: item.channelName,
        });
        return;
      }
      this.bridgeSdk.toServicePage(url, {
        ...item.application,
        serviceName: item.channelName,
      });
    },
    async toServicePageByHDD(path, item, subjectId) {
      console.log("toServicePage--{" + path + "}");
      console.log("item ", item);
      let isKong = !path || path.length == 0;
      let isHttp =
        (path || "").indexOf("http://") == 0 ||
        (path || "").indexOf("https://") == 0;

      // 处理url
      // * url参数特殊协议设计：
      // * 打电话：tel://10086
      // * 扫码：scanCode://
      // * 提示信息：warn://
      // * 切换tab页：native://tab:1 最后一位是切换的tab顺序
      let specialUrls = ["tel://", "scanCode://", "native://tab:", "warn://"];
      let _specialUrls = specialUrls.filter((str) => {
        return path.indexOf(str) > -1;
      });

      let title = "";
      if (_specialUrls.length > 0 || isKong) {
        // 特殊的，不拼接参数
      } else if (isHttp) {
        const {
          query: { title: _title },
        } = this.bridgeSdk.getUrlObj(path);
        // 不存在title，则设置
        if (!_title) {
          if (item.serviceName) {
            let fuhao = path.indexOf("?") > -1 ? "&" : "?";
            path = `${path}${fuhao}title=${encodeURIComponent(
              item.serviceName
            )}`;
            title = encodeURIComponent(item.serviceName);
          }
        }
      } else {
        const paramsMap = this.getUrlParams(path);
        if (subjectId && !paramsMap.get("subjectId")) {
          // 不存在，则覆盖
          let fuhao = path.indexOf("?") > -1 ? "&" : "?";
          path = `${path}${fuhao}subjectId=${subjectId}`;
        } else if (path.indexOf("?") == -1) {
          path = `${path}?xx=xx`;
        }

        if (item.selfServiceId && !paramsMap.get("serviceId")) {
          path = `${path}&serviceId=${item.selfServiceId}`;
        }
        if (item.serviceName && !paramsMap.get("title")) {
          path = `${path}&title=${encodeURIComponent(item.serviceName)}`;
          title = encodeURIComponent(item.serviceName);
        }
        if (item.serviceId && !paramsMap.get("subId")) {
          path = `${path}&subId=${item.serviceId}`;
        }

        if (item.type && !paramsMap.get("type")) {
          path = `${path}&type=${item.type}`;
        }
      }

      // 请求参数
      let data = {};
      // type和appid -- 微信小程序，type类型 0-h5 1-小程序
      if (item.type == 1) {
        // if (item.appid) {
        //   path = `${path}&appid=${item.appid}`;
        // }
        data = {
          permissionLevel: item.permissionLevel, // 访问限制等级
          miniAPPID: item.appid,
          miniAPPPath: path,
        };
      } else if (item.type == 0) {
        if (item.skipType == 7) {
          data = {
            url: path,
            permissionLevel: item.permissionLevel, // 访问限制等级
            title,
          };
        } else {
          data = {
            url: path,
            permissionLevel: item.permissionLevel, // 访问限制等级
            title,
          };
        }
      } else {
        data = {
          url: path,
          permissionLevel: item.permissionLevel, // 访问限制等级
          title,
        };
      }
      console.log("跳转服务 ", data);
      await this.jumpPage({
        ...data,
        title: title || item.serviceName,
      });
    },
    getUrlParams(url, isdecode = true) {
      let paramString = "";
      if (url.includes("?")) {
        if (url.split("?").length > 1) {
          paramString = url.split("?")[1];
        }
      }
      const paramsMap = new Map();
      const pairs = paramString.split("&");

      // 遍历每个键值对
      pairs.forEach((pair) => {
        if (pair.includes("=")) {
          const [key, value] = pair.split("=");
          const decodedKey = isdecode ? decodeURIComponent(key) : key;
          const decodedValue = isdecode ? decodeURIComponent(value) : value;
          paramsMap.set(decodedKey, decodedValue);
        }
      });
      return paramsMap;
    },
    async jumpPage(parma) {
      console.log("跳转页面parma: ", parma);
      let title = "";
      let scene_url = "";
      if (parma.url) {
        const {
          query: { title: _title, scene_url: _scene_url },
        } = this.bridgeSdk.getUrlObj(parma.url);
        title = _title || null;
        scene_url = _scene_url;
        console.log("title: ", title);
        console.log("scene_url: ", scene_url);
      }

      let tempUrl = parma.url || parma.miniAPPPath || "";

      tempUrl = this.getRealUrl(tempUrl);
      console.log("真实跳转路径tempUrl: ", tempUrl);

      if (scene_url) {
        tempUrl = this.bridgeSdk.replaceThirdH5Url(tempUrl);
        console.log("第三方h5真实路径tempUrl: ", tempUrl);
      }

      // 未开放
      if (parma.isBuilding) {
        trackReport.trackPageView(parma.title);
        uni.showToast({
          title: "功能建设中，敬请期待！",
          icon: "none",
        });
        return;
      }

      // 需要登录
      if (parma.needLogin) {
        parma.permissionLevel = "2";
      }

      // 需要登录时，先检查是否登录，未登录时拉起登录，跳过后续的逻辑；已经登录时继续后续的逻辑
      tempUrl.includes("needLogin=true") && (await this.bridgeSdk.checkLogin());

      tempUrl =
        this.bridgeSdk.dynamicParamsToStaticParams({
          url: tempUrl,
        }) || "";

      // 校验登录状态
      if (parma.permissionLevel == "2") {
        let res = await this.bridgeSdk.checkLogin();
        if (!res) {
          return;
        }
      }
      // 校验实名状态
      else if (parma.permissionLevel == "3") {
        let b = await this.bridgeSdk.checkIdentityAuth();
        if (!b) {
          return;
        }
      }
      // 切换原生tab页
      if (tempUrl.startsWith("native://tab:")) {
        const tabIndex = parseInt(tempUrl.replace("native://tab:", ""));
        console.log("切换原生tab页：", tabIndex);
        let tabPage = this.bridgeSdk.getTabPage(tabIndex);
        console.log("切换原生tab页 tabPage：", tabPage);
        if (!tempUrl.startsWith("/")) {
          tabPage = "/" + tabPage;
        }
        uni.switchTab({
          url: tabPage,
        });
      }
      // 提示信息
      else if (tempUrl.startsWith("warn://")) {
        trackReport.trackPageView(parma.title);
        uni.showToast({
          title: tempUrl.replace("warn://", ""),
          icon: "none",
        });
        return;
      }
      // 扫一扫
      else if (tempUrl.startsWith("scanCode://")) {
        this.bridgeSdk.scanCode(() => {});
      }
      // 打电话
      else if (tempUrl.startsWith("tel://")) {
        console.log("打电话 " + tempUrl);
        this.bridgeSdk.makePhoneCall({
          title: parma.title || title || "",
          phoneNumber: tempUrl.replace("tel://", ""),
        });
      }
      // 需要跳转h5页面
      else if (
        tempUrl.startsWith("http://") ||
        tempUrl.startsWith("https://")
      ) {
        // return;
        this.bridgeSdk.openOuterPage({
          url: tempUrl,
          title: parma.title || title || "",
          extra_config: parma.extra_config || {},
        });
      }
      // 打开小程序
      else if (parma.miniAppGhId || parma.miniAPPID) {
        this.bridgeSdk.jumpWxMiniProgram({
          title: parma.title || title || "",
          miniAppGhId: parma.miniAppGhId || "",
          miniAppId: parma.miniAPPID || "",
          miniAppPath: tempUrl,
        });
      }
      // 项目内页面跳转
      else if (tempUrl) {
        let _trackTitle = "";

        // 转码title字段
        if (tempUrl && tempUrl.length > 0) {
          let { query, path } = this.bridgeSdk.getUrlObj(tempUrl);
          const paramsMap = this.getUrlParams(tempUrl, false);
          const _title = paramsMap.get("title");
          _trackTitle = _title || "";
          if (_title && this.isPercentEncoded(_title)) {
            paramsMap.set("title", decodeURIComponent(_title));
            _trackTitle = decodeURIComponent(_title);
          }
          let paramsStr = "";
          if (paramsMap.size > 0) {
            [...paramsMap].forEach(([key, value]) => {
              if (value && value.length > 0) {
                paramsStr = paramsStr + `&${key}=${value}`;
              }
            });
            if (paramsStr.length > 0) {
              paramsStr = paramsStr.substring(1, paramsStr.length);
            }
          }
          tempUrl = path + (paramsStr.length > 0 ? `?${paramsStr}` : "");
        }

        const trackView = () => {
          setTimeout(() => {
            // 埋点统计
            const name =
              this.bridgeSdk.beans.getGlobalThis()?.options?.title ||
              this.bridgeSdk.getCurrentRouter()?.pageConf?.style
                ?.navigationBarTitleText;
            // console.log("_trackTitle name: ", name);

            // @ts-ignore
            let { query, path } = this.bridgeSdk.getUrlObj(tempUrl);
            // console.log("query: ", query, "path: ", path);

            _trackTitle =
              parma.title || _trackTitle || name || "项目内页面跳转";
            _trackTitle = decodeURIComponent(_trackTitle);
            // console.log("埋点统计 _trackTitle: ", _trackTitle);
            trackReport.trackPageView(_trackTitle);
          }, 500);
        };

        const _q = tempUrl.indexOf("?") > -1 ? "&" : "?";
        console.log(
          `${this.staticBaseUrl}/web/#${tempUrl}${
            _q + "appToken=" + this.bridgeSdk.getStorageSync("appToken")
          }`
        );
        this.bridgeSdk.hi.openURLByParams({
          url: `${this.staticBaseUrl}/web/#${tempUrl}${
            _q + "appToken=" + this.bridgeSdk.getStorageSync("appToken")
          }`,
          showNavBar: "0",
          title: parma.title,
          setCapsule: "0",
          complete: (_) => {
            trackView();
          },
        });
      } else {
        trackReport.trackPageView(parma.title || title || tempUrl);
        console.log("跳转参数不正确，请检查");
      }
    },
    isPercentEncoded(str) {
                try {
                    // 尝试解码字符串
                    const decodedStr = decodeURIComponent(str);
                    // 重新编码解码后的字符串
                    const reencodedStr = encodeURIComponent(decodedStr);
                    // 如果重新编码后的字符串与原始字符串相同，则认为它是百分比编码的
                    return str === reencodedStr;
                } catch (e) {
                    // 如果解码失败，说明字符串不是有效的百分比编码
                    return false;
                }
            },
    getRealUrl(path) {
      if (!path) {
        return path;
      }

      const origin = location?.origin || "";
      console.log("origin: ", origin);

      // 不同域，直接返回
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }

      if (!path.includes("/index.html#/")) {
        return path;
      }

      // 本地开发环境
      if (this.bridgeSdk.isDev()) {
        return path.split("/index.html#")[1];
      }

      // #ifdef H5
      // 路径示例：https://life.hihihi.com.cn/web/#/pages/login/index?redirect=%252F，此时pathname：二级路径：/web/index.html
      // 路径示例：https://life.hihihi.com.cn/web/index.html#/pages/home/home，此时pathname：二级路径：/web/index.html
      const pathname = location.pathname.slice(1).replace("index.html", "");
      console.log("pathname: ", pathname);

      // 域：https://life.hihihi.com.cn
      // const origin = location.origin;
      // console.log("origin: ", origin);

      // 哈希值：#/pages/login/index?redirect=%252F
      // const hash = location.hash;

      // 包含二级路径，比如：web/index.html#/package-charm/charm/charm，如果跳转路径与当前页面所在的二级路径一致，同域跳转，剔除前缀，仅保留：/pages/login/index?redirect=%252F
      // if(path.split("/#/")[0] + "/" === pathname){
      if (path.startsWith(pathname)) {
        const newPath = path.replace(pathname + "index.html#", "");
        console.log("同域跳转，剔除前缀：", newPath);
        return newPath;
      }
      // 包含二级路径，比如：/hbdhtml/#/login，非同域跳转，拼接完整地址，可能存在同域下部署多个项目，存在多个二级代理，但相互跳转交互的情况
      else {
        let otherProjectUrl = origin + "/" + path;
        console.log("其他项目跳转：", otherProjectUrl);
        if (otherProjectUrl.includes("?")) {
          otherProjectUrl += "&appToken=" + getStorageSync("appToken");
        } else {
          otherProjectUrl += "?appToken=" + getStorageSync("appToken");
        }
        return otherProjectUrl;
      }
      // #endif

      return path;
    },
  },
};
</script>

<style>
</style>