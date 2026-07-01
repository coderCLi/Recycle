// 云函数：price-calculate — 根据品类+品牌计算估价区间
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// ====== Mock 价格数据（演示用，price-configs 集合创建后可删除） ======
const MOCK_PRICES = {
  "冰箱": { base: 150, range: 40 },
  "洗衣机": { base: 120, range: 30 },
  "电视": { base: 100, range: 30 },
  "空调": { base: 200, range: 50 },
  "电脑": { base: 80, range: 25 },
  "手机": { base: 60, range: 20 },
  "微波炉": { base: 30, range: 10 },
  "热水器": { base: 100, range: 30 },
  "废纸": { base: 15, range: 5 },
  "废金属": { base: 25, range: 8 },
  "塑料": { base: 10, range: 3 },
  "其他": { base: 20, range: 10 },
};

function getMockPrice(category, brand) {
  const cfg = MOCK_PRICES[category] || MOCK_PRICES["其他"];
  const brandBonus = brand ? cfg.base * 0.1 : 0;
  const base = cfg.base + brandBonus;
  return {
    min: Math.round(base - cfg.range),
    max: Math.round(base + cfg.range),
    _mock: true,
  };
}
// ====== Mock 价格数据 End ======

exports.main = async (event) => {
  const { category, brand } = event;

  // 先查真实价格配置
  const configRes = await db
    .collection("price-configs")
    .where({ category, enabled: true })
    .get()
    .catch(() => ({ data: [] }));  // 集合不存在时捕获错误

  if (configRes.data.length === 0) {
    // 无真实配置，使用 Mock 价格（演示用）
    console.log("[Mock模式] price-configs 集合为空，使用模拟价格");
    return {
      code: 0,
      data: getMockPrice(category, brand),
    };
  }

  const config = configRes.data[0];
  const conditionFactor = config.conditionFactors?.fair || 0.7;

  // 估价公式: 基准价 × 成色系数 × 本地系数
  const basePrice = config.basePrice * conditionFactor * (config.localAdjustment || 1.0);

  // 区间：±20% 浮动
  const min = Math.round(basePrice * 0.8);
  const max = Math.round(basePrice * 1.2);

  return {
    code: 0,
    data: { min, max },
  };
};
