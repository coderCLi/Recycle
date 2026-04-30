export interface Product {
  id: string
  name: string
  category: string
  image: string
  brand: string
  minPrice: number
  maxPrice: number
  unit: string
  condition: string[]
  description: string
}

export interface Banner {
  id: string
  image: string
  title: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const categories: Category[] = [
  { id: '1', name: '空调', icon: 'air-conditioner', color: '#00a8ff' },
  { id: '2', name: '洗衣机', icon: 'washing-machine', color: '#ff6b6b' },
  { id: '3', name: '彩电', icon: 'tv', color: '#4ecdc4' },
  { id: '4', name: '冰箱', icon: 'refrigerator', color: '#ffe66d' },
  { id: '5', name: '电脑', icon: 'computer', color: '#95e1d3' },
  { id: '6', name: '其他', icon: 'other', color: '#a29bfe' }
]

export const products: Product[] = [
  {
    id: '1',
    name: '挂式空调',
    category: '空调',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20wall%20mounted%20air%20conditioner%20white%20background%20product%20photography&image_size=square',
    brand: '格力、美的、海尔等',
    minPrice: 200,
    maxPrice: 1500,
    unit: '元/台',
    condition: ['使用年限', '匹数', '品牌', '功能是否正常'],
    description: '专业回收各类品牌挂式空调，根据使用年限和功能状态定价'
  },
  {
    id: '2',
    name: '柜式空调',
    category: '空调',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20floor%20standing%20air%20conditioner%20white%20background%20product%20photography&image_size=square',
    brand: '格力、美的、海尔等',
    minPrice: 500,
    maxPrice: 3000,
    unit: '元/台',
    condition: ['使用年限', '匹数', '品牌', '功能是否正常'],
    description: '专业回收各类品牌柜式空调，根据使用年限和功能状态定价'
  },
  {
    id: '3',
    name: '滚筒洗衣机',
    category: '洗衣机',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20front%20loading%20washing%20machine%20white%20background%20product%20photography&image_size=square',
    brand: '海尔、美的、小天鹅等',
    minPrice: 150,
    maxPrice: 1200,
    unit: '元/台',
    condition: ['使用年限', '容量', '品牌', '功能是否正常'],
    description: '专业回收各类品牌滚筒洗衣机，根据使用年限和功能状态定价'
  },
  {
    id: '4',
    name: '波轮洗衣机',
    category: '洗衣机',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20top%20loading%20washing%20machine%20white%20background%20product%20photography&image_size=square',
    brand: '海尔、美的、小天鹅等',
    minPrice: 100,
    maxPrice: 800,
    unit: '元/台',
    condition: ['使用年限', '容量', '品牌', '功能是否正常'],
    description: '专业回收各类品牌波轮洗衣机，根据使用年限和功能状态定价'
  },
  {
    id: '5',
    name: '液晶电视',
    category: '彩电',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20flat%20screen%20smart%20tv%20white%20background%20product%20photography&image_size=square',
    brand: '三星、索尼、海信等',
    minPrice: 100,
    maxPrice: 2000,
    unit: '元/台',
    condition: ['使用年限', '尺寸', '品牌', '屏幕是否完好'],
    description: '专业回收各类品牌液晶电视，根据使用年限和屏幕状态定价'
  },
  {
    id: '6',
    name: '曲面电视',
    category: '彩电',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20curved%20screen%20smart%20tv%20white%20background%20product%20photography&image_size=square',
    brand: '三星、索尼、LG等',
    minPrice: 300,
    maxPrice: 3000,
    unit: '元/台',
    condition: ['使用年限', '尺寸', '品牌', '屏幕是否完好'],
    description: '专业回收各类品牌曲面电视，根据使用年限和屏幕状态定价'
  },
  {
    id: '7',
    name: '双门冰箱',
    category: '冰箱',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20double%20door%20refrigerator%20white%20background%20product%20photography&image_size=square',
    brand: '海尔、美的、西门子等',
    minPrice: 200,
    maxPrice: 1500,
    unit: '元/台',
    condition: ['使用年限', '容量', '品牌', '制冷是否正常'],
    description: '专业回收各类品牌双门冰箱，根据使用年限和制冷状态定价'
  },
  {
    id: '8',
    name: '多门冰箱',
    category: '冰箱',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20multi%20door%20refrigerator%20white%20background%20product%20photography&image_size=square',
    brand: '海尔、美的、西门子等',
    minPrice: 500,
    maxPrice: 3000,
    unit: '元/台',
    condition: ['使用年限', '容量', '品牌', '制冷是否正常'],
    description: '专业回收各类品牌多门冰箱，根据使用年限和制冷状态定价'
  },
  {
    id: '9',
    name: '台式电脑',
    category: '电脑',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20desktop%20computer%20set%20white%20background%20product%20photography&image_size=square',
    brand: '联想、戴尔、惠普等',
    minPrice: 100,
    maxPrice: 1500,
    unit: '元/台',
    condition: ['使用年限', '配置', '品牌', '功能是否正常'],
    description: '专业回收各类品牌台式电脑，根据配置和功能状态定价'
  },
  {
    id: '10',
    name: '笔记本电脑',
    category: '电脑',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20laptop%20computer%20white%20background%20product%20photography&image_size=square',
    brand: '联想、戴尔、惠普等',
    minPrice: 200,
    maxPrice: 3000,
    unit: '元/台',
    condition: ['使用年限', '配置', '品牌', '功能是否正常'],
    description: '专业回收各类品牌笔记本电脑，根据配置和功能状态定价'
  },
  {
    id: '11',
    name: '显示器',
    category: '电脑',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20computer%20monitor%20white%20background%20product%20photography&image_size=square',
    brand: '三星、AOC、戴尔等',
    minPrice: 50,
    maxPrice: 800,
    unit: '元/台',
    condition: ['使用年限', '尺寸', '品牌', '屏幕是否完好'],
    description: '专业回收各类品牌显示器，根据尺寸和屏幕状态定价'
  },
  {
    id: '12',
    name: '空调外机',
    category: '其他',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=air%20conditioner%20outdoor%20unit%20white%20background%20product%20photography&image_size=square',
    brand: '各类品牌',
    minPrice: 100,
    maxPrice: 500,
    unit: '元/台',
    condition: ['使用年限', '匹数', '功能是否正常'],
    description: '专业回收空调外机，根据使用年限和功能状态定价'
  }
]

export const banners: Banner[] = [
  {
    id: '1',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=eco%20friendly%20appliance%20recycling%20service%20banner%20green%20theme%20clean%20modern%20design&image_size=landscape_16_9',
    title: '专业家电回收'
  },
  {
    id: '2',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=second%20hand%20appliance%20buyback%20promotion%20banner%20blue%20theme%20professional%20design&image_size=landscape_16_9',
    title: '高价回收'
  },
  {
    id: '3',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=free%20home%20pickup%20service%20appliance%20recycling%20banner%20orange%20theme%20modern%20design&image_size=landscape_16_9',
    title: '免费上门'
  }
]

export const services = [
  {
    id: '1',
    title: '免费上门',
    desc: '专业人员免费上门评估',
    icon: 'truck'
  },
  {
    id: '2',
    title: '即时付款',
    desc: '当场检测立即付款',
    icon: 'wallet'
  },
  {
    id: '3',
    title: '专业检测',
    desc: '专业设备精准评估',
    icon: 'check'
  },
  {
    id: '4',
    title: '环保处理',
    desc: '正规渠道环保拆解',
    icon: 'recycle'
  }
]

export const mineMenu = [
  { id: '1', title: '我的订单', icon: 'order', path: '/pages/mine/order' },
  { id: '2', title: '预约记录', icon: 'record', path: '/pages/mine/record' },
  { id: '3', title: '回收价格', icon: 'price', path: '/pages/recycle-price/index' },
  { id: '4', title: '常见问题', icon: 'help', path: '/pages/mine/help' },
  { id: '5', title: '联系客服', icon: 'service', path: '/pages/mine/service' },
  { id: '6', title: '关于我们', icon: 'about', path: '/pages/mine/about' }
]