<template>
	<vc-modal ref="modal"></vc-modal>
	<view class="filterCom">
		<!-- 以下事件方法根据实际情况选择使用 -->
		<!-- 		<vc-filter
			:props-data="propsData"
			@locationClick="locationClick"
			@menuClick="menuClick"
			@subMenuClick="subMenuClick"
			@resetClick="resetClick"
			@completeClick="completeClick"
			@dropdownClick="dropdownClick"
		></vc-filter> -->
		<vc-filter
			ref="filterRef"
			:filterTop="filterTop"
			:dropdownProps="dropdownProps"
			:startType="startType"
			:nearbyConfig="nearbyConfig"
			:dropdownConfig="dropdownConfig"
			:selectConfig="selectConfig"
			@locationClick="locationClick"
			@menuClick="menuClick"
			@subMenuClick="subMenuClick"
			@resetClick="resetClick"
			@completeClick="completeClick"
			@dropdownClick="dropdownClick"
		></vc-filter>
	</view>
</template>

<script>
import vcFilter from '@/components/library/base/vc-filter/index';
import {selFilterCategoryById,selBusCodeAndDisCode} from "../api/base-services"
export default {
	name: 'demo-filter',
	props: {
		// 筛选条件
		propsData: {
			type: Object,
			default: () => ({})
		}
	},
	components: {
		vcFilter
	},
	data() {
		return {
			// 筛选框距离顶部距离，单位：rpx， 默认：0，类型：Number/String
			filterTop: 0,

			// 菜单属性配置
			dropdownProps: {
				activeColor: '#00BCB9', // 标题和选项卡选中的颜色 String
				nactiveColor: '#606266' // 标题和选项卡未选中的颜色 String
			},
			// 启用功能 按数组顺序显示
			// 支持:	1. 定位模块 'nearby'，2.选择模块 'dropdown'，3.筛选模块 'select'，4.其他模块 'other'
			// id: 用与区分相同模块多次使用，nearby、nearby不支持
			startType: [
				{
					type: 'nearby'
				},
				{
					type: 'dropdown',
					id: 'M2_1'
				},
				{
					type: 'select'
				},
				// {
				// 	type: 'dropdown',
				// 	id: 'M2_2'
				// },
				{
					type: 'other',
					id: 'M4_1'
				},
				{
					type: 'other',
					id: 'M4_2'
				}
			],

			// 模块配置，未启用无需配置
			// 1.定位模块配置
			nearbyConfig: {
				value: 'M1',
				title: '附近', // 下拉菜单名
				options: {
					// 距离配置
					location: {
						keyName: 'optName', // 从locationList元素对象中读取的键名
						bgColor: '#fff', // 背景颜色
						key: 'location', // 返回参数名
						// 距离选项
						locationList: []
					},
					// 分类菜单配置
					menu: {
						key: 'menu', // 返回参数名
						menuList: [],
						asyncSubMenuList: [] // 用于异步加载子菜单，若menuList下已包含children，无需配置。
					}
				}
			},
			// 2.下拉模块配置
			dropdownConfig: [
				{
					value: 'M2_1',
					key: 'dropdown', // 返回参数名
					id: 'M2_1', // 组件id，用于区分多次使用M2功能
					defaultIndex: 0, // 默认值，options索引，不配置默认0
					title: '级别优先', // 初始化显示内容，防止空白。
					options: []
				}
				// {
				// 	value: 'M2_2',
				// 	key: 'dropdown2', // 返回参数名
				// 	id: 'M2_2', // 组件id，用于区分多次使用M2功能
				// 	// defaultIndex: 0, // 默认值，options索引，不配置默认0
				// 	options: [
				// 		{
				// 			label: '距离优先',
				// 			value: 'B00'
				// 		},
				// 		{
				// 			label: '级别优先',
				// 			value: 'B01'
				// 		}
				// 	]
				// }
			],
			// 3.筛选模块配置
			selectConfig: {
				value: 'M3',
				title: '筛选', // 下拉菜单名
				isSum: true, // 是否启用筛选统计
				offset: [5, 8], // 筛选统计位置偏移，格式为 [x, y]，也即设置的为top和right的值，isSum=true时有效
				bgColor: '#00BCB9', // 筛选统计背景色
				options: {
					// 左侧菜单列表配置
					menu: [],
					// 右侧选项列表配置，menuList顺序与menu需保持一致
					menuList: []
				}
			},
			// 4.其他模块配置
			otherConfig: [
				{
					value: 'M4_1',
					id: 'M4_1',
					title: '套餐类型',
					type: '1', // 多选
					key: 'checkoxM4', // 返回参数名
					options: [
						{
							optName: 'A型套餐',
							optCode: 'AA'
						},
						{
							optName: 'B型套餐',
							optCode: 'BB'
						}
					]
				},
				{
					value: 'M4_2',
					id: 'M4_2',
					title: '使用人群',
					type: '0', // 单选
					key: 'radioM4', // 返回参数名
					options: []
				}
			]
		};
	},
	mounted() {
		// 初始化参数
		// this.info();
		this.getDropdownConfig();
		this.selBusCodeAndDisCode()
	},
	methods: {
		selBusCodeAndDisCode(){
			selBusCodeAndDisCode({
				 id:'130600'
			}).then(res => {
				console.log("selBusCodeAndDisCode", res)
			})
		},
		getDropdownConfig(){
			selFilterCategoryById({id: this.propsData}).then(res => {
				console.log("selFilterCategoryById", res)
			})
		},
		info() {
			// 模拟异步初始化
			setTimeout(() => {
				// M1模块
				let locationList = [
					{
						optCode: '00',
						optName: '附近智能推荐'
					},
					{
						optCode: '500',
						optName: '500m内'
					},
					{
						optCode: '1k',
						optName: '1km内'
					},
					{
						optCode: '3k',
						optName: '3km内'
					},
					{
						optCode: '5k',
						optName: '5km内'
					}
				];
				// 异步初始化赋值
				// 方法：setM1(type,list)
				// type: 模块功能（location：距离，menu：菜单），
				// list: 列表数据
				this.$refs['filterRef'].setM1('location', locationList);

				let menuList = [
					{
						label: '行政区',
						value: '1-1',
						children: [
							//  无value，key值返回空，可以根据返回subMenuIndex索引值判断
							{ label: '全部', value: '0' },
							{ label: '中山区', value: '210202' },
							{ label: '西岗区', value: '210203' },
							{ label: '沙河口区', value: '210204' },
							{ label: '甘井子区', value: '210211' },
							{ label: '旅顺口区', value: '210212' },
							{ label: '金州区', value: '210213' },
							{ label: '长海县', value: '210224' },
							{ label: '瓦房店市', value: '210281' },
							{ label: '普兰店市', value: '210282' },
							{ label: '庄河市', value: '210283' }
						]
					},
					{
						label: '商圈',
						value: '1-2'
						// 如需异步加载子列表，无需配置children，可通过menuClick事件给asyncSubMenuList【Array】赋值。
					}
				];
				// 异步初始化赋值
				this.$refs['filterRef'].setM1('menu', menuList);

				// M2模块
				let dropdownList = [
					{
						label: '距离优先',
						value: 'A00'
					},
					{
						label: '级别优先',
						value: 'A01'
					}
				];
				// setM2(索引,数组)   索引:对应dropdownConfig索引
				this.$refs['filterRef'].setM2(0, dropdownList);

				// M3
				let menuListM3 = [
					{
						label: '医院级别', // 左侧菜单名
						value: '3-1' // 用于定位
					},
					{
						label: '医院性质',
						value: '3-2'
					},
					{
						label: '医院类型',
						value: '3-3'
					}
				];
				this.$refs['filterRef'].setM3('menu', menuListM3);
				let selectList = [
					{
						type: '0', // 单选
						title: '医院级别', // 右侧菜单名
						key: 'hospitalLevel', // 返回参数名
						list: [
							{
								optCode: '0',
								optName: '三甲'
							},
							{
								optCode: '1',
								optName: '三级'
							},
							{
								optCode: '2',
								optName: '二级'
							},
							{
								optCode: '3',
								optName: '一级'
							},
							{
								optCode: '4',
								optName: '社区卫生中心'
							},
							{
								optCode: '5',
								optName: '其他'
							},

							{
								optCode: '10',
								optName: '三甲'
							},
							{
								optCode: '11',
								optName: '三级'
							},
							{
								optCode: '12',
								optName: '二级'
							},
							{
								optCode: '13',
								optName: '一级'
							},
							{
								optCode: '14',
								optName: '社区卫生中心'
							},
							{
								optCode: '15',
								optName: '其他'
							},

							{
								optCode: '20',
								optName: '三甲'
							},
							{
								optCode: '21',
								optName: '三级'
							},
							{
								optCode: '22',
								optName: '二级'
							},
							{
								optCode: '23',
								optName: '一级'
							},
							{
								optCode: '24',
								optName: '社区卫生中心'
							},
							{
								optCode: '25',
								optName: '其他'
							}
						]
					},
					{
						type: '0', // 单选
						title: '医院性质',
						key: 'hospitalNature',
						list: [
							{
								optCode: '0',
								optName: '公立'
							},
							{
								optCode: '1',
								optName: '私立'
							}
						]
					},
					{
						type: '1', // 单选
						title: '医院类型',
						key: 'hospitalType',
						list: [
							{
								optCode: '0',
								optName: '综合医院'
							},
							{
								optCode: '1',
								optName: '眼科医院'
							},
							{
								optCode: '2',
								optName: '儿童医院'
							},
							{
								optCode: '3',
								optName: '妇产科医院'
							},
							{
								optCode: '4',
								optName: '肿瘤医院'
							},
							{
								optCode: '5',
								optName: '耳鼻喉科医院'
							},

							{
								optCode: '10',
								optName: '综合医院'
							},
							{
								optCode: '11',
								optName: '眼科医院'
							},
							{
								optCode: '12',
								optName: '儿童医院'
							},
							{
								optCode: '13',
								optName: '妇产科医院'
							},
							{
								optCode: '14',
								optName: '肿瘤医院'
							},
							{
								optCode: '15',
								optName: '耳鼻喉科医院'
							},
							{
								optCode: '20',
								optName: '综合医院'
							},
							{
								optCode: '21',
								optName: '眼科医院'
							},
							{
								optCode: '22',
								optName: '儿童医院'
							},
							{
								optCode: '23',
								optName: '妇产科医院'
							},
							{
								optCode: '24',
								optName: '肿瘤医院'
							},
							{
								optCode: '25',
								optName: '耳鼻喉科医院'
							}
						]
					}
				];
				this.$refs['filterRef'].setM3('select', selectList);

				// M4
				// let otherList = [
				// 	{
				// 		optName: '通用',
				// 		optCode: 'ALL'
				// 	},
				// 	{
				// 		optName: '女未婚',
				// 		optCode: 'O01'
				// 	},
				// 	{
				// 		optName: '女已婚',
				// 		optCode: 'O02'
				// 	},
				// 	{
				// 		optName: '男性',
				// 		optCode: 'O03'
				// 	},
				// 	{
				// 		optName: '综合医院',
				// 		optCode: 'O04'
				// 	},
				// 	{
				// 		optName: '眼科医院',
				// 		optCode: 'O05'
				// 	},
				// 	{
				// 		optName: '儿童医院',
				// 		optCode: 'O06'
				// 	}
				// ];
				// setM2(索引,数组)   索引:对应otherConfig索引
				// this.$refs['filterRef'].setM4(1, otherList);
			}, 2000);
		},
		// 附近：点击距离事件
		locationClick(e) {
			console.log(e);
		},
		// 滚动菜单：左侧菜单点击事件
		menuClick(e) {
			console.log(e);
			console.log(JSON.stringify(e));
			// 异步加载子列表示例。
			if (e.value == '1-2') {
				// 模拟接口调用
				setTimeout(() => {
					let list = [
						{ label: '全部', value: 'all' },
						{ label: '友谊商城', value: '1' }
					];
					this.$refs['filterRef'].asyncSubMenuList(list);
				}, 1000);
			}
		},
		// 滚动菜单：右侧点击事件
		subMenuClick(e) {
			console.log(e);
		},
		// 滚动菜单：重置按钮事件
		resetClick(e) {
			console.log(e);
		},
		// 滚动菜单：确认按钮事件
		completeClick(e) {
			console.log(e); // 参数说明: 根据定义key值返回
		},
		// 级别优先：下拉选项点击事件
		dropdownClick(e) {
			console.log(e);
		}
	}
};
</script>

<style>
	.filterCom {
		position: sticky;
		top: 0;
		height: 80rpx;
	}
</style>
