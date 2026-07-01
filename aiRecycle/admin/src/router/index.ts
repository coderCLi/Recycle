import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/layout",
    component: () => import("../views/Layout.vue"),
    children: [
      { path: "dashboard", name: "dashboard", component: () => import("../views/Dashboard.vue") },
      { path: "orders", name: "orders", component: () => import("../views/orders/OrderList.vue") },
      { path: "data-entry", name: "data-entry", component: () => import("../views/data-entry/DataEntry.vue") },
      { path: "comparison", name: "comparison", component: () => import("../views/comparison/Comparison.vue") },
      { path: "recyclers", name: "recyclers", component: () => import("../views/recyclers/RecyclerList.vue") },
      { path: "pricing", name: "pricing", component: () => import("../views/pricing/PricingConfig.vue") },
      { path: "users", name: "users", component: () => import("../views/users/UserList.vue") },
      { path: "publish", name: "publish", component: () => import("../views/publish/PublishManager.vue") },
      { path: "settings", name: "settings", component: () => import("../views/settings/Settings.vue") },
    ],
  },
  { path: "/login", name: "login", component: () => import("../views/Login.vue") },
];

export default createRouter({ history: createWebHashHistory(), routes });
