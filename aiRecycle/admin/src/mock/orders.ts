// ====== 演示 Mock 数据（后管专用，后端上线后可删除整个文件） ======
// 基于 localStorage 存储，与管理后台共享

export interface OrderItem {
  _id: string;
  category: string;
  brand: string;
  estPriceMin: number;
  estPriceMax: number;
  finalPrice?: number;
  status: "pending" | "assigned" | "en_route" | "serving" | "completed" | "cancelled";
  address: string;
  recyclerName?: string;
  source: "online" | "offline";
  created: string;
}

const STORAGE_KEY = "_admin_mock_orders";

function generateDemoOrders(): OrderItem[] {
  const now = Date.now();
  return [
    {
      _id: "demo_001",
      category: "冰箱",
      brand: "海尔",
      estPriceMin: 130,
      estPriceMax: 170,
      status: "completed",
      address: "富拉尔基区和平路12号",
      recyclerName: "老王",
      source: "online",
      created: new Date(now - 86400000 * 2).toISOString(),
    },
    {
      _id: "demo_002",
      category: "洗衣机",
      brand: "小天鹅",
      estPriceMin: 100,
      estPriceMax: 140,
      status: "completed",
      address: "富拉尔基区红岸大街56号",
      recyclerName: "老张",
      source: "offline",
      finalPrice: 120,
      created: new Date(now - 86400000 * 3).toISOString(),
    },
    {
      _id: "demo_003",
      category: "空调",
      brand: "格力",
      estPriceMin: 180,
      estPriceMax: 230,
      status: "pending",
      address: "富拉尔基区向阳大街100号",
      source: "online",
      created: new Date(now - 3600000 * 5).toISOString(),
    },
    {
      _id: "demo_004",
      category: "电视",
      brand: "海信",
      estPriceMin: 80,
      estPriceMax: 120,
      status: "assigned",
      address: "富拉尔基区新华路88号",
      recyclerName: "老李",
      source: "online",
      created: new Date(now - 86400000).toISOString(),
    },
    {
      _id: "demo_005",
      category: "电脑",
      brand: "联想",
      estPriceMin: 60,
      estPriceMax: 95,
      status: "cancelled",
      address: "富拉尔基区光辉路3号",
      source: "offline",
      created: new Date(now - 3600000 * 12).toISOString(),
    },
  ];
}

function getAll(): OrderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // 首次访问，写入演示数据
      const demo = generateDemoOrders();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      return demo;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getOrders(): OrderItem[] {
  return getAll();
}
