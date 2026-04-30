<template>
  <view class="calendar">
    <view class="calendar-header">
      <view class="calendar-prev" @click="prevMonth">{{"<"}}上月</view>
      <view class="calendar-title">{{ year }}年{{ month }}月</view>
      <view class="calendar-next" @click="nextMonth">下月{{ ">" }}</view>
    </view>
    <view class="calendar-body">
      <view class="calendar-weekdays">
        <view
          class="calendar-weekday"
          v-for="(weekday, index) in weekdays"
          :key="index"
        >
          {{ weekday }}
        </view>
      </view>
      <view class="calendar-dates">
        <view
          class="calendar-date"
          v-for="(date, index) in dates"
          :key="index"
          @click="selectDate(date)"
        >
        <view class="calendar-date-content" :class="{ 'calendar-date-today': isToday(date), 'calendar-date-selected': isSelected(date) }">
           {{ date || '' }}
           <view v-if="false" class="calendar-date-selected-dot">.</view>
        </view>
        </view>
      </view>
    </view>
  </view>
</template>
 
<script>
  export default {
    name: "calendar",
    data() {
      return {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        weekdays: ["日", "一", "二", "三", "四", "五", "六"],
        selectedDate: null,
      };
    },
    computed: {
      dates() {
        const firstDayOfMonth = new Date(this.year, this.month - 1, 1);
        const lastDayOfMonth = new Date(this.year, this.month, 0);
        const dates = [];
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
          dates.push(i);
        }
        for (let i = 1; i < firstDayOfMonth.getDay(); i++) {
          dates.unshift(null);
        }
        return dates;
      },
    },
    methods: {
      prevMonth() {
        if (this.month === 1) {
          this.year -= 1;
          this.month = 12;
        } else {
          this.month -= 1;
        }
      },
      nextMonth() {
        if (this.month === 12) {
          this.year += 1;
          this.month = 1;
        } else {
          this.month += 1;
        }
      },
      isToday(date) {
        const today = new Date();
        return (
          this.year === today.getFullYear() &&
          this.month === today.getMonth() + 1 &&
          date === today.getDate()
        );
      },
      isSelected(date) {
        return this.selectedDate && this.selectedDate === date;
      },
      selectDate(date) {
        this.selectedDate = date;
        this.$emit("select", new Date(this.year, this.month - 1, date));
      },
    },
  };
</script>
 
<style scoped>
  .calendar {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background: #fff;
  }
 
  .calendar-header {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    font-weight: 600;
  }
 
  .calendar-title {
    text-align: center;
    flex: 1;
  }
 
  .calendar-prev,
  .calendar-next {
    cursor: pointer;
  }
 
  .calendar-body {
    display: flex;
    flex-direction: column;
  }
 
  .calendar-weekdays {
    display: flex;
  }
 
  .calendar-weekday {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-weight: 600;
  }
 
  .calendar-dates {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10rpx;
    border-bottom: 24rpx solid #fafafd;
  }
 
  .calendar-date {
    width: calc(100% / 7);
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  .calendar-date-today {
    color: #00BCB8;
    font-weight: 600;
  }
  
  .calendar-date-content{
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    line-height: 50rpx;
    text-align: center;
    position: relative;
    .calendar-date-selected-dot {
      position: absolute;
      width: 50rpx;
      height: 20rpx;
      line-height: 20rpx;
      text-align: center;
      bottom: 0;
      left: 0;
      color: #00BCB8;
    }
  }

  .calendar-date-selected {
    background-color: #00BCB8;
    color: rgb(255, 255, 255);
  }
</style>