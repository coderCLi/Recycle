<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="personInfo">
    <view class="personInfo-box">
      <view class="personInfo-row">
        <view class="personInfo-title">头像</view>
        <view class="personInfo-content" @click="uploadHeader">
          <view
            style="
              width: 100rpx;
              height: 100rpx;
              border-radius: 50%;
              overflow: hidden;
            "
          >
            <image
              v-if="headerImg && loaded"
              :src="minioBaseUrl + headerImg"
              style="width: 100%; height: 100%"
            ></image>
            <image
              v-else-if="loaded"
              :src="staticBaseUrl + '/hbdimage/main/images/home/touxiang.png'"
              style="width: 100%; height: 100%"
            ></image>
          </view>
          <up-icon name="arrow-right" size="14"></up-icon>
        </view>
      </view>
      <view class="personInfo-row">
        <view class="personInfo-title">姓名</view>
        <view class="personInfo-content">
          <view>{{ isRealname ? name : "--" }}</view>
        </view>
      </view>
      <view class="personInfo-row">
        <view class="personInfo-title">昵称</view>
        <view class="personInfo-content" @click="showModalFun">
          <view class="personInfo-content-text">{{ nickName ? nickName : "--" }}</view>
          <up-icon class="personInfo-content-icon" name="arrow-right" size="14"></up-icon>
        </view>
      </view>

      <view class="personInfo-row">
        <view class="personInfo-title">性别</view>
        <view class="personInfo-content">
          <view class="personInfo-content-text">{{ isRealname ? gender : "未知" }}</view>
        </view>
      </view>
      <view class="personInfo-row">
        <view class="personInfo-title">身份证号</view>
        <view class="personInfo-content">
          <view class="personInfo-content-text">{{ isRealname ? desIdCard : "--" }}</view>
        </view>
      </view>
      <view class="personInfo-row">
        <view class="personInfo-title">出生年月</view>
        <view class="personInfo-content">
          <view class="personInfo-content-text">{{ isRealname ? birthday : "--" }}</view>
        </view>
      </view>
      <view class="personInfo-row">
        <view class="personInfo-title">手机号码</view>
        <view class="personInfo-content">
          <view class="personInfo-content-text">{{ desMobile }}</view>
        </view>
      </view>
      <!-- <view class="personInfo-row">
        <view class="personInfo-title">职业信息</view>
        <view class="personInfo-content" @click="jumpToJobInfo">
          <view class="personInfo-content-text" style="color: #999999">请完善</view>
          <up-icon class="personInfo-content-icon" name="arrow-right" size="14"></up-icon>
        </view>
      </view> -->
      <!-- <view class="personInfo-row">
        <view class="personInfo-title">常住信息</view>
        <view class="personInfo-content" @click="jumpToLiveInfo">
          <view class="personInfo-content-text" style="color: #999999">请完善</view>
          <up-icon class="personInfo-content-icon" name="arrow-right" size="14"></up-icon>
        </view>
      </view> -->
      <!-- <view class="personInfo-row">
        <view class="personInfo-title">兴趣爱好</view>
        <view class="personInfo-content" @click="jumpToInterestInfo">
          <view class="personInfo-content-text" style="color: #999999">请完善</view>
          <up-icon class="personInfo-content-icon" name="arrow-right" size="14"></up-icon>
        </view>
      </view> -->
    </view>
    <u-modal :show="modalShow" title="修改昵称" :showCancelButton="true" @confirm="nickNameBlur" @cancel="modalShow = false">
      <view class="slot-content">
        <up-input v-model="nickNameNew" placeholder="请输入新的昵称"></up-input>
      </view>
    </u-modal>
  </vc-container>
</template>

<script>
import { useBaseStore, useUserStore } from "@/store/index";
import { mapState } from "pinia";
import { getUserInfo } from "@/api/login";
import { getEvnBaseUrl } from "@/utils/index";
import {
  ellipsisName,
  ellipsisPhone,
  formatIdNumber,
} from "@/utils/business";
import { nicknameModify } from "@/api/mine";
export default {
  name: "personInfo",
  data() {
    return {
      name: "",
      headerImg: "",
      idCard: "",
      desIdCard: "",
      mobile: "",
      desMobile: "",
      gender: "",
      birthday: "",
      isRealname: false,
      loaded: false,

      nickName: "",
      desNickName: "",
      nickNameNew: "",
      modalShow: false,
    };
  },
  computed: {
    ...mapState(useUserStore, {
      // 非敏感用户信息，比如昵称、头像等
      userInfo: "userInfo",
      // 登录状态
      isLogined: "isLogined",
      // 实名状态
      isRealName: false,
    }),
  },
  async onLoad(options) {
    await this.firstInit();
    // console.log("info", this.bridgeSdk.getUserInfo());
    // console.log("info", this.userInfo);
    // let userInfo = this.bridgeSdk.getUserInfo();
    this.getData();
  },
  methods: {
    getData() {
      getUserInfo({})
        .then((res) => {
          console.log("res", res);
          let userInfo = res;
          this.isRealname = userInfo.isRealname == "1";
          this.name = ellipsisName(userInfo.userName);
          this.headerImg = userInfo.head;
          this.idCard = formatIdNumber(userInfo.idCard);
          this.desIdCard = userInfo.desIdCard;
          this.mobile = ellipsisPhone(userInfo.mobile);
          this.desMobile = userInfo.desMobile;
          this.gender =
            userInfo.sex == 1 ? "男" : userInfo.sex == 2 ? "女" : "";
          this.birthday = userInfo.birthday;
          this.loaded = true;

          this.nickName = userInfo.nickName;
          this.desNickName = userInfo.desNickName;
          this.bridgeSdk.updateUserInfo();
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    uploadHeader() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], //从相册选择
        success: function (res) {
          const tempFilePaths = res.tempFilePaths;
          const uploadTask = uni.uploadFile({
            url:
              getEvnBaseUrl() + "/abpapp/UserRelatedController/uploadHead.do",
            filePath: tempFilePaths[0],
            name: "file",
            formData: {
              quality: 100,
              type: "pic",
              session3rd: uni.getStorageSync("session3rd"),
            },
            success: function (res) {
              let uploadFileRes = JSON.parse(res.data);
              console.log("uploadFileRes", uploadFileRes);
              if (uploadFileRes.respcode === "0000") {
                that.bridgeSdk.updateUserInfo()
                that.getData();
                if(this.bridgeSdk.isInHiApp())that.bridgeSdk.refreshAppInfo()
              } else {
                uni.showToast({
                  icon: "none",
                  title: uploadFileRes.respmsg,
                });
              }
            },
            fail: function (e) {
              uni.showToast({
                title: "上传失败",
                icon: "none",
              });
              console.log("上传失败");
              console.dir(e);
            },
          });
        },
        error: function (e) {
          console.log(e);
        },
      });
    },
    showModalFun(){
      this.nickNameNew = this.nickName
      this.modalShow = true
    },
    nickNameBlur() {
        if (this.nickNameNew.length > 20) {
          uni.showToast({
            title: "昵称不能超过20个字符",
            icon: "none",
          });
          this.nickNameNew = "";
          return;
        }
        if (this.nickNameNew.length < 2) {
          uni.showToast({
            title: "昵称不能少于2个字符",
            icon: "none",
          });
          this.nickNameNew = "";
          return;
        }
        let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\p{P}\p{S}]+$/u;
        if(!reg.test(this.nickNameNew)){
          uni.showToast({
            title: "昵称只能包含中文、英文、数字、符号",
            icon: "none",
          });
          return;
        }
        // 发送请求
        nicknameModify({ nickName: this.nickNameNew }).then((res) => {
          console.log("nicknameModify", res);
          this.modalShow = false
          
          // uni.showToast({
          //   title: "修改成功",
          //   icon: "none",
          //   duration: 2000,
          // });
          this.$refs.modal.open({
            title: "修改成功",
            content: "昵称修改成功",
            showCancel: false,
            confirmText: "确定",
          })
          this.nickName = this.nickNameNew
          this.getData()
          if(this.bridgeSdk.isInHiApp())this.bridgeSdk.refreshAppInfo()
        });
      
    },
    jumpToJobInfo() {
      uni.navigateTo({
        url: "/pages/personInfo/jobInfo",
      });
    },
    jumpToLiveInfo() {
      uni.navigateTo({
        url: "/pages/personInfo/liveInfo",
      });
    },
    jumpToInterestInfo() {
      uni.navigateTo({
        url: "/pages/personInfo/interestInfo",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.personInfo {
  width: 100%;
  height: 100vh;
  background: #ffffff;

  .personInfo-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 40rpx;
    // background: #fff;

    .personInfo-row {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 20rpx;
      border-bottom: 1px solid #eee;
      .personInfo-title {
        font-size: 28rpx;
        color: #222;
        font-weight: 600;
        flex-shrink: 0;
      }
      .personInfo-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-grow: 1;
        font-size: 28rpx;
        color: #777;
        .personInfo-content-text {
          margin-left: 20rpx;
          text-align: right;
        }
        .personInfo-content-icon {
          margin-left: 8rpx;
          flex-shrink: 0;
        }
      }
    }
    .logout-btn {
      margin-top: 72rpx;
      font-size: 32rpx;
      font-weight: 600;
      border-radius: 10px;
      border: 2px solid #dddddd;
    }
  }
}
::v-deep .u-border-bottom,
.up-border-bottom {
  border-bottom: 0;
}
</style>
