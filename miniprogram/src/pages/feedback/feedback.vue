<!--
 * @Description: 意见反馈
 * @Author: 陈志涛
 * @Date: 2024年11月20日10:29:09
 * @LastEditors: songy raysongyang@163.com
 * @LastEditTime: 2025-04-22 15:40:54
-->
<template>
	<vc-modal ref="modal"></vc-modal>
	<vc-container  class="feedback">
		<view :style="contentStyle">
			<!-- <vc-status-bar />
			<vc-navbar :props-data="propsData" /> -->
			<view style="padding: 30rpx;">
				<view class="top">
					<view class="top1">
						<view class="wt">
							问题类型
						</view>
						<view class="ls" @click="fkls">
							反馈历史 <text>></text>
						</view>
					</view>
					<view class="top2">
						<view class="tLeft" v-for="(item, index) in search" :key="item.optCode" :style="{marginRight: index%3 == 2 ? '0':'15rpx'}"
							:class='{ ClassThree_color: isThree == item.optCode }' @click="leftClick(item)">
							<text class="">
								{{ item.optName }}
							</text>
						</view>
					</view>
				</view>
				<view class="article fs32" style="margin-bottom: 20rpx;font-size:32rpx;">
					反馈描述
				</view>
				<u--textarea height="100" class="textarea" :style="[{ background: '#F6F6F6', borderRadius: '12rpx' }]"
					:placeholderStyle="{ color: 'red' }" border="none" v-model="feedbackContent"
					:placeholder="'说说您的感受，给大家参考'" count :maxlength="500"></u--textarea>
				<!-- 上传附件 -->
				<view class="p-20">
					<view class="suggestFileHead">
						<text>附件</text>
						<text>上传反馈文档，支持JPG、PNG。最大5M</text>
					</view>
					<view class="uploadFile">
						<view class="uploadFileWrap">
							<view class="midWrap">
								<vc-upload @delete.native="delTuPian" @complete.native="upComplete($event)" :props-data="{
									props: {
										...uploadData.props,
										maxSize: {
											value: 5 * 1024 * 1024
										},
										maxCount: {
											value: 4
										}
									}
								}">
									<image :src="staticBaseUrl + '/hbdimage/baseImage/uploadImg.png'"
										style="width: 160rpx; height: 160rpx;"></image>
								</vc-upload>
								<!-- 底部提示文字 -->
								<!-- <view class="upLoadImg-tip"> 上传图片（最多4张） </view> -->
							</view>
						</view>
					</view>
				</view>

				<view @click="sumBit" class="bottom-btn">
					提交反馈
				</view>

				<vc-safe-bottom />
			</view>
		</view>
	</vc-container>
</template>
<script>
import { mapState } from 'pinia'
import { useBaseStore } from "@/store/index";
import vcUpLoad from '@/components/library/base/vc-upload/index.vue';
import {
	insertFeedBackInfo, //  新增意见反馈
	getDataDic, //  反馈类型字典
} from './api/baseApi';
export default {
	name: "feedback",
	components: {
		'vc-upload': vcUpLoad
	},
	data() {
		return {
			fieldObj: [],
			uploadData: {
				props: {
					//是否开启预览
					previewFullImage: {
						value: false
					}
				}
			},
			propsData: {
				props: {
					title: {
						value: '意见反馈'
					},
				}
			},
			feedbackContent: '',
			phone: "",
			isThree: "0",
			search: [],
			feedbackType: "",
			feedbackClass: "0",// 意见反馈 0；  旅游建议投诉 1；  招聘与就业相关建议反馈 2
			fileList1: [],
			fileIds: '',
			feedbackId: '',
			contentStyle: '',
		}
	},
	computed: {
		...mapState(useBaseStore, {
			maxAviHeightWithNav: "maxAviHeightWithNav"
		})
	},
	mounted(options) {
		console.log(options, '是不是主动测试进入函数')
		this.getDic()
		if (this.maxAviHeightWithNav > 0) {
			this.contentStyle = `position:relative;height:${this.maxAviHeightWithNav}px`;
		}
	},
	methods: {

		getDic() {
			//获取通知状态
			getDataDic({
				code: "FEEDBACK_TYPE",
			}).then((res) => {

				console.log(res, '数据字典');
				this.search = res
			});
		},
		// feedbackType;//意见反馈类型 数据字典 FEEDBACK_TYPE
		// feedbackContent;//意见反馈内容
		upComplete(imageData) {
			console.log(imageData, 'imageData');
			this.fieldObj.push(imageData.id);

		},
		delTuPian(img) {
			this.fieldObj.splice(img.index, 1);
		},
		//  上传
		sumBit() {
			if (!this.feedbackType) {
				uni.showToast({
					title: "请选择问题类型",
					icon: 'none'
				})
				return;
			}
			if (!this.feedbackContent) {
				uni.showToast({
					title: "请填写反馈建议或问题",
					icon: 'none'
				})
				return;
			}
			let userInfo = this.bridgeSdk.getUserInfo()?.userInfo;
			let params = {
				// feedbackId: this.feedbackId,//意见反馈id
				feedbackClass: this.feedbackClass,
				feedbackType: this.feedbackType,//意见反馈类型 数据字典 FEEDBACK_TYPE
				feedbackContent: this.feedbackContent,//内容
				phone: userInfo.mobile,//手机号
				photoId: this.fieldObj.join(','), //图片id
			}
			console.log(params, 'paramsparamsparams');
			insertFeedBackInfo(params).then(res => {
				console.log("上传成功", res)
				uni.showToast({
					icon: 'none',
					title: '提交成功'
				})
				setTimeout(() => {
					this.bridgeSdk.navigateBackTo({
						delta: 1,
					});
				}, 1500);
			})
		},
		change(e) {
			console.log('change', e);
		},
		leftClick(e) {
			this.isThree = e.optCode;
			this.feedbackType = e.optCode;
		},
		fkls() {
			let url = "/pages/feedback/feedHistory?feedbackClass=" + this.feedbackClass
			this.bridgeSdk.jumpPage({
				url
			});
		},
	},
}
</script>
<style lang="scss" scoped>
.feedback {
	background-color: #fff;
	// padding-bottom: 22rpx;
	height: auto;
	min-height: 100vh;
	position: relative;

	&::v-deep .container {
		min-height: 100vh;
		position: relative;
	}
}

.top {
	box-sizing: border-box;
	width: 100%;
	line-height: 50rpx;
	background-color: white;

	.top1 {
		width: 100%;
		height: 44rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;

		.wt {
			font-weight: 600;
			font-size: 32rpx;
			color: #222222;
		}

		.ls {
			font-weight: 400;
			font-size: 28rpx;
			color: #222222;
		}
	}

	.top2 {
		display: flex;
		margin: 30rpx 0;
		justify-content: flex-start;
		flex-wrap: wrap;
		.tLeft {
			width: 220rpx;
			background-color: ghostwhite;
			border-radius: 5%;
			text-align: center;
			line-height: 90rpx;
			font-size: 28rpx;
			background: #F6F6F6;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			margin-right: 15rpx;
		}
		.tLeft2{
			width: 220rpx;
			background-color: ghostwhite;
			border-radius: 5%;
			text-align: center;
			line-height: 90rpx;
			font-size: 28rpx;
			background: #F6F6F6;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			margin-right: 0;
		}
	}


}

.article {
	margin-top: 10rpx;
	line-height: 50rpx;
	font-weight: 600;
	font-size: 28rpx;
	color: #222222;

	text {
		font-size: 28rpx;
		color: #999999;
	}
}

.center {
	box-sizing: border-box;
	width: 100%;
	height: 560rpx;
	background-color: white;
	// background-color: red;
	border-radius: 5%;
	margin-bottom: 20rpx;

	.cen1 {
		width: 100%;
		height: 50rpx;
		line-height: 44rpx;
		margin-bottom: 8rpx;
		margin-top: 40rpx;
		margin-left: 30rpx;

	}

	.cen2 {
		width: 100%;
		height: 460rpx;

		.textarea {
			width: 100%;
			height: 460rpx;
		}

	}
}

.p-20 {
	padding: 30rpx 0;
}

view {
	background-color: #fff;
}

.upLoadImg-tip {
	font-family: 'PingFangSC, PingFang SC';
	font-weight: 400;
	font-size: 24rpx;
	color: #999999;
	text-align: left;
	font-style: normal;
}

.suggestHead {

	text {
		font-size: 32rpx;
		font-weight: 400;
		color: #000000;
		line-height: 45rpx;
	}
}

.suggestType {
	margin-top: 15rpx;
	margin-bottom: 15rpx;
	padding: 0 40rpx;
}

.feedback-block {

	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	padding: 8rpx 40rpx;
	min-height: 80rpx;
	margin-bottom: 15rpx;
}

.uploadFile {

	margin-top: 15rpx;

	.uploadFileWrap {
		display: flex;
		flex-direction: column;
		justify-content: left;
		align-items: left;
		height: fit-content;

		border-radius: 20rpx;

		.midWrap {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;

			text {
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
				line-height: 24rpx;
				margin-top: 10rpx;
			}

			img {
				width: 36rpx;
				height: 27rpx;
			}
		}
	}
}

.suggestFileHead {
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;

	text:nth-child(1) {
		font-size: 32rpx;
		font-weight: 600;
		color: #222222;
		line-height: 45rpx;
	}

	text:nth-child(2) {
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		line-height: 40rpx;
		height: 40rpx;
	}
}

.suggestTextarea {
	background-color: #F6F7F8;
	border-radius: 10rpx;

	textarea {
		width: calc(100% - 60rpx);
		font-size: 30rpx;
		padding: 30rpx;
		margin: 30rpx 0;
		height: 200rpx;
	}
}

.suggestTextareaContent {
	border-radius: 10rpx;
	background-color: #F6F7F8;

	textarea {
		width: calc(100% - 60rpx);
		font-size: 30rpx;
		padding: 30rpx;
		margin: 30rpx 0;
		height: 580rpx;
	}
}

.upShangChuan {
	box-sizing: border-box;
	width: 100%;
	margin-top: 20rpx;
	background-color: white;
	border-radius: 5%;
	padding-top: 20rpx;


	.sct {

		width: 240rpx;
		height: 200rpx;

		.itp {
			width: 160rpx;
			height: 160rpx;
		}

		.tpz {
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
			line-height: 34rpx;
		}
	}

}

.bottom-btn {
	position: absolute;
	bottom: 100rpx;
	left: 30rpx;
	background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #FF5871;
	border-radius: 42rpx;
	font-weight: 600;
	font-size: 32rpx;
	color: #FFFFFF;
	text-align: center;
	line-height: 80rpx;
	width: calc(100% - 60rpx);
}



.ClassThree_color {
	background: #D2F1EE;
	border-radius: 12rpx;
	border: 2rpx solid #23BAAB;
	font-size: 28rpx;
	color: #23BAAB;
}

.u-textarea ::v-deep .u-textarea__count {
	background-color: #F6F6F6 !important;
}

.u-textarea ::v-deep textarea {
	font-size: 28rpx !important;
}

::v-deep .u-border-bottom,
.up-border-bottom {
	border-bottom: 0;
}
</style>