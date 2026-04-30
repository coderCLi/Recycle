<template>
	<vc-modal ref="modal"></vc-modal>
	<vc-container  class="feedHistory">
		<view >
			<!-- <vc-status-bar />
		<vc-navbar :props-data="propsData" /> -->
			<!-- <button type="button" @click="login" style="margin-bottom: 40rpx;">反馈历史</button> -->
			<!-- <view style="background: #FFFFFF;box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0,0,0,0.1);height:10rpx;width:100%;">
		</view> -->
			<view style="padding: 40rpx 0;">


				<view class="top1" v-for="(item, index) in nowData " :key="item.feedbackId">
					<view class="top2">

						<view class="tright">
							<view class="tleft" style="flex-shrink: 0;" :class="item.feedbackStatueName === '已回复' ? 'active' : ''">
								{{ item.feedbackStatueName }}
							</view>
							<view class="" style="display: inline">&nbsp;{{ item.feedbackContent }}</view>
						</view>
					</view>
					<view class="feed-image" v-if="item.photoUrl">
						<view v-if="item.photoUrl" style="display: inline-flex;">
							<image v-for="(imgSrc, inde2) in item.photoUrl.split(',')" :src="minioBaseUrl + imgSrc" mode="scaleToFill" style="margin-right: 8px;" :key="inde2" @click="previewImage(item.photoUrl.split(','), inde2, imgSrc)"/>
						</view>
					</view>
					<view class="fanxian">
						<view class="phone">
							<image :src="minioBaseUrl + 'common/pages-feedback/phone.png'" class="phone-img" mode="widthFix" />{{ item.phone || defaultPhone }}
						</view>
						<view class="time">
							{{ item.createTime }}
						</view>
					</view>
					<view class="huifu" v-if="item.replyContent">
						<text>官方回复：{{ item.replyContent }}</text>
					</view>
				</view>
				<view v-if="nowData.length > 0">
					<u-loadmore marginTop="30" :status="status" ></u-loadmore>
				</view>
				<vc-empty v-if="nowData.length == '0'" text="暂无数据" >
				</vc-empty>
			</view>

			<vc-safe-bottom />

		</view>
	</vc-container>
</template>

<script>
import { getFeedBackList } from './api/baseApi';
export default {
	name: "feedHistory",
	data() {
		return {
			propsData: {
				props: {
					title: {
						value: '反馈历史'
					},
				}
			},
			feedbackClass: '',
			nowData: [],
			pageCurrent: 1,
			pageSize: 10,
			status: "loadmore",
			defaultPhone: ''
		}
	},
	onLoad (options) {
		console.log("options", options);
    	this.feedbackClass = options.feedbackClass
	},
	mounted() {
		let userInfo = this.bridgeSdk.getUserInfo()?.userInfo;
		this.defaultPhone = userInfo.mobile
		this.getData();
	},
	onReachBottom() {
		if ((this.nowData.length < this.total) && (this.nowData.length > 0)) {
			this.status = 'loading'
			this.pageCurrent += 1
			this.getData();
		} else if (this.nowData.length >= this.total) {
			this.status = 'nomore'
		}
	},
	methods: {
		getData() {
			// this.total = 0;
			let data = {
				feedbackClass: this.feedbackClass,
				page: this.pageCurrent,
				rows: this.pageSize,
			}
			getFeedBackList(data).then((res) => {
				console.log(res, '回复历史')
				this.nowData = this.nowData.concat(res.list);
				console.log(this.nowData, 'this.nowData')	
				this.total = res.total || 0;
				if (this.nowData.length >= this.total) {
					this.status = 'nomore'
				}
			})
		},
		previewImage(arr, index, str) {
            let url = this.minioBaseUrl + str;
            console.log("预览图片", url);
            let isHttp = (url || "").indexOf("http://") == 0 || (url || "").indexOf("https://") == 0
			let pics = arr.map((str)=> {
				let isHttp = (str || "").indexOf("http://") == 0 || (str || "").indexOf("https://") == 0
				if (isHttp) {
					return str
				} else {
					return this.minioBaseUrl + str
				}
			});
            if (isHttp) {
                uni.previewImage({
                    // 预览时，默认显示图片的索引
                    current: index,
                    // 所有图片 url 地址的数组
                    urls: pics
                })
            }
        }
	}
}
</script>

<style lang="scss" scoped>
.feedHistory {
	background-color: ghostwhite;
	height: auto;
	min-height: 100vh;
}

.top1 {
	width: calc(100vw - 60rpx);
	margin-left: 30rpx;
	background-color: #fff;
	margin-bottom: 32rpx;
	padding: 22rpx 24rpx 24rpx;
	box-sizing: border-box;
	box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
	border-radius: 20rpx;

	.top2 {
		display: flex;

		.tright {
			// display: inline-flex;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			line-height: 45rpx;
			overflow-wrap: break-word;
			word-break: break-all;
			white-space: pre-wrap;
			padding-bottom: 12rpx;

			.tleft {
				display: inline-block;
				height: 44rpx;
				line-height: 44rpx;
				padding: 0 12rpx;
				font-weight: bold;
				font-size: 24rpx;
				color: #FFFFFF;
				border-radius: 10rpx;
				box-sizing: border-box;
				text-align: center;
				background-color: #BDBEBF;
			}

			.active {
				background-color: #00BCB8;
			}
		}
	}

	.fanxian {
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
		line-height: 34rpx;
		display: flex;
		justify-content: space-between;
		.phone {
			
		}
		.phone-img {
			width: 18rpx;
			height: 18rpx;
			margin-right: 6rpx;
		}
		.time {
		}
	}
	

	.huifu {
		margin: 22rpx auto 0;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 44rpx;
		color: #666666;
		padding: 16rpx 20rpx;
		box-sizing: border-box;
		background: #F3F5F7;
		border-radius: 16rpx;
		overflow-wrap: break-word;
		word-break: break-all;
		white-space: pre-wrap;
	}
}

.feed-image {
	display: flex;
	padding: 0 0 20rpx;

	view {
		margin-left: 20rpx;

		image {
			width: 120rpx;
			height: 120rpx;
		}
	}

	view:nth-child(1) {
		margin-left: 0;
	}
}
</style>