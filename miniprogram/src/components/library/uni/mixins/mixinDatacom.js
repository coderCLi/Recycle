// 这里是官方uniCloud.mixinDatacom源码，可以屏蔽掉一些uniCloud的相关方法，这里咱不修改
// https://zh.uniapp.dcloud.io/component/datacom.html
export default {
	props: {
		localdata: {
			type: Array,
			default () {
				return []
			}
		},
		options: {
			type: [Object, Array],
			default () {
				return {}
			}
		},
		collection: {
			type: String,
			default: ''
		},
		action: {
			type: String,
			default: ''
		},
		field: {
			type: String,
			default: ''
		},
		orderby: {
			type: String,
			default: ''
		},
		where: {
			type: [String, Object],
			default: ''
		},
		pageData: {
			type: String,
			default: 'add'
		},
		pageCurrent: {
			type: Number,
			default: 1
		},
		pageSize: {
			type: Number,
			default: 20
		},
		getcount: {
			type: [Boolean, String],
			default: false
		},
		gettree: {
			type: [Boolean, String],
			default: false
		},
		gettreepath: {
		  type: [Boolean, String],
		  default: false
		},
		startwith: {
		  type: String,
		  default: ''
		},
		limitlevel: {
		  type: Number,
		  default: 10
		},
		groupby: {
		  type: String,
		  default: ''
		},
		groupField: {
		  type: String,
		  default: ''
		},
		distinct: {
		  type: [Boolean, String],
		  default: false
		},
		manual: {
		  type: Boolean,
		  default: false
		}
	},
	data() {
		return {
			mixinDatacomLoading: false, // 网络请求状态
			mixinDatacomHasMore: false, // 是否有更多数据
			mixinDatacomResData: [], // 请求返回的数据，调用 loadData 后会更新
			mixinDatacomErrorMessage: '', // 请求出错时的错误消息
			mixinDatacomPage: {} // 分页信息，详情见 created 生命周期
		}
	},
	created() {
		this.mixinDatacomPage = {
			current: this.pageCurrent, // 当前页面，初始化设置 props中的 pageCurrent
			size: this.pageSize, // 页面大小，初始化设置 props中的 pageSize
			count: 0, // 数据总数，getcount=true时有效
		}
		this.$watch(() => {
			var al = [];
			['pageCurrent',
				'pageSize',
				'localdata',
				'collection',
				'action',
				'field',
				'orderby',
				'where',
				'getont',
				'getcount',
				'gettree'
			].forEach(key => {
				al.push(this[key])
			})
			return al
		}, (newValue, oldValue) => {
			let needReset = false
			let changed = []
			for (let i = 2; i < newValue.length; i++) {
				if (newValue[i] !== oldValue[i]) {
					needReset = true
					changed.push(newValue[i])
				}
			}
			if (newValue[0] !== oldValue[0]) {
				this.mixinDatacomPage.current = this.pageCurrent
			}
			this.mixinDatacomPage.size = this.pageSize

			this.onMixinDatacomPropsChange(needReset, changed)
		})
	},
	methods: {
		// props发生变化时被调用，在组件中覆盖此方法
		// 非 pageCurrent，pageSize 改变时 needReset=true,需要重置数据
		// changed，发生变化的属性名，类型为Array，例如 ['collection', 'action']
		onMixinDatacomPropsChange(needReset, changed) {},
		// 加载数据
		mixinDatacomEasyGet({
			getone = false,
			success,
			fail
		} = {}) {
			if (this.mixinDatacomLoading) {
				return
			}
			this.mixinDatacomLoading = true

			this.mixinDatacomErrorMessage = ''

			this.mixinDatacomGet().then((res) => {
				this.mixinDatacomLoading = false
				const {
					data,
					count
				} = res.result
				if (this.getcount) {
					this.mixinDatacomPage.count = count
				}
				this.mixinDatacomHasMore = data.length < this.pageSize
				const responseData = getone ? (data.length ? data[0] : undefined) : data
				this.mixinDatacomResData = responseData

				if (success) {
					success(responseData)
				}
			}).catch((err) => {
				this.mixinDatacomLoading = false
				this.mixinDatacomErrorMessage = err
				fail && fail(err)
			})
		},
		// 调用 uniClientDB 查询数据
		mixinDatacomGet(options = {}) {
            return [];
            
			// let db = uniCloud.database()

			// const action = options.action || this.action
			// if (action) {
			// 	db = db.action(action)
			// }

			// const collection = options.collection || this.collection
			// db = db.collection(collection)

			// const where = options.where || this.where
			// if (!(!where || !Object.keys(where).length)) {
			// 	db = db.where(where)
			// }

			// const field = options.field || this.field
			// if (field) {
			// 	db = db.field(field)
			// }

			// const groupby = options.groupby || this.groupby
			// if (groupby) {
			// 	db = db.groupBy(groupby)
			// }

			// const groupField = options.groupField || this.groupField
			// if (groupField) {
			// 	db = db.groupField(groupField)
			// }

			// const distinct = options.distinct !== undefined ? options.distinct : this.distinct
			// if (distinct === true) {
			// 	db = db.distinct()
			// }

			// const orderby = options.orderby || this.orderby
			// if (orderby) {
			// 	db = db.orderBy(orderby)
			// }

			// const current = options.pageCurrent !== undefined ? options.pageCurrent : this.mixinDatacomPage.current
			// const size = options.pageSize !== undefined ? options.pageSize : this.mixinDatacomPage.size
			// const getCount = options.getcount !== undefined ? options.getcount : this.getcount
			// const gettree = options.gettree !== undefined ? options.gettree : this.gettree
			// const gettreepath = options.gettreepath !== undefined ? options.gettreepath : this.gettreepath
			// const limitLevel = options.limitlevel !== undefined ? options.limitlevel : this.limitlevel
			// const startWith = options.startwith !== undefined ? options.startwith : this.startwith

			// const getOptions = {
			// 	getCount
			// }
			// const treeOptions = {
			// 	limitLevel,
			// 	startWith
			// }
			// if (gettree) {
			// 	getOptions.getTree = treeOptions
			// }
			// if (gettreepath) {
			// 	getOptions.getTreePath = treeOptions
			// }

			// db = db.skip(size * (current - 1)).limit(size).get(getOptions)

			// return db
		}
	}
}
