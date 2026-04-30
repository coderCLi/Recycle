<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-login v-if="!isLogined" />
  <view v-else class="page-container">
    <image
      class="all-page-bg-img"
      :src="allPageBg"
      mode="scaleToFill"
    />
    <!-- 顶部圆弧渐变背景和导航栏 -->
    <view
      class="top-arc-bg"
      :style="{
        paddingTop: navigationBarInfo.statusBarHeight + 'px',
      }"
    >
      <view class="nav-bar">
        <vc-back
          :props-data="{
            props: { color: { value: '#fff' }, top: { value: '10px' } },
          }"
        />
        <view
          class="page-title"
          :style="{ lineHeight: navigationBarInfo.navigationBarHeight + 'px' }"
          >我的奖品</view
        >
      </view>
    </view>
    <view
      class="member-my-prize-container"
      :style="{
        height:
          'calc(100vh - ' +
          (navigationBarInfo.statusBarHeight +
            navigationBarInfo.navigationBarHeight) +
          'px)',
        overflowY: 'scroll',
      }"
    >
      <view class="member-my-prize-box">
        <view v-if="prizeList&&prizeList.length > 0" class="member-my-prize-list">
          <view
            v-for="(item, index) in prizeList"
            :key="index"
            class="member-my-prize-item-box"
          >
            <view class="member-my-prize-item">
              <view class="member-my-prize-item-left">
                <view class="member-my-prize-item-left-title">
                  {{ item.prizeName }}
                </view>
                <view class="member-my-prize-item-left-desc"
                  >获得时间：{{ formatDate(item.raffleDate) }}</view
                >
              </view>
              <view class="member-my-prize-item-right">
                <view
                  class="member-my-prize-item-right-btn-box"
                  v-if="item.prizeType == '1' && !item.address"
                  @click="addAddress(index)"
                >
                  <view class="member-my-prize-item-right-btn">
                    填写地址<up-icon
                      name="arrow-rightward"
                      color="#DA5758"
                    ></up-icon>
                  </view>
                </view>
                <view
                  class="member-my-prize-item-right-status-box"
                  v-if="item.prizeType == '1' && item.address"
                >
                  <view class="member-my-prize-item-right-status">
                    {{
                      item.status == "1"
                        ? "未发货"
                        : item.status == "2"
                        ? "已发货"
                        : item.status == "3"
                        ? "配送中"
                        : item.status == "4"
                        ? "已送达"
                        : ""
                    }}
                  </view>
                </view>
                <view
                  class="member-my-prize-item-right-btn-box"
                  v-if="item.prizeType == '1' && item.address"
                >
                  <view
                    class="member-my-prize-item-right-btn"
                    @click="showModal(item)"
                  >
                    去查看<up-icon
                      name="arrow-rightward"
                      color="#DA5758"
                    ></up-icon>
                  </view>
                </view>
                <view
                  class="member-my-prize-item-right-btn-box"
                  v-if="item.prizeType == '2'"
                >
                  <view class="member-my-prize-item-right-btn" @click="goSee">
                    去查看<up-icon
                      name="arrow-rightward"
                      color="#DA5758"
                    ></up-icon>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else-if="requestSuccess" class="no-data-container">
          <image
            class="no-data-container-img"
            :src="minioBaseUrl + 'common/memberCenter/prizeNoData.png'"
            mode="scaleToFill"
          />
          <view class="no-data-container-text">暂无奖品</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "pinia";
import { useUserStore, useBaseStore } from "@/store/index";

import { queryWinningRecord } from "../api/index";
export default {
  name: "memberMyPrize",
  data() {
    return {
      allPageBg: "",
      activId: "",
      style: "",
      prizeList: [],
      requestSuccess: false,
    };
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: "isLogined",
    }),
    ...mapState(useBaseStore, {
      safeTopDistance: "safeTopDistance",
      navigationBarInfo: "navigationBarInfo",
    }),
  },
  onLoad(options) {
    console.log("memberMyPrize", options);
    this.allPageBg = options.allPageBg
      ? decodeURIComponent(options.allPageBg)
      : "";
    this.activId = options.activId;
    this.style = options.style;
    // this.getList();
  },
  onShow() {
    console.log("memberMyPrize onShow");
    this.getList();
  },
  methods: {
    getList() {
      this.requestSuccess = false;
      queryWinningRecord({
        id: this.activId,
      }).then((res) => {
        console.log("queryWinningRecord", res);
        if(res&&res.length>0){
          this.prizeList = res;
        }else{
          this.requestSuccess = true;
        }
      });
    },
    addAddress(index) {
      let info = this.prizeList[index];
      let winRecordId = info.winRecordId;
      let raffleUserId = info.userId;
      let activId = this.activId;
      let style = this.style;
      this.bridgeSdk.jumpPage({
        url:
          "/package-public-act/lottery/address?winRecordId=" +
          winRecordId +
          "&raffleUserId=" +
          raffleUserId +
          "&activId=" +
          activId +
          "&style=" +
          style,
      });
    },
    goSee() {
      this.bridgeSdk.jumpPage({
        url: "/package-cards-platform/card/cardList",
      });
    },
    formatDate(datetime) {
      if(datetime.indexOf("-") == 4){
        return datetime;
      }
      let dateV = new Date(datetime);
      let year = dateV.getFullYear();
      let month = dateV.getMonth() + 1;
      let day = dateV.getDate();
      let hour = dateV.getHours();
      let minute = dateV.getMinutes();
      let second = dateV.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    showModal(item) {
      let htmlString = "<div style='width: 100%;text-align: center;word-wrap: break-word;word-break: break-all;'>";
      htmlString += "<p>邮寄地址：" + item.address + "</p>";
      htmlString += "<p>若需要更改邮寄地址，请拨打0329000联系客服</p>";
      htmlString += "</div>";
      this.$refs.modal.open({
        title: "",
        htmlString: htmlString,
        confirmText: "确认",
        showCancel: false,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.page-container {
  position: relative;

  .all-page-bg-img {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .member-my-prize-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-top: 40rpx;
    position: relative;
    z-index: 0;

    .member-my-prize-box {
      width: 640rpx;
      height: 80%;
      box-sizing: border-box;
      padding: 37rpx 40rpx;
      overflow-y: auto;
      background: #ffffff;
      border-radius: 40rpx;
      box-shadow: 0px 2rpx 36rpx 0rpx rgba(0, 0, 0, 0.16),
        inset 0rpx 1rpx 49rpx 0rpx #ffffff;

      .member-my-prize-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .member-my-prize-item-box {
          width: 100%;
        }

        .member-my-prize-item {
          width: 100%;
          background: #ff52520b;
          border-radius: 26rpx;
          margin-bottom: 30rpx;
          display: flex;
          // align-items: center;
          justify-content: space-between;
          overflow: hidden;

          .member-my-prize-item-left {
            .member-my-prize-item-left-title {
              padding: 24rpx 10rpx 6rpx 30rpx;
              font-weight: bold;
              font-size: 32rpx;
              color: #da5758;
              line-height: 45rpx;
            }

            .member-my-prize-item-left-desc {
              padding: 0rpx 10rpx 28rpx 30rpx;
              font-weight: 400;
              font-size: 20rpx;
              color: #da5758;
              line-height: 28rpx;
            }
          }

          .member-my-prize-item-right {
            height: 100%;
            flex-shrink: 0;
            position: relative;

            .member-my-prize-item-right-btn-box {
              padding-top: 46rpx;
              padding-right: 30rpx;

              .member-my-prize-item-right-btn {
                display: flex;
                align-items: center;
                font-size: 28rpx;
                color: #da5758;
                font-weight: 600;
              }
            }

            .member-my-prize-item-right-status-box {
              position: absolute;
              top: 0;
              right: 0;
              display: flex;
              justify-content: flex-end;

              .member-my-prize-item-right-status {
                width: 104rpx;
                height: 34rpx;
                background: #ff9091;
                border-radius: 0px 24rpx 0px 12rpx;
                text-align: center;
                font-weight: bold;
                font-size: 20rpx;
                color: #ffe0e0;
                line-height: 28rpx;
              }
            }
          }
        }
      }

      .no-data-container{
        width: 100%;
        padding: 180rpx 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        .no-data-container-img{
          width: 260rpx;
          height: 250rpx;
          margin-bottom: 44rpx;
        }
        .no-data-container-text{
          font-size: 28rpx;
          color: #aaaaaa;
        }
      }
    }
  }
}

.top-arc-bg {
  width: 100vw;

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    z-index: 2;

    .page-title {
      flex: 1;
      text-align: center;
      color: #fff;
      font-size: 38rpx;
      font-weight: bold;
      letter-spacing: 2rpx;
    }
  }
}
</style>