/*
 * @Description: 组件公用的mixins
 * @Author: chenyulong
 * @Date: 2023-07-22 00:13:26
 * @LastEditors: chenyulong
 * @LastEditTime: 2024-12-17 12:17:32
 * @Remark: 
 */
export default {
    data() {
        return {
            
        }
    },
    props: {
        // 该属性必须与component动态组件上的props定义一致（驼峰写法props-data）才能在组件内接受到属性值
        propsData: {
            type: Object,
            default: ()=>{}
        },
    },
    computed: {
        // 为了解决 watch监听新旧值都一样的问题 2024.12.06
        newPropsData() {
            if (this.propsData) {
                return JSON.parse(JSON.stringify(this.propsData));
            } 
            return this.propsData;
        }
    },
    watch: {
        newPropsData: {
            handler(newVal, oldVal) {
                this.updateComponentData(newVal, oldVal);
            },
            deep: true,
        }
    },
    async mounted() {
        this.propsData && this.updateDataProps(this.propsData.props);
    },
    methods: {
        // 更新页面数据
        updateComponentData(newVal, oldVal){
            // console.log('propsData changed: ', JSON.stringify(newVal, null, 2));
            const isChanged = JSON.stringify(newVal) !== JSON.stringify(oldVal);
            // console.log("propsData isChanged: ", isChanged);
            // JSON.stringify(newVal, null, 2)
            // newVal.name === "vc-album" && console.log(JSON.stringify(newVal, null, 2));
            if(!isChanged){
                // console.log("propsData is not changed, do nothing");
                return;
            }
            this.updateDataProps(newVal.props, oldVal.props);
        },
        updateDataProps(newProps, oldProps){
            // console.log("updateDataProps: ", newProps, oldProps);
            // 旧数据不存在时，需要使用默认的props数据
            if(!oldProps) {
                oldProps = {};
                // 根据newPros的key，初始化组件的属性
                Object.keys(newProps).forEach(key => {
                    // console.log(`初始化propsData.${key}数据：`, this[key]);
                    oldProps[key] = this[key];
                });
                // console.log("初始化oldProps数据：", oldProps);
            }
            // console.log("oldProps: ", oldProps);
            // 遍历组件的属性
            Object.keys(oldProps).forEach(key => {
                const _nvl = newProps[key]?.value;
                const _ovl = oldProps[key]?.value;
                // 判断是否有变化，仅当有变化时才更新值
                if(newProps[key] && oldProps[key] && _nvl !== _ovl) {
                    // console.log(`propsData.${key} changed ===> newValue: ${_nvl}, oldValue: ${_ovl}`);
                    // 属性值变化的组件更新值
                    this[key] && (this[key].value = newProps[key].value);
                    // console.log(`变化的属性：${key}: `, this[key]);
                }
            });
        }
    }
}