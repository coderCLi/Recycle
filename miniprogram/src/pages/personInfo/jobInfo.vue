<template>
  <vc-modal ref="modal"></vc-modal>
  <vc-container class="jobInfo">
    <view class="jobInfo-box">
      <view class="jobInfo-row">
        <view class="jobInfo-title">工作状态</view>
        <view class="jobInfo-content" @click="selectJobStatus">
          <view v-if="jobStatus">{{ jobStatusName }}</view>
          <view v-else style="color: #999999">请选择</view>
          <up-icon name="arrow-right" size="14"></up-icon>
        </view>
      </view>
      <view class="jobInfo-row">
        <view class="jobInfo-title">邮箱账号</view>
        <view class="jobInfo-content">
          <input
            class="jobInfo-input"
            type="text"
            v-model="email"
            placeholder="请输入"
            style="text-align: right"
            placeholder-class="jobInfo-input-placeholder"
          />
        </view>
      </view>
      <view class="jobInfo-row">
        <view class="jobInfo-title">参加工作时间</view>
        <view class="jobInfo-content" @click="selectStartJobTime">
          <view v-if="startJobDate">{{ startJobDate }}</view>
          <view v-else style="color: #999999">请选择</view>
          <up-icon name="arrow-right" size="14"></up-icon>
        </view>
      </view>
      <view class="jobInfo-row">
        <view class="jobInfo-title">所属行业</view>
        <view class="jobInfo-content" @click="industrySelection('industry')">
          <view v-if="industryId">{{ industryName }}</view>
          <view v-else style="color: #999999">请选择</view>
          <up-icon name="arrow-right" size="14"></up-icon>
        </view>
      </view>
      <up-button
        class="logout-btn"
        type="default"
        text="保存"
        @click="saveInfo"
      ></up-button>
    </view>
  </vc-container>
  <up-picker
    :show="pickerShow"
    ref="uPickerRef"
    confirmColor="#00BCB8"
    keyName="optName"
    @cancel="pickerShow = false"
    :columns="jobStatusList"
    @confirm="confirmJobStatus"
  ></up-picker>
  <up-datetime-picker
    :show="dateShow"
    v-model="startJobDateTime"
    mode="date"
    ref="uDatePickerRef"
    :minDate="minDate"
    :maxDate="maxDate"
    confirmColor="#00BCB8"
    @cancel="dateShow = false"
    @confirm="confirmStartJobTime"
  ></up-datetime-picker>
</template>

<script>
import { getDataDicList, getCareerInfo, editUserSubbly } from "../../api/mine";

export default {
  data() {
    return {
      email: "",
      industryName: "",
      industryId: "",
      industryRes: [],
      jobStatus: "",
      jobStatusName: "",
      jobStatusList: [],
      startJobDate: "",
      startJobDateTime: new Date().getTime(),
      minDate: new Date(1900, 1, 1).getTime(),
      maxDate: new Date().getTime(),
      pickerShow: false,
      dateShow: false,
    };
  },
  mounted() {
    this.getDataDic();
    this.getData();
  },
  methods: {
    getData() {
      getCareerInfo({}).then((res) => {
        console.log("getCareerInfo", res);
        this.email = res.mail;
        this.jobStatus = res.workStatus;
        this.jobStatusName = res.workStatusName;
        this.startJobDate = res.timeToWork;
        this.industryId = res.industryId;
        this.industryName = res.industryName;
      });
    },
    //求职状态
    async getDataDic() {
      await getDataDicList({
        code: "JOB_STATUS",
      }).then((res) => {
        console.log(res, "res.result  result");
        let arr2 = res;
        let arr1 = arr2.map((element) => {
          return {
            optName: element.optName,
            optCode: element.optCode,
          };
        });
        this.jobStatusList.push(arr1);
      });
    },
    // 选择工作状态
    selectJobStatus() {
      this.pickerShow = true;
    },
    // 确认工作状态
    confirmJobStatus(e) {
      console.log(e, "求职状态返回");
      this.jobStatus = e.value[0].optCode;
      this.jobStatusName = e.value[0].optName;
      this.pickerShow = false;
    },

    // 选择工作开始时间
    selectStartJobTime() {
      this.dateShow = true;
    },
    // 确认工作开始时间
    confirmStartJobTime(e) {
      console.log(e, "开始时间返回");
      this.startJobDate = this.dateFormat(new Date(e.value), "yyyy-MM-dd");
      this.dateShow = false;
    },
    //  行业选择
    industrySelection(industry) {
      console.log(industry, "industryindustryindustry");
      let temporary = this.industryRes.map((r) => {
        return {
          industryName: r.industryName,
          industryId: r.industryId,
        };
      });
      let selectedIndustry = JSON.stringify(temporary);
      uni.navigateTo({
        url: `/package-recruitment/pages/industry-select?maxSelectCount=1&chooseData=${selectedIndustry}`,
      });
    },
    // 行业返回
    __getChooseIndustryResult__(result) {
      console.log("__getChooseIndustryResult__", result);
      if (result && result.length > 0) {
        this.industryRes = result;
        this.industryName = result[0].industry;
        this.industryId = result[0].industryId;
      }
      console.log(this.industryName, "industryName");
      console.log(this.industryId, "industryId");
    },
    // 保存信息
    saveInfo() {
      console.log(this.email, "emailemailemail");
      console.log(this.industryId, "industryId");
      console.log(this.jobStatus, "jobStatus");
      console.log(this.startJobDate, "startJobDate");
      if (
        this.email &&
        !/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
          this.email
        )
      ) {
        uni.showToast({
          title: "邮箱格式不正确",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      // 发送请求

      editUserSubbly({
        workStatus: this.jobStatus,
        mail: this.email,
        timeToWork: this.startJobDate,
        industryId: this.industryId,
      }).then((res) => {
        console.log("editUserSubbly", res);
        this.$refs.modal.open({
          title: "保存成功",
          content: "职业信息保存成功",
          showCancel: false,
          confirmText: "确定",
          confirmCallback: () => {
            uni.navigateBack();
          },
        });
      });
    },
    dateFormat(date, dformat) {
      let format;
      if (dformat != undefined && dformat != null) {
        format = dformat;
      } else {
        format = "yyyy-MM-dd hh:mm:ss";
      }
      if (date !== "Invalid Date") {
        var o = {
          "M+": date.getMonth() + 1, // month
          "d+": date.getDate(), // day
          "h+": date.getHours(), // hour
          "m+": date.getMinutes(), // minute
          "s+": date.getSeconds(), // second
          "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
          S: date.getMilliseconds(), // millisecond
        };
        if (/(y+)/.test(format)) {
          format = format.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length === 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return format;
      }
      return "";
    },
  },
};
</script>

<style scoped lang="scss">
.jobInfo {
  width: 100%;
  height: 100vh;
  background: #ffffff;

  .jobInfo-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 40rpx;
    // background: #fff;

    .jobInfo-row {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 20rpx;
      border-bottom: 1px solid #eee;

      .jobInfo-title {
        font-size: 28rpx;
        color: #222;
        font-weight: 600;
      }

      .jobInfo-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 100rpx;
        font-size: 28rpx;
        color: #777;

        .up-icon {
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #999;
        }
      }
    }

    .logout-btn {
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
  .jobInfo-input::-webkit-input-placeholder {
    color: #999999;
  }
}

::v-deep .u-border-bottom,
.up-border-bottom {
  border-bottom: 0;
}
  ::v-deep .jobInfo-input-placeholder {
    color: #999999;
  }
</style>