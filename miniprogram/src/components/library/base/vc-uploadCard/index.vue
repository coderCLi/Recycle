<template>
	<view @click.stop="()=>{}">
		<!-- 使用插槽内容，自定义样式，不用插槽必须删掉传递的标签内容，不可注释掉，注释$slots.default也有内容 -->
		<up-upload width="640rpx" height="280rpx" v-if="!$slots.trigger && ($slots.default || $slots.$default)" :accept="accept.value"
			:disabled="disabled.value" :imageMode="imageMode.value" :fileList="fileList.value" :deletable="deletable.value"
			:previewFullImage="previewFullImage.value"  @clickPreview="clickPreview($event)" :maxCount="maxCount.value" @oversize="oversize"
			@afterRead="afterRead($event)" @delete="deletePic($event)" :maxSize="maxSize.value"
			:customStyle="customStyle.value">
			<slot></slot>
		</up-upload>
		<!-- 不使用插槽 -->
		<up-upload v-else width="250" height="150" :accept="accept.value" :disabled="disabled.value" :imageMode="imageMode.value"
			:fileList="fileList.value" :deletable="deletable.value" :previewFullImage="previewFullImage.value" @clickPreview="clickPreview($event)"
			:maxCount="maxCount.value" @oversize="oversize" @afterRead="afterRead($event)" @delete="deletePic($event)"
			:maxSize="maxSize.value" :customStyle="customStyle.value"></up-upload>
	</view>
</template>

<script>
import mixins from '../../mixins.js';
import props from './props.js';
import belong from '../intro.json';
import { Toast } from '@/utils/http';
import { getEvnBaseUrl } from '@/utils/index';
/**
 * @description 该组件用于上传图片场景
 * @property {String}			accept				接受的文件类型, 可选值为all media image file video （默认 'image' ）
 * @property {String}			customAccept		接受的文件类型, 限制多种，可选值为all image pdf （默认 'image' ）（多个用逗号,分割）
 * @property {Boolean}			previewFullImage	是否显示组件自带的图片预览功能（默认 true ）
 * @property {String | Number}	maxCount			最大上传数量（默认 52 ）
 * @property {Boolean}			disabled			是否启用（默认 false ）
 * @property {String}			imageMode			预览上传的图片时的裁剪模式，和image组件mode属性一致（默认 'aspectFill' ）
 * @property {Boolean}			deletable			是否展示删除按钮（默认 true ）
 * @property {String | Number}	maxSize				文件大小限制，单位为byte （默认 Number.MAX_VALUE ）
 * @property {Array}			fileList	        显示已上传的文件列表
 * @property {Object}			customStyle			组件的样式，对象形式
 * @event {Function} oversize		文件超出大小限制
 * @event {Function} delete 		删除图片
 * @event {Function} complete		图片上传完成
 * @example <vc-upload :action="action" :props-data="propsData" ></vc-upload>
 */
export default {
	name: 'vcUpload',
	belong,
	mixins: [mixins],
	title: '图片上传',
	data() {
		return {
			...JSON.parse(JSON.stringify(props))
		};
	},
	mounted() { },
	methods: {
		handleFileSelection(res, index) {
			if (res.url) {
				let file = res;
				uni.uploadFile({
					url: getEvnBaseUrl() + '/abpapp/CulturalOneCardController/uploadImg.do?_msg=json',
					filePath: file.url,
					name: 'file',
					formData: { type: 'public' ,from:'idcard'},
					success: (uploadRes) => {
						console.log("上传成功", uploadRes);
						let resultData = null;
						try {
							resultData = JSON.parse(uploadRes.data);
						} catch (error) {
							
						}
						if (resultData.respcode == '0000') {
							//删除上传状态中的图片虚拟地址，此处接口已经上传完成，添加完成图片url以及状态
							this.fileList.value.splice(index, 1, {
								url: this.minioBaseUrl + resultData.result.showUrl // 这里替换为真实的图片URL,即调用上传图片接口返回的服务器url
							});
							resultData.result['index'] = index;
							//上传完成，返回接口结果以及返回当前图片上传的索引
							this.$emit('complete', resultData.result);
						} else {
							Toast(resultData.respmsg);
						}
					},
					fail: (err) => {
						console.log("上传失败", err);
						Toast(err);
					},
					complete: (data) => {
						console.log("上传完成", data);
						let resultData = null;
						try {
							resultData = JSON.parse(data.data);
						} catch (error) {
							
						}
						console.log('完成', resultData);
						if (data.statusCode != '200' || resultData.respcode === '0007') {
							Toast(`调用接口失败,状态码${data.statusCode || ""}`);
							this.deletePic({index: index});
						}
					}
				});
			}
		},
		// 上传图片
		async afterRead(e) {
			console.log('上传的文件', e);
			console.log('当前文件格式', e.file.type);
			console.log('customAccept', this);
			// 文件类型过滤
			if (this.customAccept?.value && this.customAccept?.value.length > 0 && this.customAccept?.value != 'all') {
				let typeArr = this.customAccept.value.replace(/\s+/g, '').split(',');
				console.log(typeArr,'typeArr');
				let isPass = false;
				for (const value of typeArr) {
					if (value.length > 0) {
						// #ifdef H5
						if ((e.file.type || "").includes(value)) {
							isPass = true;
						}
						// #endif
						//  #ifdef MP-WEIXIN
						let filename = e.file.name || e.file.url || "";
						const lastDotIndex = filename.lastIndexOf('.');
						if (lastDotIndex > -1) {
							const houzhui = filename.substring(lastDotIndex + 1).toLowerCase();
							console.log('houzhui', houzhui);
							if (houzhui.length < 5) {
								if (value == 'pdf' && houzhui == value) {
									isPass = true;
								} else if (value == 'image') {
									if (houzhui == 'jpeg' || houzhui == 'jpg' || houzhui == 'png' || houzhui == 'gif' || houzhui == 'svg' || houzhui == 'webp' || houzhui == 'heif' || houzhui == 'heic') {
										isPass = true;
									}
								}
							}
						}
						// #endif
					}
				}
				if (!isPass) {
					Toast(`请上传正确的文件格式`);
					return;
				}
			}

			//将上传的图片赋值给list,用于后续fileList作为展示
			let lists = [].concat(e.file);
			lists.map((item) => {
				this.fileList.value.push({
					...item,
					status: 'uploading',
					message: '上传中'
				});
			});
			console.log("上传文件", this.fileList.value);
			//获取当前图片数组长度（长度-1获取列表最后一个索引）
			let imageListLen = this.fileList.value.length - 1 || 0;
			this.handleFileSelection(e.file, imageListLen);
		},
		// 删除图片
		deletePic(event) {
			this.fileList.value.splice(event.index, 1);
			console.log("删除图片2", this.fileList.value);
			console.log("删除图片2", event);
			this.$emit('delete', event)
		},
		oversize(event) {
			console.log("文件超出大小限制：", event);
			uni.showToast({
				title: '文件超出大小限制',
				icon: 'none'
			})
			this.$emit('oversize', event)
		},
		clickPreview(event) {
			if (event.isImage === false && event.url) {
				const lastDotIndex = (event.url || "").lastIndexOf('/');
				let houzhui = null;
				if (lastDotIndex > -1) {
					houzhui = (event.url || "").substring(lastDotIndex + 1).toLowerCase();
				}
				this.bridgeSdk.previewFile(event.url, event.name || houzhui || "文件");
			}
			this.$emit('clickPreview', event)
		}
	}
};
</script>

<style lang="scss" scoped>
// $w: 40rpx !important !default;
// $size: 16px !important !default;
// ::v-deep .u-upload__deletable {
// 	width: $w;
// 	height: $w;
// }
// ::v-deep .u-icon__icon {
// 	font-size: $size;
// 	top: 0 !important;
// }
</style>
