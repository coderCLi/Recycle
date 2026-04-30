<!--
 * @Description: 首页引导
 * @Author: yuguangquan
 * @Date: 2025-06-21 08:38:32
 * @Remark: 
-->
<template>
    <view class="component" @click.stop="()=>{}">
        <view class="mask-box" v-if="showMaskTag" @touchmove.stop.prevent="()=>{}">
            <!-- <image class="marks" :src="maskSvg"></image> -->
            <!-- <image class="marks" :src="maskSvg"></image> -->
            <zui-svg-icon class="marks" :icon="maskSvg" :width="screenWidth" :height="marksHeight"/>
            <!-- <image class="marks" :src="maskSvg" :width="screenWidth" :height="marksHeight"/> -->
        </view>
        <!-- <view :style="`position: fixed; top: ${dotY}px; left: ${dotX - dotBoxW / 2.0}px; width: 60px; height: 40px; z-index: 1001; background: green;`" @click="showMask Method(showMaskIndex)"></view> -->
        <!-- <view :style="`position: fixed; top: ${0}px; left: ${0}px; width: 60px; height: 40px; z-index: 1001; background: green;`" @click="showMask Method(showMaskIndex)"></view> -->

        <view v-show="showMaskTag && showMaskContent" :style="`width:100vw;height:100vh; visibility: ${showMaskConVisibility ? 'visible' : 'hidden'};`">
            <view :style="`position: fixed; left: ${lineX}px; top: ${lineY}px; width: ${lineW}px; height:${lineH}px; z-index: 1001; background: #ADFFEB;`"></view>
            <view :style="`position: fixed; left: ${lineX + lineW/2.0 - circleW/2.0}px; top: ${circleY}px; width: ${circleW}px; height:${circleW}px; border-radius: ${circleW/2.0}px; z-index: 1001; background: #ADFFEB;`">
                <view :style="`position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: ${circleBigW}px; height:${circleBigW}px; border-radius: ${circleBigW/2.0}px; z-index: 1001; background: #A3FFE9; opacity: 0.4;`"></view>
            </view>
            

            <!-- <u-parse class="mask-content" :tag-style="{display: 'inline-block'}" :style="`position: fixed; left: ${contentX}px; top: ${contentY}px; width: ${contentW}; height:${contentH}; z-index: 1001; max-width: calc(100vw - ${defaultSide * 2}px); min-width: calc(50vw + ${defaultSide * 2}px);`" 
            lazy-load selectable scroll-table :content="contentTxt"></u-parse> -->
            <view class="mask-content" :tag-style="{display: 'inline-block'}" :style="`position: fixed; left: ${contentX}px; top: ${contentY}px; width: ${contentW}; height:${contentH}; z-index: 1001; max-width: calc(100vw - ${defaultSide * 2}px); min-width: calc(50vw + ${defaultSide * 2}px);`" 
             v-html="contentTxt"></view>

            <view class="mask-btns" :style="`position: fixed; left: ${contentX}px; top: ${maskBtnY}px; width: ${contentW}; height:33px; z-index: 1001; justify-content: ${ maskBtnLeft ? 'start' : 'flex-end'};`">
                <!-- v-if="showMaskIndex < maskRectList.value.length" :style="` ${(showMaskIndex < maskRectList.value.length) ? '' : 'margin-left:0;'}`" -->
                <view class="btn-next" @click="endMask()">跳过</view>
                <view class="btn-know" @click="showMaskMethod(showMaskIndex)">知道了</view>
            </view>
        </view>
    </view>
</template>

<script>
    import mixins from "../../mixins.js"
    import props from "./props.js";
    import belong from "../intro.json";
    import pagesjson from '@/pages.json'
    import zuiSvgIcon from '@/uni_modules/uv-ui/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue';
    export default {
        belong,
        mixins: [mixins],
        title: "首页引导",
        components: {
            zuiSvgIcon
        },
        data() {
            return {
                ...JSON.parse(JSON.stringify(props)),
                pagesjson,
                showMaskIndex: 0,
                showMaskTag: false,
                showMaskContent: false,
                showMaskConVisibility: false,
                screenWidth: 0,
                screenHeight: 0,
                eleX: 0,
                eleY: 0,
                eleW: 0,
                eleH: 0,
                marksHeight: 0,
                dotX: 0,
                dotY: 0,
                contentTxt: '',
                contentX: 0,
                contentY: 0,
                contentW: 'auto',
                contentH: 'auto',
                defaultSide: 20,
                maskBtnY: 0,
                lineX: 0,
                lineY: 0,
                lineW: 2,
                lineH: 54,
                maskBtnLeft: false,
                circleW: 12,
                circleY: 0,
                circleBigW: 20,
                againCount: 0
            }
        },
        computed: {
            maskSvg() {
                const svgXml = `<svg  xmlns="http://www.w3.org/2000/svg"  width="${this.screenWidth}" height="${this.marksHeight}">
        <defs>
            <mask id="hole">
            <path d="M0,0 
                    H${this.screenWidth}
                    V${this.marksHeight}
                    H0
                    Z" fill="white"/>
            <rect x="${this.eleX}" y="${this.eleY}" width="${this.eleW}" height="${this.eleH}" rx="6" ry="6" fill="black"/>
            </mask>
        </defs>
        <rect width="${this.screenWidth}" height="${this.marksHeight}" fill="rgba(0,0,0,0.6)" mask="url(#hole)" />
        <rect
            x="${this.eleX-3}" y="${this.eleY-3}"
            width="${this.eleW+6}" height="${this.eleH+6}"
            rx="6" ry="6"
            fill="none"
            stroke="white"
            stroke-width="1.5"
            stroke-dasharray="3,4"
            />
        </svg>`
            // console.log('------json',JSON.stringify(svgXml))
            // return JSON.stringify(svgXml);
                return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgXml)}`;
            }
		},
        async mounted() {
            const windowInfo = await this.bridgeSdk.getWindowInfo();
            this.screenWidth = windowInfo.windowWidth;
            this.screenHeight = windowInfo.screenHeight;
            // this.safeTopDistance += this.navigationBarInfo.statusBarHeight + this.navigationBarInfo.navigationBarHeight;
        },

        methods: {
            endMask() {
                this.showMaskIndex = 0;
                this.showMaskTag = false;
                this.showMaskContent = false;
                this.showMaskConVisibility = false;
            },
            calcMarksHeight(sucessFunc) {
                if (!this.marksHeight) {
                    this.showMaskTag = true;
                    setTimeout(() => {
                        let query = uni.createSelectorQuery().in(this);
                        query
                            .select(".mask-box")
                            .boundingClientRect((data) => {
                                this.marksHeight = (data.height || data.dataset.height);
                                console.log('----------marksHeight--', this.marksHeight);
                                sucessFunc && sucessFunc();
                            })
                            .exec();
                    }, 5);
                } else {
                    sucessFunc && sucessFunc();
                }
            },
            // 显示或切换
            showMaskMethod(showIndex) {
                this.calcMarksHeight(()=>{
                    this.trueCalc(showIndex);
                });
            },
            trueCalc(showIndex) {
                const isend = this.showMaskIndex >= this.maskRectList.value.length
                console.log('--------------------showIndex--', showIndex, this.showMaskIndex, this.maskRectList.value, isend)
                if (isend) { this.showMaskTag = false; this.showMaskIndex = 0; return; }
                console.log('-------------this.maskRectList-----' + showIndex, this.maskRectList.value);
                if (this.maskRectList.value.length == 0 && this.maskRectList.value.length <= showIndex) { return }
                let offset = {ww: 0, hh: 0}
                
                
                this.showMaskTag = true;
                
                let _showIdx = showIndex;
                let _mRect = this.maskRectList.value[_showIdx];
                // 根据不同类型调整偏移量，控制框的大小
                if (_mRect.showType == 'big') {
                    // this.$emit("updateServiceIndexForMask", _mRect.name);
                    if (_mRect.mask == false) {
                    _showIdx = _showIdx + 1;
                    if (this.maskRectList.value.length <= _showIdx) {
                        _mRect = this.maskRectList.value[_showIdx];
                    }
                    } else {
                    offset = {ww: 20, hh: 10}
                    }
                }
                if (_mRect.showType == 'kongKim') {
                    offset = {ww: -5, hh: 5}
                } else if (_mRect.showType == 'tabbar') {
                    offset = {ww: -10, hh: -5}
                }

                let superParent = this.$parent
                if (!superParent.getEleThat) {
                    superParent = this.$parent.$parent
                }
                let eleThat = superParent;
                if (_mRect.showType == 'kongKim' || _mRect.showType == 'TSBK') {
                    if (eleThat.$refs[_mRect.showType + ''].length) {
                        eleThat = eleThat.$refs[_mRect.showType + ''][0].getThat();
                    }
                }
                console.log('-----------eleThat---', eleThat, _mRect.contentText)

                this.contentTxt = _mRect.contentText
                
                // 计算内容的尺寸
                this.contentW = 'auto';
                this.contentH = 'auto';
                this.showMaskContent = true;
                this.showMaskConVisibility = false;
                this.againCount = 0;
                let allTime = 600000;
                const calcFunc = (cc, tt)=>{
                    allTime = allTime - tt;
                    if (allTime < 0) {
                        console.log('-------------渲染太慢，重新计算，失败 停止显示');
                        this.endMask()
                        return;
                    }
                    setTimeout(() => {
                        this.$nextTick(() => {
                            let query = uni.createSelectorQuery().in(this);
                            query
                            .select(".mask-content")
                            .boundingClientRect((data) => {
                                console.log('------mask-content--cc' + cc + '--', data)
                                this.showMaskContent = false;
                                if (data) {
                                    this.contentX = (data.left || data.dataset.left);
                                    this.contentY = (data.top || data.dataset.top);
                                    this.contentW = (data.width || data.dataset.width) + 'px';
                                    this.contentH = (data.height || data.dataset.height) + 'px';

                                    // 渲染太慢，兼容
                                    const _height = (data.height || data.dataset.height);
                                    if (!_height) {
                                        if (this.againCount == cc) {
                                            // if (this.againCount <= 4) {
                                                this.againCount = this.againCount + 1;
                                                console.log('-------------渲染太慢，重新计算 ' + this.againCount + '---' + Date.now() );
                                                let _t = 2000;
                                                // let _t = 10; 
                                                // if (this.againCount == 2) {
                                                //     _t = 500;
                                                // } else if (this.againCount == 3) {
                                                    
                                                // } else if (this.againCount == 4) {
                                                //     _t = 5000;
                                                // }
                                                calcFunc(this.againCount, _t);
                                            // } else {
                                                
                                            // }
                                        }
                                        return;
                                    } else {
                                        this.queryEle(_mRect, offset, eleThat);
                                    }
                                } else {
                                    this.contentW = '0px';
                                    this.contentH = '0px';
                                    this.queryEle(_mRect, offset, eleThat);
                                }
                                
                            })
                            .exec();
                        });
                    }, tt);
                }
                calcFunc(this.againCount, 5);
                this.showMaskIndex = _showIdx + 1;
            },
            // 获取定位元素尺寸
            queryEle(_mRect, offset, eleThat) {
                console.log('--------query Ele--')
                // setTim eout(() => {
                if (_mRect.showType == 'tabbar') {
                
                    let _count = this.pagesjson.tabBar.list.length
                    // let _index = this.pagesjson.tabBar.list.findIndex((e)=>{
                    //     return e.text == _mRect.name
                    // })
                    let _index = (_mRect.index - 1)
                    if (_mRect.index > 3 && this.pagesjson.tabBar.list.length > (_mRect.index - 2)) {
                        _index = _mRect.index - 2
                    }

                    this.eleX = this.screenWidth / _count * _index - offset.ww;
                    this.eleY = this.marksHeight - uni.getSystemInfoSync().windowBottom - offset.hh;
                    this.eleW = this.screenWidth / _count + offset.ww * 2;
                    this.eleH = uni.getSystemInfoSync().windowBottom + offset.hh * 2;

                    this.calcDotPosition();
                
                } else {
                    let query = uni.createSelectorQuery().in(eleThat);
                    query
                            .select("." + _mRect.tagId)
                            .boundingClientRect((data) => {
                                console.log('---------------mRect-data-' + _mRect.tagId, data);
                                if (data) {
                                    this.eleX = (data.left || data.dataset.left) - offset.ww;
                                    this.eleY = (data.top || data.dataset.top) - offset.hh;
                                    this.eleW = (data.width || data.dataset.width) + offset.ww * 2;
                                    this.eleH = (data.height || data.dataset.height) + offset.hh * 2;

                                    this.calcDotPosition();
                                } else {
                                    // 直接处理下一个
                                    this.showMaskMethod(this.showMaskIndex);
                                }
                            })
                            .exec();
                }
                // }, 5);
            },
            // 处理各个元素尺寸
            calcDotPosition() {
                let _contentW = parseFloat((this.contentW || '').replace(/px/g, ''))
                let _contentH = parseFloat((this.contentH || '').replace(/px/g, ''))

                console.log('-------------if (this.eled----', this.contentH, _contentH)

                let lineHeight = this.lineH + this.circleBigW/2.0;
                let dotX = this.eleX + this.eleW / 2.0;
                
                let dotY = 0
                let lineY = 0
                let _maskContentBottom = true;
                console.log('-------------if (this.eleY----', this.eleY, this.marksHeight, uni.getSystemInfoSync().windowBottom, lineHeight, _contentH)
                if (this.marksHeight < ((this.eleY + this.eleH + lineHeight     + _contentH + 8 + 33) + 50)) {
                    dotY = this.eleY - this.circleW - (this.circleBigW - this.circleW)/2.0
                    lineY = this.eleY - lineHeight
                    this.circleY = this.eleY - (this.circleW + (this.circleBigW - this.circleW)/2.0) -6
                    this.contentY = this.eleY - (lineHeight + _contentH)
                    
                    _maskContentBottom = false;
                } else {
                    dotY = this.eleY + this.eleH + (this.circleBigW - this.circleW)/2.0
                    lineY = this.eleY + this.eleH + this.circleW
                    this.circleY = lineY - (this.circleBigW - this.circleW)/2.0 +3
                    this.contentY = this.eleY + this.eleH + lineHeight
                }
                
                // this.eleY + this.eleH + lineHeight     + _contentH + 8 + 33

                this.dotX = dotX
                this.dotY = dotY
                this.lineX = this.dotX - this.lineW/2.0;
                this.lineY = lineY

                this.maskBtnY = this.contentY + _contentH + 8
                // if (!_maskContentBottom && (this.lineX > (this.screenWidth / 2.0 - 50)) && this.lineX < (this.screenWidth / 2.0 + 50)) {
                if (!_maskContentBottom) {
                    this.maskBtnY = this.contentY - 8 - 33
                }
                let maskBtnC = this.maskBtnY + 33/2.0;
                this.maskBtnLeft = false
                if ( (this.lineX > (this.screenWidth + this.defaultSide)/2.0) && (this.lineY < maskBtnC && maskBtnC < (this.lineY + this.lineH)) ) { // 居左，则距右
                    this.maskBtnLeft = true
                    console.log('-----------this.maskBtnL eft--------', this.lineX, (this.screenWidth - (this.defaultSide + 50)) )
                }
                
                let dotOffX = this.dotX - this.screenWidth/2.0; // 和centerX对比，偏移
                let contentLeft = Math.max(this.defaultSide, (this.screenWidth - _contentW)/2.0 - dotOffX);
                if (this.screenWidth - contentLeft - _contentW < this.defaultSide) { contentLeft = contentLeft - (this.defaultSide - (this.screenWidth - contentLeft - _contentW)) }

                if ( (this.lineX > (this.screenWidth / 4.0 * 3)) && ((contentLeft + _contentW - this.defaultSide) < (this.lineX))) { 
                    contentLeft = this.screenWidth - _contentW - this.defaultSide
                } else if ( (this.lineX < (this.screenWidth / 4.0 * 1)) && (contentLeft > (this.lineX))) { 
                    contentLeft = this.defaultSide
                }
                this.contentX = contentLeft;

                this.showMaskTag = true;
                this.showMaskContent = true;
                this.showMaskConVisibility = true;
            },
        },
    }
</script>

<style lang="scss" scoped>
.component {
    // position: fixed;
    // width: 100vw;
    // height: 100vh;
    // left: 0;
    // top: 0;
    // z-index: 1000;

    height: 0;

    .mask-box {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0.0);
        .marks {
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        }
    }
    .mask-content {
        background: linear-gradient( 119deg, #E9FFFA 0%, #C1FFF0 100%);
        border-radius: 30rpx;
        border: 1px solid #FFFFFF;

        font-weight: bold;
        font-size: 28rpx;
        color: #333333;
        line-height: 36rpx;
        box-sizing: border-box;
        padding:20rpx 30rpx;
    }

    .mask-btns {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        font-weight: 600;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 33px;
        .btn-next {
        width: 78px;
        height: 33px;
        text-align: center;
        border-radius: 20px;
        border: 1px solid #FFFFFF;
        box-sizing: border-box;
        }
        .btn-know {
        margin-left: 12px;
        width: 78px;
        height: 33px;
        text-align: center;
        border-radius: 20px;
        background: linear-gradient( 87deg, #16C3BC 0%, #AFE8D3 100%), linear-gradient( 90deg, #11FFBC 0%, #00BCB8 100%);
        box-sizing: border-box;
        }
    }
}
</style>
