<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="interestInfo">
    <view class="interestInfo-item" v-for="(item, index) in list" :key="index">
      <view class="interestInfo-item-title">
        {{ item.name }}
      </view>
      <view class="interestInfo-item-content">
        <view v-for="(child, childIndex) in item.children" :key="childIndex">
          <view
            :class="
              activeList[child.value]
                ? 'interestInfo-item-content-item-active'
                : 'interestInfo-item-content-item'
            "
            @click="handleClick(child.value)"
            >{{ child.name }}</view
          >
        </view>
      </view>
    </view>
    <view class="interestInfo-btn" @click="handleSave">保存</view>
  </vc-container>
</template>

<script>
import { editUserSubbly, getInterestsInfo,getJsonDetailById } from "@/api/mine";
export default {
  name: "interestInfo",
  data() {
    return {
      activeList: {},
      list: [],
    };
  },
  onLoad() {
    this.getInterestsInfo();
    getJsonDetailById({id:"get-interests-info-2025-07-15"}).then((res) => {
      console.log("getJsonDetailById", res);
      this.list = JSON.parse(res.content)
    })
  },
  methods: {
    handleClick(value) {
      this.activeList[value] = !this.activeList[value];
    },
    getInterestsInfo() {
      getInterestsInfo({}).then((res) => {
        console.log("getInterestsInfo", res);
        let activeList = res.interest? res.interest.split(",") : [];
        for (let i = 0; i < activeList.length; i++) {
          this.activeList[activeList[i]] = true;
        }
      });
    },
    handleSave() {
      // 发送请求
      let interests = [];
      for (let key in this.activeList) {
        if (this.activeList[key]) {
          console.log(key);
          interests.push(key);
        }
      }
      console.log("interests", interests);
      editUserSubbly({interest: interests.join(",")}).then((res) => {
        console.log("editUserSubbly", res);
        this.$refs.modal.open({
          title: "保存成功",
          content: "兴趣爱好保存成功",
          showCancel: false,
          confirmText: "确定",
          confirmCallback: () => {
            uni.navigateBack();
          },
        })
      });
    },
  },
};
</script>

<style scoped lang="scss">
.interestInfo {
  background: #ffffff;
  .interestInfo-item {
    background: #fff;
    // margin-bottom: 20rpx;
    // padding-bottom: 20rpx;
    .interestInfo-item-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
      padding: 24rpx 40rpx;
    }
    .interestInfo-item-content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      align-items: center;
      .interestInfo-item-content-item {
        flex-shrink: 0;
        width: 206rpx;
        border: 2rpx solid #e5e5e5;
        text-align: center;
        padding: 16rpx 6rpx;
        box-sizing: border-box;
        margin: 10rpx 20rpx;
        border-radius: 10rpx;
      }
      .interestInfo-item-content-item-active {
        flex-shrink: 0;
        width: 206rpx;
        border: 2rpx solid #e5e5e5;
        text-align: center;
        padding: 16rpx 6rpx;
        background: #0000ff;
        color: #ffffff;
        box-sizing: border-box;
        margin: 10rpx 20rpx;
        border-radius: 10rpx;
      }
    }
  }
  .interestInfo-btn {
           font-size: 32rpx;
      font-weight: 600;
      border-radius: 10px;
      border: 2px solid #dddddd;
      width: 670rpx;
      margin: 72rpx auto 40rpx;
      padding: 10rpx 0;
      background: #fff;
      text-align: center;
  }
}
</style>