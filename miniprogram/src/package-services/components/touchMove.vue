<!--
  User: songjuncheng
  Date: 2025-05-22 09:13:56
  Description: 触摸上滑、下滑组件
  Lasteditors:songjuncheng
-->
<template>
  <view v-if="comType === 'point'" class="touchMove" :style="{ marginTop: ((touchHeight.toString()).endsWith('px')? touchHeight : touchHeight + 'rpx') }" @touchmove="touchMove" @touchstart="touchStart" @touchend="touchEnd">
    <slot></slot>
  </view>
  <view v-else>
    <slot></slot>
  </view>
</template>

<script>
    export default {
        name:'touchMove', 
        components:{},
        props:{
            upDistance: {
                    type: Number,
                    default: -1,
                },
            downDistance: {
                    type: [Number, String],
                    default: 690,
                },
            comType: {
                    type: String,
                    default: '',
            },
            isShowMap:{
                    type: Boolean,
                    default: true,
            },
            dropFilterStatus: {  // 筛选栏开启状态
                    type: String,
                    default: '0',
            }
        },
        data(){
            return{
                 touchHeight: 690, // 触摸区域距离顶部高度
                 startX: 0, // 开始时的X坐标
                 startY: 0, // 开始时的Y坐标
                 startTime: 0, // 开始时的毫秒数
            };
        },
        watch:{
          downDistance:{
              handler(newVal, oldVal) {
                if(newVal){
                  this.touchHeight = newVal
                }
            },
            immediate: true,
          }
        },
        mounted(){
            this.touchHeight = this.downDistance
        },
        methods:{
        touchMove (e) { 
          // 防止页面滚动
            e.preventDefault();
            
            // 当前触摸位置的Y坐标
            const currentY = e.touches[0].clientY;
            // 计算Y轴移动距离
            const moveDistance = currentY - this.startY;
            
            // 判断滑动方向（这里设置阈值为10，避免轻微触碰误判）
            if (moveDistance < -10) {
            if(this.isShowMap){
                          this.touchHeight = this.upDistance
                          this.$emit('touchEndBack','up')
                        }          
            } else if (moveDistance > 10) {
               if(this.dropFilterStatus == '0'){

                        if(this.isShowMap){
                          this.touchHeight = this.downDistance
                          this.$emit('touchEndBack','down')
                        }
                      }
            }

        },
             touchStart (e) {
                console.log('touchStart', e)
                    //console.log('向下滑动',e.changedTouches[0].pageX)
                    this.startX = e.touches[0].pageX; // 获取触摸时的x坐标  
                    this.startY = e.touches[0].pageY; // 获取触摸时的x坐标
                    this.startTime = new Date().getTime();//获取毫秒数
                },
                touchEnd (e) { 
                    console.log('touchEnd', e)
                    this.startY = 0
//                     var endX = e.changedTouches[0].pageX;
//                     var endY = e.changedTouches[0].pageY;
//                     var touchTime = new Date().getTime() - this.startTime;//计算滑动时间
//                     //开始判断
//                     //2.判断偏移量：分X、Y
//                     var xOffset = endX - this.startX;
//                     var yOffset = endY - this.startY;
//                     var minOffset = 30;
//                  //（偏移量x或者y要大于最小偏移量）
                    
//                 if (Math.abs(xOffset) < Math.abs(yOffset) && Math.abs(yOffset) >= minOffset) {
//                         //上下滑动
//                         //条件3（判断偏移量的正负）
//                         if (yOffset < 0) {
//                         console.log('向上滑动',e.target.offsetTop)
//                         if(this.isShowMap){
//                           this.touchHeight = this.upDistance
//                           this.$emit('touchEndBack','up')
//                         }          
                        
//                         // #ifdef H5
//                           this.touchHeight = this.upDistance
//                           this.$emit('touchEndBack','up')
//                         // #endif
//                         } else {
//                         console.log('向下滑动',e.target.offsetTop)
//                         if(this.dropFilterStatus == '0'){

//                         if(this.isShowMap){
//                           this.touchHeight = this.downDistance
//                           this.$emit('touchEndBack','down')
//                         }

//                         // #ifdef H5
//                           this.touchHeight = this.downDistance
//                           this.$emit('touchEndBack','down')
//                         // #endif
//                         }
                                                  
//                       }
//                     }
                     
                },

        touchCancel (e) {
            this.startX = 0;//开始时的X坐标
            this.startY = 0;//开始时的Y坐标
            this.startTime = 0;//开始时的毫秒数

        },
        },
        computed:{},
    }
</script>

<style lang='scss' scoped>
    .touchMove{
          position: relative;
          z-index: 20;
          transition: margin-top 0.3s ease;
    }
</style>