<!--
 * @Description: 添加收货地址表单
-->
<template>
    <vc-modal ref="modal"></vc-modal>
    <vc-container>
        <view style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;">
            <view class="top-bg2" style="background-color: #fff;"></view>
        </view>
        <view class="main">
            <!-- <vc-status-bar />
        <vc-navbar :props-data="propsData" /> -->
            <view class="from">
                <up-form labelPosition="left" :model="model1" labelWidth="200rpx">
                    <up-form-item label="收货人：" borderBottom>
                        <up-input v-model="model1.name" placeholder="请填写收货人姓名" border="none"></up-input>
                    </up-form-item>
                    <up-form-item label="手机号码：" borderBottom>
                        <up-input v-model="model1.mobile" placeholder="请填写收货人手机号" border="none" @blur="checkMobile" maxlength="11"></up-input>
                    </up-form-item>
                    <up-form-item label="所属地区：" borderBottom >
                        <jia-cascader
                            ref="jiaCascader"
                            style="width: 100%"
                            :itemList="itemList"
                            :request="true"
                            :receiveData="receiveData"
                            :lineColor="'#00BCB8'"
                            :activeColor="'#555'"
                            @completeChange="completeChange"
                            @inputChange="inputChange"
                        ></jia-cascader>
                        <!-- <up-input v-model="model1.areaName" placeholder="省市区、乡镇等" border="none" :disabled="true" style="background-color: #fff;"></up-input>
                        <template #right>
                            <up-icon name="arrow-right"></up-icon>
                        </template> -->
                    </up-form-item>
                    <up-form-item label="详细地址：" borderBottom>
                        <up-input v-model="model1.address" placeholder="街道、楼牌号等" border="none"></up-input>
                    </up-form-item>
                    <up-form-item label="设为默认地址" labelWidth="200px">
                        <template #right>
                            <up-switch v-model="value" activeColor="#00BCB8"></up-switch>
                        </template>
                    </up-form-item>
                </up-form>
                <up-picker :show="show" ref="uPickerRef" :columns="columns" @confirm="confirm" @change="changeHandler"
                    @cancel="show = false">
                </up-picker>
            </view>
            <view class="button" @click="addAddress">
                保存并使用
            </view>
            <view style="flex-shrink: 0">
                <vc-safe-bottom />
            </view>
        </view>
    </vc-container>
</template>
<script>
import { getLinkAgeCity, addDeliveryAddress } from '../api/index'
import jiaCascader from '../components/jia-cascader'
export default {
    name: "addAddress",
    components:{jiaCascader},
    data() {
        return {
            propsData: {
                props: {
                    title: {
                        value: '添加收货地址',
                    },
                }
            },
            model1: {},
            value: false,
            receiveData: [],
            itemList:[],
            show: false, // 控制 picker 显示/隐藏
            columns: [
                [],                    // 省
                [],           // 市
                []    // 区
            ],
            provinceList: [],//省
            province: '',
            cityList: [],//市
            city: '',
            areaList: [],//区
            area: '',
        }
    },
    async onLoad(options) {
        // await this.firstInit();
        // this.options = options;
        if (!this.bridgeSdk.isTokenValid()) {
            this.bridgeSdk.beans.setTokenGetCallback(this.__loadData__);
            return;
        }
        this.__loadData__();
    },
    computed: {
    },
    methods: {
        __loadData__() {
            this.getLinkAgeCity('root', 'province');
            this.getLinkAge('root').then(res =>{
                this.itemList = res
            })
        },
        completeChange(e){
            console.log('completeChange',e);
          this.province = e.result[0]['cityNo']
          this.city = e.result[1]['cityNo']
          this.area = e.result[2]['cityNo']
          this.model1.areaName = e.cityName
        },
        inputChange(e){
            this.getLinkAge(e.cityNo).then(res =>{
                this.receiveData = res
            })
        },
        async getLinkAge (cityNo, index) {
            let res = await getLinkAgeCity({ parentNo: cityNo })
            return res
        },
        checkMobile(val) {
            console.log('hhhhhhh',val);
            if (!this.reg.checkPhone(val)) {
                uni.showToast({
                    title: "请输入正确的手机号码",
                    icon: "none",
                });
                return;
            }
        },
        chooseAddress() {
            this.show = true;
            uni.hideKeyboard()
        },

        getLinkAgeCity(parentNo = 'root', type = 'province', data = '0') {
            console.log('获取省市区数据', parentNo, type, data);
            // 获取省市区数据
            getLinkAgeCity({ parentNo }).then(res => {
                console.log('获取数据:', res);

                if (type === 'province') {
                    this.provinceList = res;  // 更新省的数据
                    this.columns[0] = res.map(item => item.cityName);  // 更新省列

                    // 获取第一个省的数据后，自动加载市
                    if (res.length > 0) {
                        this.province = res[data]?.cityNo; // 默认选中第一个省
                     //   this.getLinkAgeCity(this.province, 'city'); // 获取市数据    不需要一开始查询第一个城市
                    }

                    this.cityList = [];  // 清空市数据
                    this.areaList = [];  // 清空区数据
                    this.columns[1] = []; // 清空市列
                    this.columns[2] = []; // 清空区列

                } else if (type === 'city') {
                    this.cityList = res;  // 更新市的数据
                    this.columns[1] = res.map(item => item.cityName);  // 更新市列

                    // 获取第一个市的数据后，自动加载区
                    if (res.length > 0) {
                        this.city = res[data]?.cityNo; // 默认选中第一个市
                        this.getLinkAgeCity(this.city, 'area'); // 获取区数据
                    }

                    this.areaList = [];  // 清空区数据
                    this.columns[2] = []; // 清空区列

                } else if (type === 'area') {
                    this.areaList = res;  // 更新区的数据
                    this.area = res[data]?.cityNo;
                    this.columns[2] = res.map(item => item.cityName);  // 更新区列
                }

                // 设置默认选中的值
                if (data) {
                    this[data] = res[0]?.cityNo || ''; // 默认选中第一个
                }
            });
        },

        // 处理 picker 列变化
        changeHandler(e) {
            console.log('hhhhhhhhhhhlllllll',e);
            
            const { columnIndex, value } = e;
            if (columnIndex === 0) {
                // 省发生变化
                const selectedProvince = this.provinceList.find(item => item.cityName === value[0]);
                this.province = selectedProvince?.cityNo || ''; // 记录选中的省的 cityNo
                this.cityList = [];  // 清空市数据
                this.areaList = [];  // 清空区数据
                this.columns[1] = []; // 清空市列
                this.columns[2] = []; // 清空区列
                // this.getLinkAgeCity(this.province, 'city', e.indexs[0]); // 获取市数据
                this.getLinkAgeCity(this.province, 'city', 0); // 获取市数据
            } else if (columnIndex === 1) {
                // 市发生变化
                const selectedCity = this.cityList.find(item => item.cityName === value[1]);
                this.city = selectedCity?.cityNo || ''; // 记录选中的市的 cityNo
                this.areaList = [];  // 清空区数据
                this.columns[2] = []; // 清空区列
                // this.getLinkAgeCity(this.city, 'area', e.indexs[1]); // 获取区数据
                this.getLinkAgeCity(this.city, 'area', 0); // 获取区数据
            } else if (columnIndex === 2) {
                // 区发生变化
                const selectedArea = this.areaList.find(item => item.cityName === value[2]);
                this.area = selectedArea?.cityNo || ''; // 记录选中的区的 cityNo
            }
        },

        // 选择确认时的回调
        confirm(e) {
            console.log('选中的数据：', e, this.province, this.city, this.area);
            this.show = false; // 关闭 picker
            this.model1.areaName = e.value.join('');
        },
        addAddress() {
            console.log(this.model1);
            
            if (!this.model1.name || this.model1.name == "") {
                uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
                return
            }
            if (!this.model1.mobile || this.model1.mobile == "") {
                uni.showToast({ title: '请输入收货人电话', icon: 'none' })
                return
            }
            if (!this.model1.areaName || this.model1.areaName == "") {
                uni.showToast({ title: '请选择所属地区', icon: 'none' })
                return
            }
            if (!this.model1.address || this.model1.address == "") {
                uni.showToast({ title: '请输入详细地址', icon: 'none' })
                return
            }
            if (!this.reg.checkPhone(this.model1.mobile)) {
                uni.showToast({
                    title: "请输入正确的手机号码",
                    icon: "none",
                });
                return;
            }
            const params = {
                name: this.model1.name,
                mobile: this.model1.mobile,
                province: this.province,
                city: this.city,
                area: this.area,
                address: this.model1.address,
                isDefault: this.value ? '1' : '0'
            }
            addDeliveryAddress(params).then(res => {
                uni.showToast({ title: '保存成功', icon: 'success' })
                console.log(res,'保存地址');
				uni.$emit('updateData', {...res,...params})
                this.bridgeSdk.navigateBackTo({
                    delta: 1
                });
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    background-color: #fff;
    // height: 100vh;
}

.from {
    margin: 0 40rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 28rpx;
    color: #222222;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
}

.button {
    margin: auto;
    position: fixed;
    left: 4%;
    top: 720rpx;
    width: 92%;
    height: 84rpx;
    background: linear-gradient(90deg, #90BEF4 0%, #5BA4F3 100%), #FF5871;
    border-radius: 42rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 32rpx;
    color: #FFFFFF;
    line-height: 84rpx;
    text-align: center;
    font-style: normal;
}
.main ::v-deep .uni-data-tree {
    .selected-item {
        font-size: 15px;
    }
    .selected-area.placeholder {
        font-size: 15px;
        color: rgb(192, 196, 204);
    }
}

</style>