<!--
 * @Description: 开通支付表单
 * @Author: 陈保磊
 * @Date: 2024-12-17 20:46:52
-->
<template>
  <!-- <vc-status-bar />
  <vc-navbar :props-data="propsData" /> -->
  <vc-container :props-data="propsData">
    <vc-login v-if="!isLogined" />
    <view v-else class="commercial">
      <view style="width: 100%; height: 230rpx; margin-bottom: 20rpx">
        <image
          style="width: 100%; height: 100%"
          :src="this.staticBaseUrl + '/minio/common/mctImages/banner.jpg'"
          mode="'scaleToFill'"
        />
      </view>
      <up-form
        labelPosition="left"
        :model="commercialForm"
        label-width="140px"
        :rules="commercialFormRule"
        ref="commercialForm"
        :labelStyle="{ fontSize: '30rpx', fontWeight: 'bold' }"
      >
        <up-form-item label="商户全称" prop="name" class="form_input" required>
          <up-input
            style="height: 40rpx"
            border="none"
            placeholder="请输入营业执照名称"
            :disabled="isdisabled"
            v-model="commercialForm.name"
            maxlength="50"
          >
          </up-input>
        </up-form-item>
        <up-form-item
          label="商户简称"
          prop="shortName"
          class="form_input"
          required
        >
          <up-input
            style="height: 40rpx"
            :disabled="isdisabled"
            placeholder="请输入商户简称"
            border="none"
            v-model="commercialForm.shortName"
            maxlength="50"
          ></up-input>
        </up-form-item>
        <up-form-item
          label="商户类型"
          prop="mctType"
          required
          class="form_input"
        >
          <data-select
            style="height: 40rpx"
            v-model="commercialForm.mctType"
            :localdata="mctTypeRange"
            :disabled="isdisabled"
            placeholder="请选择商户类型"
            @change="changeMctType"
          ></data-select>
        </up-form-item>

        <up-form-item
          label="行业类目"
          prop="categoryParentId"
          required
          class="form_input"
        >
          <view class="" style="width: 100%" @click="openCategory">
            <text
              v-if="!commercialForm.categoryName"
              style="
                color: rgb(192, 196, 204);
                height: 40rpx;
                line-height: 40rpx;
                font-size: 30rpx;
              "
              >请选择行业类目</text>
            {{ commercialForm.categoryName }}
          </view>
        </up-form-item>
        <up-form-item label="电话" prop="phone" class="form_input" required>
          <up-input
            style="height: 40rpx"
            placeholder="请输入电话"
            type="number"
            maxlength="11"
            :disabled="isdisabled"
            border="none"
            v-model="commercialForm.phone"
          >
          </up-input>
        </up-form-item>
        <up-form-item label="地址" prop="Provinces" class="form_input" required>
          <jia-cascader
            ref="jiaCascader"
            style="width: 100%"
            :itemList="itemList"
            :request="true"
            :readonly="isdisabled"
            :receiveData="receiveData"
            :lineColor="'#00BCB8'"
            :activeColor="'#555'"
            :defaultItemList="defaultItemList"
            @completeChange="completeChange"
            @inputChange="inputChange"
          ></jia-cascader>
        </up-form-item>
        <up-form-item
          label="详细地址"
          prop="address"
          class="form_input"
          required
        >
          <up-input
            style="height: 40rpx"
            :disabled="isdisabled"
            placeholder="请输入详细地址"
            border="none"
            v-model="commercialForm.address"
          >
          </up-input>
        </up-form-item>
        <up-form-item
          label="商务合作联系人姓名"
          prop="contacts"
          class="form_input"
          required
        >
          <up-input
            style="height: 40rpx"
            placeholder="请输入商务合作联系人姓名"
            :disabled="isdisabled"
            border="none"
            v-model="commercialForm.contacts"
            maxlength="10"
          ></up-input>
        </up-form-item>
        <!-- <up-form-item
          label="商务合作联系人电话"
          prop="contactsPhone"
          class="form_input"
          required
        >
          <up-input
            style="height: 40rpx"
            :disabled="isdisabled"
            type="number"
            maxlength="11"
            placeholder="请输入商务合作联系人电话"
            border="none"
            v-model="commercialForm.contactsPhone"></up-input>
        </up-form-item> -->
        <up-form-item
          label="负责人证件类型"
          prop="contactsCertType"
          class="form_input"
          required>
          <data-select
            v-model="commercialForm.contactsCertType"
            :localdata="contactsCertTypeRange"
            :disabled="isdisabled"
            style="height: 40rpx"
            @change="dataSelectChange"
            placeholder="请选择负责人证件类型"
          ></data-select>
        </up-form-item>
        <up-form-item
          label="证件号"
          prop="contactsCertNo"
          class="form_input"
          required>
          <up-input
            style="height: 40rpx"
            placeholder="请输入负责人证件号"
            :disabled="isdisabled"
            maxlength="18"
            border="none"
            v-model="commercialForm.contactsCertNo"></up-input>
        </up-form-item>
        <up-form-item
          label="推荐码"
          prop="referralCode"
          class="form_input">
          <up-input
            style="height: 40rpx"
            placeholder="请输入推荐码"
            :disabled="isdisabled"
            maxlength="18"
            border="none"
            v-model="commercialForm.referralCode"></up-input>
        </up-form-item>

        <!-- <up-form-item label="备注" prop="remark" labelPosition="top">
          <up-textarea
            v-model="commercialForm.remark"
            placeholder="请输入备注"
            border="none"
            :disabled="isdisabled"
            count
          ></up-textarea>
        </up-form-item> -->
        <up-form-item
          label="负责人证件正面"
          labelPosition="top"
          required
          labelWidth="auto"
          prop="contactsCertFaceUrl"
          class="form_input_updata"
        >
          <vc-upLoad
            @complete="
              upComplete($event, 'contactsCertFaceUrl', 'ContactsCertFaceUrl')
            "
            @delete="deleteImg($event, 'contactsCertFaceUrl', 'ContactsCertFaceUrl')"
            :props-data="{
              props: {
                ...uploadData.props,
                maxSize: {
                  value: 4 * 1024 * 1024,
                },
                maxCount: {
                  value: 1,
                },
                disabled: {
                  value: isdisabled,
                },
                fileList: {
                  value: fileListContactsCertFaceUrl,
                },
                deletable: {
                  value: !isdisabled,
                },
              },
            }"
          >
            <image
              src="../static/uploadImg.png"
              style="width: 160rpx; height: 160rpx"
            >
            </image>
          </vc-upLoad>
          <view style="margin-top: 10rpx; color: #999; font-size: 24rpx">
            最大上传4M图片
          </view>
        </up-form-item>
        <up-form-item
          label="负责人证件反面"
          labelPosition="top"
          required
          labelWidth="auto"
          class="form_input_updata"
          prop="contactsCertBackUrl"
        >
          <vc-upLoad
            @complete="
              upComplete($event, 'contactsCertBackUrl', 'ContactsCertBackUrl')
            "
            @delete="deleteImg($event, 'contactsCertBackUrl', 'ContactsCertBackUrl')"
            :props-data="{
              props: {
                ...uploadData.props,
                maxSize: {
                  value: 4 * 1024 * 1024,
                },
                maxCount: {
                  value: 1,
                },
                accept: {
                  value: 'image',
                },
                disabled: {
                  value: isdisabled,
                },
                fileList: {
                  value: fileListContactsCertBackUrl,
                },
                deletable: {
                  value: !isdisabled,
                },
              },
            }"
          >
            <image
              src="../static/uploadImg.png"
              style="width: 160rpx; height: 160rpx">
            </image>
          </vc-upLoad>
          <view style="margin-top: 10rpx; color: #999; font-size: 24rpx">最大上传4M图片</view>
        </up-form-item>
        <up-form-item
          label="门头照图片"
          labelPosition="top"
          required
          labelWidth="auto"
          class="form_input_updata"
          prop="shopUrl"
        >
          <vc-upLoad
            @complete="upComplete($event, 'shopUrl', 'ShopUrl')"
            @delete="deleteImg($event, 'shopUrl', 'ShopUrl')"
            :props-data="{
              props: {
                ...uploadData.props,
                maxSize: {
                  value: 4 * 1024 * 1024,
                },
                maxCount: {
                  value: 1,
                },
                disabled: {
                  value: isdisabled,
                },
                fileList: {
                  value: fileListShopUrl,
                },
                deletable: {
                  value: !isdisabled,
                },
              },
            }"
          >
            <image
              src="../static/uploadImg.png"
              style="width: 160rpx; height: 160rpx"
            >
            </image>
          </vc-upLoad>
          <view style="margin-top: 10rpx; color: #999; font-size: 24rpx">最大上传4M图片</view>
        </up-form-item>
        <up-form-item
          label="商户logo"
          labelPosition="top"
          labelWidth="auto"
          class="form_input_updata"
        >
          <vc-upLoad
            @complete="upComplete($event, 'mctLogoUrl', 'MctLogoUrl')"
            @delete="deleteImg($event, 'mctLogoUrl', 'MctLogoUrl')"
            :props-data="{
              props: {
                ...uploadData.props,
                maxSize: {
                  value: 4 * 1024 * 1024,
                },
                maxCount: {
                  value: 1,
                },
                accept: {
                  value: 'image',
                },
                disabled: {
                  value: isdisabled,
                },
                fileList: {
                  value: fileListMctLogoUrl,
                },
                deletable: {
                  value: !isdisabled,
                },
              },
            }"
          >
            <image
              src="../static/uploadImg.png"
              style="width: 160rpx; height: 160rpx"
            >
            </image>
          </vc-upLoad>
          <view style="margin-top: 10rpx; color: #999; font-size: 24rpx">最大上传4M图片</view>
        </up-form-item>

        <!-- 协议说明（2025-07-25 新增） -->
        <view class="agreement">
            <view class="agreement-block" @click="goAgreement">
              <up-checkbox
                  size="14"
                  name="agree"
                  shape="circle"
                  usedAlone
                  activeColor="#438AFB"
                  :disabeld="isdisabled"
                  v-model:checked="isAgree" 
                  style="cursor: none;pointer-events: none;">
              </up-checkbox>
              <view>我已阅读并同意<text style="color: #438AFB;">《商户入驻协议》</text></view>
            </view>
        </view>

        <up-button
          v-if="!isdisabled"
          type="primary"
          :disabled="isdisabled"
          @click="submitForm"
          class="form_btn"
          >提交
        </up-button>
      </up-form>
      

      <up-picker
        :show="pickerShow"
        ref="uPickerRef"
        :keyName="keyName"
        :columns="columns"
        @confirm="confirm"
        :defaultIndex="[0, 0]"
        @change="changeHandler"
        @cancel="cancel"
      ></up-picker>
    </view>
    <vc-modal ref="modal" />
  </vc-container>
</template>

<script>
import {
  mctInfoApply,
  uploadFile,
  getLinkAgeCity,
  getDataDicList,
  getBusinessCateGoryList,
  getMctInfo,
} from '../api'
import vcUpLoad from '@/components/library/base/vc-upload/index.vue'
import { getEvnBaseUrl } from '@/utils/index'
import { toast } from '@/uni_modules/uview-plus'
import { mapState } from 'pinia'
import { useBaseStore, useUserStore, useMctStore } from "@/store/index"
import jiaCascader from '../components/jia-cascader'
import dataSelect from '@/components/library/uni/data-select/data-select.vue'
export default {
  components: { vcUpLoad, dataSelect, jiaCascader },
  data () {
    return {
      defaultItemList: [],
      itemList: [],
      receiveData: [],
      isdisabled: false,
      userInfo: {},
      pickerShow: false,
      keyName: '',
      fileListMctLogoUrl: [],
      fileListContactsCertBackUrl: [],
      fileListContactsCertFaceUrl: [],
      fileListShopUrl: [],
      propsData: {
        props: {
          title: {
            value: '商户入驻',
          },
          // fixed: {
          //   value: true
          // },
        },
      },
      uploadData: {
        props: {
          //是否开启预览
          previewFullImage: {
            value: false,
          },
        },
      },
      mctTypeRange: [],
      contactsCertTypeRange: [],
      items: [],
      areaList: [],
      columns: [],
      commercialForm: {
        name: '',
        remark: '',
        contactsCertType: '',
        businessLicenseFile: [],
      },
      commercialFormRule: {
        name: [
          {
            type: 'string',
            required: true,
            message: '请输入营业执照名称',
            trigger: ['blur', 'change'],
          },
        ],
        shortName: [
          {
            type: 'string',
            required: true,
            message: '请填写商户简称',
            trigger: ['blur', 'change'],
          },
        ],
        contacts: [
          {
            message: '请输入商务合作联系人姓名',
            required: true,
            trigger: ['blur', 'change'],
          },
          {
            message: '请输入正确的商务合作联系人姓名',
            validator: (rul, value, back) => {
              return this.reg.checkHz(value)
            },
            trigger: ['blur', 'change'],
          },
        ],
        // contactsPhone: [
        //   {
        //     message: '请输入商务合作联系人电话',
        //     required: true,
        //     trigger: ['blur', 'change'],
        //   },
        //   {
        //     message: '请输入正确的商务合作联系人电话',
        //     validator: (rul, value, back) => {
        //       return this.reg.checkPhone(value)
        //     },
        //     trigger: ['blur', 'change'],
        //   },
        // ],
        contactsCertType: [
          {
            type: 'string',
            required: true,
            message: '请选择负责人证件类型',
            trigger: 'change'
          },
        ],
        contactsCertNo: [
          {
            type: 'string',
            required: true,
            message: '请输入证件号',
            trigger: ['blur', 'change']
          }
        ],

        
        mctType: [
          {
            type: 'string',
            required: true,
            message: '请选择商户类型',
            trigger: ['blur', 'change'],
          },
        ],
        categoryParentId: [
          {
            type: 'string',
            required: true,
            message: '请选择行业类目',
            trigger: ['blur', 'change'],
          },
        ],
        phone: [
          {
            message: '请输入电话号码',
            required: true,
            trigger: ['blur'],
          },
          {
            message: '请输入正确的电话号码',
            validator: (rul, value, back) => {
              return this.reg.checkPhone(value)
            },
            trigger: ['blur'],
          },
        ],
        Provinces: [
          {
            type: 'string',
            required: true,
            message: '请选择地址',
            trigger: ['blur', 'change'],
          },
        ],
        address: [
          {
            type: 'string',
            required: true,
            message: '请输入详细地址',
            trigger: ['blur', 'change'],
          },
        ],
        mctLogoUrl: [
          {
            required: false,
            message: '请上传商户logo',
            trigger: ['blur', 'change'],
          },
        ],
        contactsCertFaceUrl: [
          {
            required: true,
            message: '请上传负责人证件正面',
            trigger: ['blur', 'change'],
          },
        ],
        contactsCertBackUrl: [
          {
            required: true,
            message: '请上传负责人证件反面',
            trigger: ['blur', 'change'],
          },
        ],
        shopUrl: [
          {
            required: true,
            message: '请上传商户门头照',
            trigger: ['blur', 'change'],
          },
        ],
      },

      isAgree: false,// 是否同意隐私协议
    }
  },
  computed: {
    ...mapState(useUserStore, {
      isLogined: 'isLogined',
    }),
  },
  async onLoad (options) {
    console.log(options.isdisabled, 'options')
    // this.isdisabled = options.isdisabled == '1' ? true : false

    this.$set(this, 'isdisabled', options.isdisabled == '1' ? true : false)
    // 详情请看默认勾选同意协议
    if(this.isdisabled) this.isAgree = true
    console.log(this.isdisabled,options.isdisabled , 'isdisabled')
    if (options.isdisabled == '1') {
      console.log('isdisabled', this.isdisabled)
      toast(`正在审批中,请耐心等待`)
      // uni.showToast({
      //   title: '正在审批中,请耐心等待',
      //   duration: 2000
      // })
    }
    if(options.isdisabled){
      let mctid = useMctStore().mctId
      this.getDetail(mctid)
    }
  },
  created () { },
  mounted () {
    this.dictList('CERT_TYPE', 'contactsCertTypeRange')
    this.dictList('MCT_TYPE', 'mctTypeRange')
    this.userInfo = this.bridgeSdk.getUserInfo()?.userInfo
    console.log(this.userInfo, 'userInfo')
    console.log(this.isdisabled, 'isdisabled')
    if (this.isdisabled) {
      // uni.showToast({
      //   title: '正在审批中,请耐心等待',
      //   duration: 2000
      // })
    }
    this.getLinkAgeCity('root').then(res => {
      this.itemList = res
    })
  },
  methods: {
    completeChange (e) {
      this.commercialForm.province = e.result[0].cityNo
      this.commercialForm.city = e.result[1].cityNo
      this.commercialForm.area = e.result[2].cityNo
      this.commercialForm.Provinces = e.cityName
    },
    inputChange (e) {
      this.getLinkAgeCity(e.cityNo).then(res => {
        this.receiveData = res
      })
    },
    // feedbackType;//意见反馈类型 数据字典 FEEDBACK_TYPE
    // feedbackContent;//意见反馈内容
    upComplete (imageData, type, fileListType) {
      console.log(imageData, 'imageData')
      // this.fileList.push(imageData.id);
      this.commercialForm[type] = imageData.id
      this['fileList' + fileListType] = [
        { url: this.minioBaseUrl + imageData.url },
      ]
      // this.commercialForm[type + 'Id'] = imageData.id
      console.log(this.commercialForm, 'this.userInfo')
      this.$refs.commercialForm.validateField(type, res=>{
        console.warn('xxxx', res)
      })
    },
    // 删除图片
    deleteImg(imageDate, type, fileListType) {
      this.commercialForm[type] = ''
      this['fileList' + fileListType] = []
    },
    async getDetail (mctid) {
      let res = await getMctInfo({
        userId: this.bridgeSdk.getUserInfo().userInfo.userId,
        mctId: mctid,
      })
      console.log(res, 'resmctInfo')
      // res.statusName
      if (this.isdisabled && (res.status == '1' || res.status == '3')) {
        toast(`正在审核中,请耐心等待`)
      } else if(this.isdisabled && (res.status == '2' || res.status == '9')) {
        toast(`商户已${res.statusName}`)
      }
      this.commercialForm = res
      this.commercialForm.categoryName = res.categoryId ? res.categoryParentName + '-' + res.categoryName : res.categoryParentName
      this.commercialForm.Provinces = res.provinceName +'/'+ res.cityName+ '/' + res.areaName
      this.defaultItemList = [res.provinceName, res.cityName, res.areaName]
      if (!this.commercialForm.remark) { this.commercialForm.remark = "" }
      // 商户logo非必填，校验下是否存在，避免详情展示空白占位
      this.fileListMctLogoUrl = res.mctLogoUrlShowUrl ? [{ url: this.minioBaseUrl + res.mctLogoUrlShowUrl }] : []

      this.fileListContactsCertBackUrl = [{ url: this.minioBaseUrl + res.contactsCertBackUrlShowUrl }]
      this.fileListContactsCertFaceUrl = [{ url: this.minioBaseUrl + res.contactsCertFaceUrlShowUrl }]
      this.fileListShopUrl = [{ url: this.minioBaseUrl + res.shopUrlShowUrl }]
      console.log(this.commercialForm, 'this.commercialForm')
    },
    dictList (type, value) {
      console.log('dictList=====================', type)
      this[value] = []
      getDataDicList({ code: type }).then((res) => {
        console.log(res, res, 'res11111')
        res.forEach((item) => {
          this[value].push({
            value: item.optCode,
            text: item.optName,
          })
        })
        this[value] = [...this[value]]
        console.log(this[value], `${value}`)
        this.commercialForm = { ...this.commercialForm }
      })

      // let res = awiat fangf()
      // res.data.forEach(item => {
      //   this.mctTypeRange.push({
      //     value: item.value,
      //     text: item.label
      //   })
      // })

    },
    async getLinkAgeCity (cityNo, index) {
      let res = await getLinkAgeCity({ parentNo: cityNo })
      return res
    },
    async LinkAgeCity (cityNo, index) {
      let res = await getLinkAgeCity({ parentNo: cityNo })
      this.columns[index] = res
    },
    cancel () {
      this.$refs.uPickerRef.setIndexs([0, 0])
      this.pickerShow = false
      // #ifdef H5
      document.body.style.overflow = 'auto'
      // #endif
    },
    changeMctType () {
      console.log('changeMctTypechangeMctType')
      this.columns = [0, 0, 0]
      this.commercialForm.categoryName = ''
      this.commercialForm.categoryId = ''
      this.commercialForm.categoryParentId = ''
    },
    async changeHandler (e) {
        let res = await getBusinessCateGoryList({ code: e.value[0].optCode,mctType: this.commercialForm.mctType })
        if (res.length <= 0) {
          delete this.columns[1]
        } else {
          this.columns[1] = res
        }
    },
    confirm (e) {
        if (e.value.length == 2) {
          this.commercialForm.categoryId = e.value[1].optCode
          this.commercialForm.categoryParentId = e.value[0].optCode
          this.commercialForm.categoryName =
            e.value[0].optName + '-' + e.value[1].optName
        } else {
          this.commercialForm.categoryParentId = e.value[0].optCode
          this.commercialForm.categoryName = e.value[0].optName
        }
      this.pickerShow = false
      // #ifdef H5
      document.body.style.overflow = 'auto'
      // #endif
    },

    async initCategory () {
      let one = await this.BusinessCateGoryList({ code: '00', mctType: this.commercialForm.mctType })
      if (one && one.length > 0 && one[0].optCode) {
       this.pickerShow = true
        this.BusinessCateGoryList({ code: one[0].optCode , mctType: this.commercialForm.mctType }).then((res) => {
          console.log(res, 'restwo')
          this.columns = [one, res]
          this.$nextTick(() => {
            this.$refs.uPickerRef.setIndexs([0, 0])
          })
        })
        //  this.columns = [one, two]
        //  console.log(this.columns,one, [...two],'columns');
      }else{
        toast('商户类型暂无行业类目数据')
      }
    },
    async BusinessCateGoryList (obj) {
      let res = await getBusinessCateGoryList(obj)
      return res
    },
    async openCategory () {
      if (this.isdisabled) return
      if (!this.bridgeSdk.checkIsEmpty(this.commercialForm.mctType)) return toast('请先选择商户类型')
      // #ifdef H5
      document.body.style.overflow = 'hidden'
      // #endif
      await this.initCategory()
      await this.$nextTick()
      this.keyName = 'optName'
    },
    //data-select更新
    dataSelectChange(e) {
      this.commercialForm.contactsCertType = e
      this.$refs.commercialForm.validateField('contactsCertType', res=>{
        console.warn('xxxx', res)
      })
      if(e == '01'){
        this.commercialFormRule.contactsCertNo = [
          {
            type: 'string',
            required: true,
            message: '请输入证件号',
            trigger: ['blur', 'change']
          },
          {
            type: 'string',
            message: '请输入正确的证件号',
            trigger: ['blur', 'change'],
            pattern: /^[A-Za-z0-9]{18}$/,
          }
        ]
      }
      else {
        this.commercialFormRule.contactsCertNo = [
          {
            type: 'string',
            required: true,
            message: '请输入证件号',
            trigger: ['blur', 'change']
          }
        ]
      }
      this.$forceUpdate()
    },

    submitForm () {
      this.commercialForm.userId = this.userInfo.userId
      console.log(this.userInfo, this.commercialForm)
      this.$refs.commercialForm.validate().then(async valid => {
        if (valid) {
          if(!this.isAgree) {
            this.bridgeSdk.showToast({
              title: '请先阅读并同意协议'
            })
            return
          }
          // 商务合伙人手机号和联系电话统一
          this.commercialForm.contactsPhone = this.commercialForm.phone
          console.log(this.commercialForm, 'this.commercialForm')

          // location.reload();
          this.bridgeSdk.showConfirm({
            content: '确定是否提交,提交后不可修改',
            confirmText: '确定',
            cancelText: '取消',
            confirmCallback: async () => {
              let res = await mctInfoApply(this.commercialForm)
              this.getDetail(res)
              this.bridgeSdk.showToast('提交成功')
              this.isdisabled = true
              this.bridgeSdk.navigateBackTo({
                delta: 1,
                success: (res) => {
                  res.__loadData__()
                },
              })
            },
            cancelCallback: (res) => { },
          })

          // this.bridgeSdk.jumpPage({
          //   url: `/package-product-list/commercialDetail/commercialDetail?mctId=${res}`
          // })
        }
      })
    },
    // 阅读隐私政策
    goAgreement() {
      this.bridgeSdk.jumpPage({
        url: `/package-product-list/commercial/agreement?isDetail=${this.isdisabled || this.isAgree ? '1' : '0'}`
      })
    },
    // 同意隐私协议
    doAgree() {
      this.isAgree = true
    }


  },
}
</script>

<style lang="scss" scoped>
.commercial {
  padding: 40rpx 20rpx;
  height: 100%;
  background-color: #f5f6f8;
}
.form_btn {
  background: linear-gradient( 90deg, #8FBAFF 0%, #438AFB 100%);
  border-radius: 50rpx !important;
  border: none !important;
  margin-top: 20rpx;
}
/* .form_input /deep/ .u-form-item__body {
  height: 66rpx;
} */
.form_input ::v-deep .u-form-item__body {
  min-height: 36rpx;
}
::v-deep .u-form-item__body {
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 30rpx !important;
}
::v-deep .uni-select {
  border: none;
}
::v-deep .input-value {
  border: none;
  padding-left: 0;
  line-height: 70rpx;
}
::v-deep .uni-select__input-text {
  color: rgb(192, 196, 204);
  font-size: 30rpx !important;
}
::v-deep .selected-area {
  font-size: 30rpx !important;
  color: rgb(192, 196, 204);
}
::v-deep .uni-stat-box {
  margin-left: -20rpx;
}
.form_input_updata ::v-deep .u-form-item__body__right__content__slot {
  margin-top: 20rpx;
  display: block;
}
::v-deep .u-input {
  background: none !important;
}
::v-deep .uni-select--disabled {
  background: none;
}
::v-deep .uni-stat__actived .uni-select .uni-select__input-text {
  color: #303133;
}
/* /deep/ .u-form-item--error{
  position: relative !important;
}
/deep/ .u-form-item__body__right__message{
  position: absolute !important;
  bottom: 30rpx;
  margin-left: 260rpx !important;
} */
::v-deep .u-form-item__body__right {
  margin: auto !important;
  display: contents;
}
::v-deep .u-form-item__body__right__message {
  margin: -3px 0 13px 0px !important;
}
::v-deep .uni-input-placeholder {
  font-size: 30rpx !important;
}

.agreement {
  margin-top: 20rpx;
  &-block {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    color: gray;
  }
}
</style>
