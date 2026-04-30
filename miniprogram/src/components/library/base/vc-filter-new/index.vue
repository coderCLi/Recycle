<!--
 * @Description: 条件筛选栏  
 * @Author: wdc
 * @Date: 2024-12-20 15:21:55
 * @LastEditors: yulongchen 1053061950@qq.com
 * @LastEditTime: 2025-03-19 15:49:36
 * @Remark: 
-->
<template>
  <view class="vc-filter" :class="{ 'filter-bottom': overlayShow, 'hidden': ('hidden' === vcFilterOverflow)}"
    :style="{ top: filterTop + 'rpx', overflow: vcFilterOverflow }">
    <u-badge v-if="selectConfigData.isSum" :value="badgeNo" :bgColor="selectConfigData.bgColor" :absolute="true"
      :offset="selectConfigData.offset"></u-badge>
    <u-dropdown v-if="dataInit" :active-color="dropdownProps.activeColor" :inactive-color="dropdownProps.nactiveColor"
      :key="dropdownKey" @open="dropdownOpen" @close="dropdownClose" ref="dropdown">
      <view v-for="(t, i) in startType" :key="'START_' + i" style="background-color: #fff">
        <!-- M1 定位模块 -->
        <view v-if="
          t.type == 'nearby' &&
          typeof nearbyConfigData === 'object' &&
          nearbyConfigData !== null
        ">
          <u-dropdown-item v-model="nearbyConfigData.value" :title="nearbyConfigData.title">
            <view class="slot-content">
              <view class="nearby-distance">距离{{ !needOpenLocation ? "" : "我的位置" }}
                <text v-if="needOpenLocation" @click="openLocation">请先开启定位{{ ">" }}</text>
              </view>

              <view v-if="nearbyConfigData.options?.location.locationList.length > 0" class="location-list">
                <!-- <u-subsection
									v-if="needOpenLocation"
									:list="nearbyConfigData.options.location.locationList"
									:current="seachData.nearby.current"
									:bgColor="nearbyConfigData.options.location.bgColor"
									:keyName="nearbyConfigData.options.location.keyName"
									:activeColor="'#00BCB9'"
									@change="locationClick"
									:key="nearbyKey"
									mode="button"
								></u-subsection>
								-->
                <view v-if="!needOpenLocation" class="close-location">
                  <view class="close-location-item" v-for="(l, li) in nearbyConfigData.options?.location
                    .locationList" :key="'L_' + li">
                    <view class="close-location-item-view" :class="{ active: seachData.nearby.current == li }"
                      @click="locationClick(li)">{{ l.optName }}</view>
                  </view>
                </view>
                <view v-else class="close-location">
                  <view class="close-location-item" v-for="(l, li) in nearbyConfigData.options?.location
                    .locationList" :key="'L_' + li">
                    <view class="close-location-item-view">{{
                      l.optName
                    }}</view>
                  </view>
                </view>
              </view>

              <view class="menu-content">
                <view class="first-scrollview" v-if="nearbyConfigData.options?.menu.menuList.length > 0">
                  <scroll-view class="sub-menu-list" :scroll-y="true">
                    <view v-for="(menu, menuI) in nearbyConfigData.options?.menu
                      .menuList" :key="'MEMU_' + menuI">
                      <view class="sub-menu" :class="{ active: menuI == seachData.nearby.menuIndex }"
                        :id="'first_id' + menuI" @click="menuClick(menuI, 'nearby')">
                        <span v-if="menuI == seachData.nearby.menuIndex" class="left-active"></span>
                        <view class="sub-menu-item" :class="{
                          active: menuI == seachData.nearby.menuIndex,
                        }">{{ menu.label }}</view>
                      </view>
                    </view>
                  </scroll-view>
                </view>
                <view class="second-scrollview" v-if="subMenuList.length > 0">
                  <scroll-view class="sub-menu-list" :scroll-y="true" :key="subMenuKey">
                    <view v-for="(subMenu, subMenuI) in subMenuList" :key="'SUB_ITEM_' + subMenuI">
                      <view class="sub-menu" :class="{
                        active: subMenuI == seachData.nearby.subMenuIndex,
                      }" :id="'second_id' + subMenuI" @click="subMenuClick(subMenuI, 'nearby')">
                        <view class="sub-menu-item">
                          <text>{{ subMenu.label }}</text>
                        </view>
                      </view>
                    </view>
                  </scroll-view>
                </view>
              </view>
              <view class="nearby-bottom">
                <u-button class="reset-btn" shape="circle" text="重置" @click="resetClick('nearby')"></u-button>
                <u-button class="complete-btn" shape="circle" text="确认" @click="completeClick('nearby')"></u-button>
              </view>
            </view>
          </u-dropdown-item>
        </view>

        <!-- M2 -->
        <view v-if="t.type == 'dropdown' && dropdownConfigData.length > 0">
          <view v-for="(d, di) in dropdownConfigData" :key="`D_${t.id}_${di}`">
            <u-dropdown-item v-if="d.id == t.id" v-model="seachData.dropdown[d.key]" :title="d.title ? d.title : '--'"
              :options="d.options" @change="dropdownItemClick(d.key, di)"></u-dropdown-item>
          </view>
        </view>

        <!-- M3 -->
        <view v-if="
          t.type == 'select' &&
          typeof selectConfigData === 'object' &&
          selectConfigData !== null
        ">
          <u-dropdown-item v-model="selectConfigData.value" :title="selectConfigData.title">
            <view class="slot-content">
              <view class="menu-content">
                <view class="first-scrollview">
                  <scroll-view class="sub-menu-list" :scroll-y="true" :scroll-into-view="idNameLeft"
                    scroll-with-animation="true">
                    <view v-for="(s, si) in selectConfigData.options?.menu" :key="'SELECT_' + si">
                      <view class="sub-menu" :class="{ active: si == seachData.select.menuIndex }" :id="`ID_${si}`"
                        @click="menuClickM3(si)">
                        <span v-if="si == seachData.select.menuIndex" class="left-active"></span>
                        <view class="sub-menu-item" :class="{ active: si == seachData.select.menuIndex }">{{ s.label }}
                        </view>
                      </view>
                    </view>
                  </scroll-view>
                </view>

                <view class="second-scrollview">
                  <scroll-view class="sub-menu-list" :scroll-y="true" :scroll-into-view="idNameRight"
                    scroll-with-animation="true" @scroll="cateScroll" @scrolltolower="scrolltolower">
                    <view class="scrollID" v-for="(m, i) in selectConfigData.options?.menuList"
                      :key="'SELECT_List_' + i" :id="`ID_${i}`">
                      <view class="tag-box-name">{{ m.title }}</view>
                      <view class="tag-box">
                        <view v-if="m.type == '0'" class="tag-item" v-for="(r, indexR) in m.list"
                          :key="`RADIO_${i}_${indexR}`">
                          <u-tag  :text="r.optName" plain :name="r.connectId"  :color="!r.checked ? '#999' : '#00BCB9'"
                             :borderColor="!r.checked ? '#999' : '#00BCB9'"  @click="
                              radioClick({
                                menuIndex: i,
                                index: indexR,
                                optCode: r.connectId,
                              })
                              "></u-tag>
                        </view>

                        <view v-if="m.type == '1'" class="tag-item" v-for="(c, indexC) in m.list"
                          :key="`CHECKBOX_${i}_${indexC}`">
                          <u-tag :text="c.optName" plain :name="c.connectId" :color="!c.checked ? '#999' : '#00BCB9'"
                            :borderColor="!c.checked ? '#999' : '#00BCB9'" @click="
                              checkboxClick({
                                menuIndex: i,
                                index: indexC,
                                optCode: c.connectId,
                              })
                              "></u-tag>
                        </view>
                      </view>
                    </view>
                  </scroll-view>
                </view>
              </view>
              <view class="nearby-bottom">
                <u-button class="reset-btn" shape="circle" text="重置" @click="resetClick('select')"></u-button>
                <u-button class="complete-btn" shape="circle" text="确认" @click="completeClick('select')"></u-button>
              </view>
            </view>
          </u-dropdown-item>
        </view>

        <view v-if="
          t.type == 'other' &&
          typeof otherConfigData === 'object' &&
          selectConfigData !== null
        ">
          <view v-for="(o, oi) in otherConfigData" :key="`R_${t.id}_${oi}`">
            <u-dropdown-item v-if="o.id == t.id" v-model="seachData.other[o.key]" :title="o.title">
              <view class="slot-content">
                <view class="tag-box">
                  <view v-if="o.type == '0'" class="tag-item" v-for="(r, indexOR) in o.options"
                    :key="`OTHER_RADIO_${oi}_${indexOR}`">
                    <u-tag :text="r.optName" :plain="!r.checked" :name="r.optCode" :color="'#00BCB9'"
                      :borderColor="'#00BCB9'" @click="
                        otherRadioClick({
                          otherIndex: oi,
                          index: indexOR,
                          optCode: r.optCode,
                        })
                        "></u-tag>
                  </view>

                  <view v-if="o.type == '1'" class="tag-item" v-for="(c, indexOC) in o.options"
                    :key="`OTHER_CHECKBOX_${oi}_${indexOC}`">
                    <u-tag :text="c.optName" :plain="!c.checked" :name="c.optCode" :color="'#00BCB9'"
                      :borderColor="'#00BCB9'" @click="
                        otherCheckboxClick({
                          otherIndex: oi,
                          index: indexOC,
                          optCode: c.optCode,
                        })
                        "></u-tag>
                  </view>
                </view>

                <view class="nearby-bottom">
                  <u-button class="reset-btn" shape="circle" text="重置" @click="resetClick('other', oi)"></u-button>
                  <u-button class="complete-btn" shape="circle" text="确认"
                    @click="completeClick('other', oi)"></u-button>
                </view>
              </view>
            </u-dropdown-item>
          </view>
        </view>

        <!-- 自定义扩展 设置type区分 -->
      </view>
    </u-dropdown>
  </view>
</template>

<script>
let hbd = null;
export default {
  title: "筛选组件",
  props: {
    // 筛选框距离顶部距离
    filterTop: {
      type: Number,
      default: 0,
    },
    // 菜单属性配置
    dropdownProps: {
      type: Object,
      default: () => {
        return {
          activeColor: "#00BCB9", // 标题和选项卡选中的颜色 String
          nactiveColor: "#606266", // 标题和选项卡未选中的颜色 String
        };
      },
    },
    // 启用功能 按数组顺序显示
    startType: {
      type: Array,
      default() {
        return [];
      },
    },

    // M1配置
    nearbyConfig: {
      type: Object,
      default: () => {
        return null;
      },
    },

    // M2配置
    dropdownConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },

    // M3配置
    selectConfig: {
      type: Object,
      default: () => {
        return null;
      },
    },

    // M4配置
    otherConfig: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      // 解决小程序端与h5端菜单显示顺序不一致问题, 因为数据异步处理造成的, 采用临时变量在数据准备完毕后再渲染
      dataInit: false,

      overlayShow: false,
      dropdownKey: 1000,
      // M1
      // M1配置
      nearbyConfigData: {},

      subMenuList: [],
      subMenuKey: 100,
      nearbyKey: 10,
      needOpenLocation: true, // 是否开启定位
      myLocation: "", // 我的位置

      // M2
      // M2配置
      dropdownConfigData: [],

      // M3
      selectConfigData: {},
      idNameLeft: "ID_0",
      idNameRight: "ID_0",
      badgeNo: 0, // 已选择数量

      // M4
      otherConfigData: {},


      // 返回参数
      seachData: {
        // M1
        nearby: {
          menuIndex: 0, // 左侧菜单列表选中索引
          subMenuIndex: -1, // 右侧选中索引
          current: 0, // 距离选中索引
        },
        // M2
        dropdown: {},
        // M3
        select: {
          menuIndex: 0,
        },
        // M4
        other: {},

      },
      vcFilterOverflow: "hidden", // 筛选框溢出隐藏
    };
  },

  onLoad(options) {
    hbd = this.bridgeSdk.hbd;
  },

  mounted() {
    // console.log("propsData: ", this.propsData);
    // 初始化参数;
    this.info();
  },

  methods: {
    // 初始化
    info() {
      console.log("初始化M");
      if (this.startType.length > 0) {
        this.bridgeSdk.getLocation((res) => {
          console.log(res, "获取定位");
          this.myLocation = res;
          this.needOpenLocation = res.locationFail === true;
          this.$emit("getLocation", res);
        });

        this.startType.forEach((e, i) => {
          // M1
          if (e.type == "nearby") {
            this.seachData.nearby = {
              menuIndex: 0, // 左侧菜单列表选中索引
              subMenuIndex: -1, // 右侧选中索引
              current: 0, // 距离选中索引
            };
            console.log("初始化nearby:", this.nearbyConfigData);
            this.nearbyConfigData = JSON.parse(
              JSON.stringify(this.nearbyConfig)
            );
            if (this.nearbyConfigData.options?.menu.menuList.length > 0) {
              // 非异步，初始化菜单列表
              this.menuClick(0, this.startType[0].type);
            }
            // this.bridgeSdk.getLocation((res) => {
            //   console.log(res, "获取定位");
            //   this.myLocation = res;
            //   this.needOpenLocation = res.locationFail === true;
            //   this.$emit("getLocation", res);
            // });
          }

          // M2
          if (e.type == "dropdown") {


            this.dropdownConfigData = JSON.parse(
              JSON.stringify(this.dropdownConfig)
            );
            console.log("初始化dropdown:", this.dropdownConfig);
            this.dropdownConfigData.forEach((d, i) => {
              if (d.options.length > 0) {
                // 非异步，初始化菜单列表
                // this.$set(
                //   this.seachData.dropdown,
                //   d.key,
                //   d.defaultIndex
                //     ? d.options[d.defaultIndex].value
                //     : d.options[0].value
                // );
                // this.dropdownConfigData[i].title = d.defaultIndex
                //   ? d.options[d.defaultIndex].label
                //   : d.options[0].label;
              }
            });
          }

          // M3
          if (e.type == "select") {
            console.log("初始化select:", this.selectConfig);

            this.selectConfigData = JSON.parse(
              JSON.stringify(this.selectConfig)
            );
          }

          // M4
          if (e.type == "other") {
            console.log("初始化other:", this.otherConfig);

            this.otherConfigData = JSON.parse(JSON.stringify(this.otherConfig));
          }
        });

      }
      this.dataInit = true;
      console.log("初始化结束nearby:", this.nearbyConfigData);
      console.log("初始化结束dropdown:", this.dropdownConfigData);
      console.log("初始化结束select:", this.selectConfigData);
      console.log("初始化结束other:", this.otherConfigData);
      this.dropdownKey++;
    },

    // 异步加载M1模块数据
    // setM1(key, data) {
    //   this.$nextTick(() => {
    //     if (key == "location") {
    //       this.$set(this.nearbyConfigData.options.location, "locationList", data);
    //     }
    //     if (key == "menu") {
    //       this.$set(this.nearbyConfigData.options.menu, "menuList", data);
    //       // 初始化菜单列表
    //       this.menuClick(0, this.startType[0].type);
    //     }
    //   });

    // },

       // 异步加载M1模块数据
    setM1(key, data, index) {
      console.log("setM1111:", key, data, index);
      this.$nextTick(() => {
        if (key == "location") {
          this.$set(this.nearbyConfigData.options.location, "locationList", data);
        }
        if (key == "menu") {
          this.$set(this.nearbyConfigData.options.menu, "menuList", data);
          // 初始化菜单列表
          if (this.bridgeSdk.checkIsEmpty(index)) {
            this.menuClick(index, this.startType[index].type);
          } else {
            this.menuClick(0, this.startType[0].type);
          }
        }
        if (key == "title") {
          this.$set(this.nearbyConfigData, "title", data);
        }
      });

    },


    // 开启定位
    openLocation() {
      this.bridgeSdk.getLocation((res) => {
        console.log(res, "获取定位");
        this.myLocation = res;
        this.needOpenLocation = res.locationFail === true;
        this.resetClick("nearby");
        this.$emit("getLocation", res);
      }, "showModal");

      // 启用定位刷新分类菜单数据：
      // 过程描述：重置-> 调用左侧菜单点击事件 -> 刷新分类菜单右侧列表/异步调用父类方法获取数据 -> 异步刷新分类菜单右侧列表
      // this.resetClick('nearby'); // 重置
    },

    // 选择距离
    locationClick(index) {
      console.log(index);
      this.$emit(
        "locationClick",
        this.nearbyConfigData.options.location.locationList[index]
      ); //
      this.seachData.nearby[this.nearbyConfigData.options.location.key] =
        this.nearbyConfigData.options.location.locationList[index].optCode; // 获取返参
      this.seachData.nearby.current = index; // 当前选项
      this.nearbyKey++;
      console.log(this.seachData.nearby);
    },

    // 左侧点击
    menuClick(index, type) {
      console.log(index);
      if (type == "nearby") {
        this.seachData.nearby.menuIndex = index;
        this.seachData.nearby.subMenuIndex = this.nearbyConfig.rightDefaultIndex > -1 ? this.nearbyConfig.rightDefaultIndex : -1;
        let menuList = this.nearbyConfigData.options.menu.menuList[index];
        this.$emit("menuClick", menuList);
        if (menuList && menuList.children) {
          this.subMenuList = menuList.children;
        } else {
          // 等待加载列表数据
          this.subMenuList = [];
        }
      }
    },
    // 异步加载右侧列表
    asyncSubMenuList(e) {
      this.subMenuList = e;
    },

    // 右侧点击
    subMenuClick(index, type) {
      console.log(index);
      if (type == "nearby") {
        this.seachData.nearby.subMenuIndex = index;
        this.seachData.nearby.subMenuType = this.subMenuList[index].value;
        this.seachData.nearby[this.nearbyConfigData.options.menu.key] = this
          .subMenuList[index].value
          ? this.subMenuList[index].value
          : "";
      }

      this.$emit("subMenuClick", this.subMenuList[index]);
    },

    // 异步加载M2模块数据
    setM2(i, data) {
      console.log("setM2");
      this.dropdownConfigData[i].options = data;
      let d = this.dropdownConfigData[i];
      if (d.options.length > 0) {
        this.$set(
          this.seachData.dropdown,
          d.key,
          d.defaultIndex ? d.options[d.defaultIndex].value : d.options[0].value
        );
        this.dropdownConfigData[i].title = d.defaultIndex
          ? d.options[d.defaultIndex].label
          : d.options[0].label;
      }
      console.log(this.dropdownConfigData[i]);
    },

    // 下拉选项点击事件
    dropdownItemClick(key, i) {
      console.log(key, i);
      console.log(JSON.stringify(this.seachData.dropdown[key]));

      this.dropdownConfigData[i].options.forEach((d, di) => {
        if (d.value == this.seachData.dropdown[key]) {
          this.dropdownConfigData[i].title = d.label;
          this.$emit("dropdownClick", d);
        }
      });
      console.log(this.dropdownConfigData);
    },

    // 异步加载M3模块数据
    setM3(type, data) {
      console.log("setM3");
      if (type == "menu") {
        this.selectConfigData.options.menu = data;
      }
      if (type == "select") {
        this.selectConfigData.options.menuList = data;
      }
      console.log(this.selectConfigData);
    },

    menuClickM3(i) {
      console.log(i,"menuClickM3");
      const rightArr = this.idNameRight.split("_");
      let rightIndex = rightArr.length > 1 ? rightArr[1] : '';
      if (rightIndex != ('' + this.seachData.select.menuIndex)) {
        this.idNameRight = "";
      }
      setTimeout(()=>{
        this.idNameLeft = "ID_" + i;
        this.idNameRight = "ID_" + i;
        this.seachData.select.menuIndex = i;
      },50)
    },
    /*滑动改变左侧已选状态*/
    cateScroll(e) {
      const scroll_top = e.detail.scrollTop;
      const query = uni.createSelectorQuery().in(this);
      query
      	.selectAll('.scrollID')
      	.boundingClientRect((data) => {
          if (!data || data.length == 0) return;
          let top = 0;
          let scroll_id = data[0].id;
          let scroll_index = 0;
          for (const [index, item] of data.entries()) {
            if (item.height < 2) { return; } // 防止出错
            if (scroll_top >= top ) {
              scroll_id = item.id;
              scroll_index = index;
            } else if (scroll_top > top-1 && scroll_top < top+1) { // 距下的临界点
              scroll_id = item.id;
              scroll_index = index;
            } else {
              break;
            }
            top += item.height;
          }
          // this.idName = scroll_id;
          this.idNameLeft = "ID_" + scroll_index;
      		this.seachData.select.menuIndex = scroll_index;
      	})
      	.exec();
    },
scrolltolower(e){
  console.log('滚动到了底部',this.selectConfigData.options.menuList);
  let arr = this.selectConfigData.options.menuList.filter(item => item.title === '专业类型')
  console.log(arr);
  
  this.$emit('scrolltolower',arr[0].list)
},
    // 单选点击
    radioClick(e) {
      console.log(e);
      this.selectConfigData.options.menuList[e.menuIndex].list.forEach(
        (item, index) => {
          if (item.connectId === e.optCode) {
            if (item.checked) {
              item.checked = !item.checked;
              return;
            }
          }
          item.checked = item.connectId === e.optCode;
        }
      );
      this.doBadgeNo();
    },

    // 多选点击
    checkboxClick(e) {
      this.selectConfigData.options.menuList[e.menuIndex].list.forEach(
        (item, index) => {
          if (item.connectId === e.optCode) {
            item.checked = !item.checked;
          }
        }
      );
      this.doBadgeNo();
    },

    // 计算筛选数量
    doBadgeNo() {
      let no = 0;
      this.selectConfigData.options.menuList.forEach((e, i) => {
        e.list.forEach((m, n) => {
          if (m.checked) {
            no++;
          }
        });
      });
      this.badgeNo = no;
      console.log(this.badgeNo);
    },

    // 异步加载M4模块数据
    setM4(data) {
      console.log("setM4");
      this.otherConfigData = data;
    },
    // M4点选事件
    otherRadioClick(e) {
      console.log(e);
      this.otherConfigData[e.otherIndex].options.forEach((item, index) => {
        if (item.optCode === e.optCode) {
          if (item.checked) {
            item.checked = !item.checked;
            return;
          }
        }
        item.checked = item.optCode === e.optCode;
      });
    },
    // M4多选事件
    otherCheckboxClick(e) {
      console.log(e);
      this.otherConfigData[e.otherIndex].options.forEach((item, index) => {
        if (item.optCode === e.optCode) {
          item.checked = !item.checked;
        }
      });
    },

    // 重置按钮点击事件
    resetClick(type, i = 0) {
      if (type == "nearby") {
        this.seachData.nearby = {
          menuIndex: 0,
          subMenuIndex: -1,
          current: 0, // 距离选中索引
          [this.nearbyConfigData.options.location.key]:
            this.nearbyConfigData.options.location.locationList[0].optCode, // 距离返回值
          [this.nearbyConfigData.options.menu.key]: "",
        };
        this.nearbyKey++;
        this.menuClick(0, type);
      }
      if (type == "select") {

        this.selectConfigData.options.menuList.forEach((e, i) => {
          console.log(e);
          if (e.type == "0") {
            this.seachData.select[e.key] = "";
          }
          if (e.type == "1") {
            this.seachData.select[e.key] = [];
          }
          e.list.forEach((m, n) => {
            m.checked = false;
          });
        });
        const rightArr = this.idNameRight.split("_");
        let rightIndex = rightArr.length > 1 ? rightArr[1] : '';
        if (rightIndex != ('' + this.seachData.select.menuIndex)) {
          this.idNameRight = "";
        }
        setTimeout(()=>{
          this.idNameLeft = "ID_0";
          this.idNameRight = "ID_0";
          this.seachData.select = {
            menuIndex: 0,
          };
        },50)
        this.badgeNo = 0;
      }

      if (type == "other") {
        this.otherConfigData[i].options.forEach((e) => {
          e.checked = false;
        });
        this.seachData.other[this.otherConfigData[i].key] =
          this.otherConfigData[i].type == "0" ? "" : [];
      }
      this.$emit("resetClick", {
        type: type,
      });
      this.completeClick(type, i);
    },

    // 完成按钮点击事件
    completeClick(type, i = 0) {
      console.log("completeClick type: " + type);
      let data = {};
      if (type == "nearby") {
        data = {
          ...this.seachData.nearby,
        };
        // 未选择默认右侧第一个值
        if (!this.seachData.nearby[this.nearbyConfigData.options.menu.key]) {
          data[this.nearbyConfigData.options.menu.key] = this.subMenuList[0] && this.subMenuList[0].value
            ? this.subMenuList[0].value
            : "";
        }
      }
      if (type == "select") {
        this.selectConfigData.options.menuList.forEach((e, i) => {
          console.log(e);
          if (e.type == "0") {
            this.seachData.select[e.key] = "";
          }
          if (e.type == "1") {
            this.seachData.select[e.key] = [];
          }

          e.list.forEach((m, n) => {
            if (m.checked) {
              if (e.type == "0") {
                this.seachData.select[e.key] = m.connectId;
              }
              if (e.type == "1") {
                this.seachData.select[e.key].push(m.connectId);
              }
            }
          });
        });
        data = {
          ...this.seachData.select,
        };
      }
      if (type == "other") {
        let d = this.otherConfigData[i];
        console.log(d);
        if (d.type == "0") {
          this.seachData.other[d.key] = "";
        }
        if (d.type == "1") {
          this.seachData.other[d.key] = [];
        }
        d.options.forEach((e) => {
          if (e.checked) {
            if (d.type == "0") {
              this.seachData.other[d.key] = e.optCode;
            }
            if (d.type == "1") {
              this.seachData.other[d.key].push(e.optCode);
            }
          }
        });
        data = {
          ...this.seachData.other,
        };
      }
      this.$emit("completeClick", {
        type: type,
        ...data,
      });
      this.$refs.dropdown.close();
      this.dropdownKey++;
      console.log(this.seachData);
    },
    dropdownOpen(key) {
      this.vcFilterOverflow = "visible";
      console.log(key, 'open');
      let obj = this.startType.find((t,i) => {
        return t.type == 'select' &&
                typeof this.selectConfigData === 'object' &&
                this.selectConfigData !== null;
      });
      if (obj) {
        console.log("重置为起始位置");
        const rightArr = this.idNameRight.split("_");
        let rightIndex = rightArr.length > 1 ? rightArr[1] : '';
        if (rightIndex != ('' + this.seachData.select.menuIndex)) {
          this.idNameRight = "";
        }
        const i = 0;//this.seachData.select.menuIndex;
        setTimeout(()=>{
          this.idNameLeft = "ID_" + i;
          this.idNameRight = "ID_" + i;
          this.seachData.select.menuIndex = i;
        },50)
      }
    },
    dropdownClose() {
      this.vcFilterOverflow = "hidden";
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
