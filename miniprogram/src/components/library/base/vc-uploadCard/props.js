export default {
	fileList: {
		label: '图片列表',
		value: []
	},
	accept: {
		label: "接受的文件类型, 可选值为all media image file video （默认 'image' ）",
		value: "image"
	},
	customAccept: {
		label: "接受的文件类型, 限制多种，可选值为all image pdf （默认 'image' ）（多个用逗号,分割）",
		value: "image"
	},
	disabled: {
		label: "是否禁止上传",
		value: false
	},
	maxSize: {
		label: '超出最大图片上传尺寸',
		value: Number.MAX_VALUE 
	},
	maxCount:{
		label:"最大上传数量",
		value:52
	},
	previewFullImage: {
		label: "是否显示预览",
		value: true
	},
	deletable: {
		label: '是否展示删除按钮',
		value: true
	},
	imageMode: {
		label: "上传区域的图标，只能内置图标（默认 'camera-fill')"
	}
}