// ====== 本地 Mock 数据仓库（演示用，后端上线后可删除整个文件） ======
// 基于 uni.storage 实现跨页面数据共享，模拟完整下单→查单→详情→取消联动

export interface MockOrder {
  _id: string;
  category: string;
  brand: string;
  fileID: string;
  estPriceMin: number;
  estPriceMax: number;
  finalPrice?: number;
  status: "pending" | "assigned" | "en_route" | "serving" | "completed" | "cancelled";
  address: string;
  timeWindow: {
    date: string;
    start: string;
    end: string;
  };
  recyclerName?: string;
  recyclerId?: string;
  created: string;
  source: "online" | "offline";
  remark?: string;
}

const STORAGE_KEY = "_mock_orders";

function getAll(): MockOrder[] {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(orders: MockOrder[]) {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(orders));
}

/** 创建新订单 */
export function createOrder(partial: {
  category: string;
  brand: string;
  fileID: string;
  priceMin: number;
  priceMax: number;
  date: string;
  timeSlot: string;
  address: string;
}): MockOrder {
  const orders = getAll();
  const [start, end] = partial.timeSlot.split("-");
  const newOrder: MockOrder = {
    _id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    category: partial.category,
    brand: partial.brand,
    fileID: partial.fileID,
    estPriceMin: partial.priceMin,
    estPriceMax: partial.priceMax,
    status: "pending",
    address: partial.address,
    timeWindow: {
      date: partial.date,
      start: start,
      end: end,
    },
    created: new Date().toISOString(),
    source: "online",
  };
  orders.unshift(newOrder);
  saveAll(orders);
  return newOrder;
}

/** 获取所有订单（最新在前） */
export function getOrders(): MockOrder[] {
  return getAll();
}

/** 获取单个订单 */
export function getOrder(id: string): MockOrder | undefined {
  return getAll().find((o) => o._id === id);
}

/** 更新订单状态 */
export function updateOrder(id: string, patch: Partial<MockOrder>): MockOrder | undefined {
  const orders = getAll();
  const idx = orders.findIndex((o) => o._id === id);
  if (idx === -1) return undefined;
  orders[idx] = { ...orders[idx], ...patch };
  saveAll(orders);
  return orders[idx];
}

/** 取消订单 */
export function cancelOrder(id: string): MockOrder | undefined {
  return updateOrder(id, { status: "cancelled" });
}

/** 清空所有 Mock 数据 */
export function clearOrders() {
  uni.removeStorageSync(STORAGE_KEY);
}
