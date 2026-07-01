<template>
  <div class="layout" :class="{ 'dark-theme': isDark }">
    <!-- 左侧边栏（级联菜单） -->
    <aside class="sidebar" :class="{ collapsed }">
      <div class="sidebar-header">
        <!-- 折叠态：居中 logo 图标 -->
        <div v-if="collapsed" class="collapsed-logo">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28"><rect x="4" y="4" width="24" height="24" rx="6" fill="#1890FF"/><path d="M10 16l4 4 8-8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <!-- 展开态：logo + 标题 -->
        <template v-else>
          <span class="sidebar-logo">♻</span>
          <span class="sidebar-title">aiRecycle</span>
        </template>
      </div>

      <!-- 级联菜单 -->
      <nav class="sidebar-nav">
        <!-- ====== 折叠态：扁平化图标菜单（图标在上，文字在下）====== -->
        <template v-if="collapsed">
          <div class="cm-item" :class="{ active: route.path === '/layout/dashboard' }" @click="nav('/layout/dashboard')" title="数据看板">
            <span class="cmi-icon">📊</span>
            <span class="cmi-label">数据看板</span>
          </div>
          <!-- 业务管理组 -->
          <div class="cm-item" :class="{ active: route.path.startsWith('/layout/orders') || route.path.startsWith('/layout/data-entry') || route.path.startsWith('/layout/comparison') }" @click="toggleCollapsedGroup('业务管理')" :title="'业务管理' + (expandedCollapsedGroups.includes('业务管理') ? ' ▾' : '')">
            <span class="cmi-icon">📋</span>
            <span class="cmi-label">业务管理</span>
          </div>
          <template v-if="expandedCollapsedGroups.includes('业务管理')">
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/orders' }" @click="nav('/layout/orders')" title="订单管理"><span class="cmi-icon">📋</span><span class="cmi-label">订单管理</span></div>
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/data-entry' }" @click="nav('/layout/data-entry')" title="线下录入"><span class="cmi-icon">✏️</span><span class="cmi-label">线下录入</span></div>
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/comparison' }" @click="nav('/layout/comparison')" title="多端对比"><span class="cmi-icon">📈</span><span class="cmi-label">多端对比</span></div>
          </template>
          <!-- 人员管理组 -->
          <div class="cm-item" :class="{ active: route.path.startsWith('/layout/recyclers') || route.path.startsWith('/layout/users') }" @click="toggleCollapsedGroup('人员管理')" :title="'人员管理' + (expandedCollapsedGroups.includes('人员管理') ? ' ▾' : '')">
            <span class="cmi-icon">👥</span>
            <span class="cmi-label">人员管理</span>
          </div>
          <template v-if="expandedCollapsedGroups.includes('人员管理')">
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/recyclers' }" @click="nav('/layout/recyclers')" title="回收员管理"><span class="cmi-icon">👷</span><span class="cmi-label">回收员</span></div>
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/users' }" @click="nav('/layout/users')" title="用户管理"><span class="cmi-icon">👤</span><span class="cmi-label">用户管理</span></div>
          </template>
          <!-- 配置中心组 -->
          <div class="cm-item" :class="{ active: route.path.startsWith('/layout/pricing') || route.path.startsWith('/layout/publish') || route.path.startsWith('/layout/settings') }" @click="toggleCollapsedGroup('配置中心')" :title="'配置中心' + (expandedCollapsedGroups.includes('配置中心') ? ' ▾' : '')">
            <span class="cmi-icon">⚙️</span>
            <span class="cmi-label">配置中心</span>
          </div>
          <template v-if="expandedCollapsedGroups.includes('配置中心')">
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/pricing' }" @click="nav('/layout/pricing')" title="品类定价"><span class="cmi-icon">💰</span><span class="cmi-label">定价</span></div>
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/publish' }" @click="nav('/layout/publish')" title="发布管理"><span class="cmi-icon">🚀</span><span class="cmi-label">发布</span></div>
            <div class="cm-item cm-child" :class="{ active: route.path === '/layout/settings' }" @click="nav('/layout/settings')" title="系统设置"><span class="cmi-icon">⚙️</span><span class="cmi-label">设置</span></div>
          </template>
        </template>

        <!-- ====== 展开态：级联菜单（原有逻辑）====== -->
        <template v-else>
          <template v-for="item in menuTree" :key="item.key || item.label">
            <!-- 有子菜单的分组 -->
            <div v-if="item.children && item.children.length > 0" class="menu-group">
              <div class="menu-group-header" :class="{ expanded: expandedGroups.includes(item.key) }" @click="toggleGroup(item.key)">
                <span class="mg-icon">{{ item.icon }}</span>
                <span class="mg-label">{{ item.label }}</span>
                <span class="mg-arrow">▸</span>
              </div>
              <transition name="slide">
                <div v-if="expandedGroups.includes(item.key)" class="menu-group-children">
                  <div
                    v-for="child in item.children"
                    :key="child.key"
                    class="menu-item child-item"
                    :class="{ active: route.path === child.key }"
                    @click="nav(child.key)"
                  >
                    {{ child.icon }} {{ child.label }}
                  </div>
                </div>
              </transition>
            </div>
            <!-- 无子菜单的单项 -->
            <div
              v-else
              class="menu-item single-item"
              :class="{ active: route.path === item.key }"
              @click="nav(item.key)"
            >
              {{ item.icon }} {{ item.label }}
            </div>
          </template>
        </template>
      </nav>

      <!-- 底部操作区 -->
      <div class="sidebar-footer">
        <button v-if="collapsed" class="collapse-expand-btn" @click="collapsed = false" title="展开菜单">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
        <template v-else>
          <n-button text size="small" @click="collapsed = true">折叠</n-button>
          <n-button text size="small" @click="logout" style="margin-top:8px; color:#e02020">退出</n-button>
        </template>
      </div>
    </aside>

    <!-- 右侧主体区 -->
    <div class="main">
      <!-- 顶部导航栏 -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="icon-btn" @click="collapsed = !collapsed" title="折叠菜单">☰</button>
          <n-breadcrumb separator="/">
            <n-breadcrumb-item v-if="route.path !== '/layout/dashboard'" @click="$router.push('/layout/dashboard')">仪表盘</n-breadcrumb-item>
            <n-breadcrumb-item>{{ currentPage }}</n-breadcrumb-item>
          </n-breadcrumb>
          <button class="icon-btn star-btn" :class="{ starred: isStarred }" @click="toggleStar" title="收藏">
            {{ isStarred ? "★" : "☆" }}
          </button>
        </div>
        <div class="topbar-right">
          <div class="search-trigger" @click="showSearch = true" title="搜索 (Ctrl+K)">🔍 搜索 <kbd>⌘K</kbd></div>
          <div class="tool-group">
            <button class="icon-btn" @click="toggleDark" :title="isDark ? '亮色' : '暗色'">{{ isDark ? "☀️" : "🌙" }}</button>
            <button class="icon-btn" @click="toggleFullscreen" title="全屏">⛶</button>
            <button class="icon-btn" @click="cycleFontSize" :title="'字号' + fontSizeLabel">A{{ fontSize === "small" ? "-" : fontSize === "large" ? "+" : "" }}</button>
          </div>
          <n-badge :value="unreadCount" :max="99" dot :show="unreadCount > 0">
            <button class="icon-btn" @click="showNotifications = true">🔔</button>
          </n-badge>
          <n-dropdown :options="userMenuOpts" @select="handleUserAction">
            <div class="user-info">
              <n-avatar round :size="32" :style="{ background: '#07C160' }">{{ userAvatar }}</n-avatar>
              <span v-if="!collapsed" class="user-name">{{ userName }}</span>
              <span class="arrow">▾</span>
            </div>
          </n-dropdown>
        </div>
      </header>

      <!-- 标签页栏（在顶栏下方、内容上方） -->
      <div class="tabs-bar" v-if="openedTabs.length > 0">
        <div class="tabs-left">
          <div
            v-for="tab in openedTabs"
            :key="tab.path"
            class="tab-chip"
            :class="{ active: currentTabPath === tab.path }"
          >
            <span class="tc-icon">{{ getTabIcon(tab.path) }}</span>
            <span class="tc-label" @click="switchTab(tab.path)">{{ tab.label.replace(/^[^\s]+\s/, '') }}</span>
            <!-- 主控台/仪表盘不显示关闭按钮 -->
            <span v-if="tab.path !== '/layout/dashboard'" class="tc-close" @click.stop="closeTab(tab.path)" title="关闭">×</span>
          </div>
        </div>
        <div class="tabs-right">
          <button class="tb-tool" title="视图模式">⊞</button>
          <button class="tb-tool" @click="toggleFullscreen" title="全屏">⛶</button>
          <button class="tb-tool" @click="refreshPage" title="刷新">⟳</button>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content" :style="{ fontSize: fontSizes[fontSize] }">
        <router-view />
      </div>
    </div>

    <!-- 搜索弹窗 Ctrl+K -->
    <n-modal v-model:show="showSearch" preset="dialog" :show-icon="false" :closable="true" :bordered="false" style="width:520px">
      <n-input ref="searchInputRef" v-model:value="searchQuery" placeholder="搜索订单、用户、回收员..." size="large" clearable autofocus @input="onSearchInput">
        <template #prefix><span style="color:#999">🔍</span></template>
      </n-input>
      <div v-if="searchQuery && searchResults.length > 0" class="search-results">
        <div v-for="(r, i) in searchResults" :key="i" class="search-result-item" @click="goSearchResult(r)">
          <span class="sr-tag">{{ r.type }}</span><span class="sr-title">{{ r.title }}</span><span class="sr-sub">{{ r.sub }}</span>
        </div>
      </div>
      <div v-else-if="searchQuery && searchResults.length === 0" class="search-empty">未找到相关结果</div>
      <div v-else class="search-hint"><div class="sh-row"><span class="sk">↑↓</span> 选择 &nbsp; <span class="sk">↵</span> 跳转 &nbsp; <span class="sk">Esc</span> 关闭</div></div>
    </n-modal>

    <!-- 通知面板 -->
    <n-modal v-model:show="showNotifications" preset="card" title="通知消息" :bordered="false" size="medium" style="width:420px">
      <n-tabs type="line" animated>
        <n-tab-pane name="order" tab="订单提醒 (3)">
          <n-list hoverable clickable>
            <n-list-item v-for="n in orderNotifs" :key="n.id">
              <n-thing :title="n.title" :description="n.desc" />
              <template #suffix><n-time :time="new Date(n.time)" format="MM-dd HH:mm" type="relative" /></template>
            </n-list-item>
          </n-list>
        </n-tab-pane>
        <n-tab-pane name="system" tab="系统通知 (1)">
          <n-list hoverable clickable>
            <n-list-item>
              <n-thing title="系统升级提示" description="后管系统已升级至 v1.0.0，请刷新页面体验新功能。" />
              <template #suffix><n-time :time="new Date()" format="MM-dd HH:mm" type="relative" /></template>
            </n-list-item>
          </n-list>
        </n-tab-pane>
      </n-tabs>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NBreadcrumb, NBreadcrumbItem, NBadge, NModal, NInput, NTabs, NTabPane, NList, NListItem, NThing, NTime, NDropdown, NAvatar, NButton } from "naive-ui";
import { useWatermark } from "../composables/useWatermark";

const router = useRouter();
const route = useRoute();
useWatermark();

// ====== 级联菜单树 ======
interface MenuItem {
  label: string; icon?: string;
  key?: string; path?: string;
  children?: MenuItem[];
}

const menuTree: MenuItem[] = [
  {
    label: "数据看板", icon: "📊", key: "/layout/dashboard",
  },
  {
    label: "业务管理", icon: "📋",
    children: [
      { label: "订单管理", icon: "📋", key: "/layout/orders" },
      { label: "线下录入", icon: "✏️", key: "/layout/data-entry" },
      { label: "多端对比", icon: "📈", key: "/layout/comparison" },
    ],
  },
  {
    label: "人员管理", icon: "👥",
    children: [
      { label: "回收员管理", icon: "👷", key: "/layout/recyclers" },
      { label: "用户管理", icon: "👤", key: "/layout/users" },
    ],
  },
  {
    label: "配置中心", icon: "⚙️",
    children: [
      { label: "品类定价", icon: "💰", key: "/layout/pricing" },
      { label: "发布管理", icon: "🚀", key: "/layout/publish" },
      { label: "系统设置", icon: "⚙️", key: "/layout/settings" },
    ],
  },
];

// 展开状态
const expandedGroups = ref<string[]>(["业务管理", "人员管理"]);
function toggleGroup(key: string) {
  const idx = expandedGroups.value.indexOf(key);
  if (idx >= 0) expandedGroups.value.splice(idx, 1);
  else expandedGroups.value.push(key);
}

// 自动展开当前激活项所在的分组
watch(() => route.path, (path) => {
  function findGroup(items: MenuItem[]): string | null {
    for (const item of items) {
      if (item.children) {
        if (item.children.some(c => c.key === path)) return item.label;
        const found = findGroup(item.children);
        if (found) return found;
      }
    }
    return null;
  }
  const g = findGroup(menuTree);
  if (g && !expandedGroups.value.includes(g)) expandedGroups.value.push(g);
}, { immediate: true });

// 扁平化所有可导航路径（用于标签页）
const allFlatPaths = computed(() => {
  const result: { key: string; label: string; icon: string }[] = [];
  function flatten(items: MenuItem[]) {
    items.forEach(item => {
      if (item.key) result.push({ key: item.key, label: item.label, icon: item.icon || "📄" });
      if (item.children) flatten(item.children);
    });
  }
  flatten(menuTree);
  return result;
});

// ====== 导航 ======
const nav = (key: string) => router.push(key);
const logout = () => router.push({ name: "login" });

// ====== 面包屑 ======
const currentPage = computed(() => {
  const f = allFlatPaths.value.find(f => f.key === route.path);
  return f?.label || "管理后台";
});
const isStarred = ref(false);
function toggleStar() { isStarred.value = !isStarred.value; }

// ====== 主题 ======
const isDark = ref(localStorage.getItem("admin_dark") === "true");
function toggleDark() { isDark.value = !isDark.value; (window as any).__setAdminDark?.(isDark.value); }

// ====== 字体 ======
type FS = "small" | "default" | "large";
const fontSize = ref<FS>("default");
const fontSizes: Record<FS,string> = { small:"13px", default:"14px", large:"16px" };
const fontSizeLabels: Record<FS,string> = { small:"小", default:"中", large:"大" };
const fontSizeLabel = computed(() => fontSizeLabels[fontSize.value]);
function cycleFontSize() { const o:FS[]=["small","default","large"]; fontSize.value=o[(o.indexOf(fontSize.value)+1)%3]; }

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen();
}

// ====== 用户 ======
const userName = computed(() => localStorage.getItem("admin_user") || "admin");
const userAvatar = computed(() => userName.value.slice(0,1).toUpperCase());
const userMenuOpts = [{ label:"个人中心",key:"profile" },{ label:"修改密码",key:"password" },{ type:"divider" as const,key:"d1" },{ label:"退出登录",key:"logout" }];
function handleUserAction(k:string){if(k==="logout")logout()}

// ====== 搜索 ======
const showSearch=ref(false);const searchQuery=ref("");const searchInputRef=ref<any>(null);const searchResults=ref<any[]>([]);
watch(showSearch,v=>{if(v)setTimeout(()=>searchInputRef.value?.focus(),100)});
function onSearchInput(q:string){
  if(!q.trim()){searchResults.value=[];return}
  const kw=q.toLowerCase();searchResults.value=[
    {type:"订单",title:`#${Math.floor(Math.random()*1000)} 冰箱·海尔 回收`,sub:"富拉尔基区 · 待确认",path:"/layout/orders"},
    {type:"用户",title:`用户_${kw}`,sub:"注册时间:2026-06",path:"/layout/users"},
    {type:"回收员",title:`老王`,sub:"完成126单 · 积分92",path:"/layout/recyclers"},
    {type:"设置",title:`${kw}配置`,sub:"系统设置",path:"/layout/settings"},
  ].filter(i=>i.title.toLowerCase().includes(kw)||i.type.includes(kw));
}
function goSearchResult(r:any){showSearch.value=false;router.push(r.path)}

// ====== 通知 ======
const showNotifications=ref(false);const unreadCount=ref(4);
const orderNotifs=[
  {id:1,title:"新预约：冰箱·海尔",desc:"富拉尔基区向阳大街100号 | 预约明天 09:00-09:30",time:Date.now()-300000},
  {id:2,title:"订单完成",desc:"洗衣机·小天鹅 已由老王完成上门回收",time:Date.now()-1800000},
  {id:3,title:"取消提醒",desc:"用户取消了电视回收订单",time:Date.now()-7200000},
];

// ====== 标签页 ======
interface OpenTab{path:string;label:string}
const openedTabs=ref<OpenTab[]>([]);
const currentTabPath=computed(()=>route.path);

watch(()=>route.path,(path)=>{
  const f=allFlatPaths.value.find(f=>f.key===path);if(!f)return;
  if(!openedTabs.value.find(t=>t.path===path))openedTabs.value.push({path,label:f.label});
},{immediate:true});

function switchTab(p:string){router.push(p)}
function closeTab(path:string){
  openedTabs.value=openedTabs.value.filter(t=>t.path!==path);
  if(currentTabPath.value===path){
    const remaining=openedTabs.value;
    router.push(remaining.length?remaining[remaining.length-1].path:'/layout/dashboard');
  }
}
function getTabIcon(path:string){return allFlatPaths.value.find(f=>f.key===path)?.icon||"📄"}
function refreshPage(){window.location.reload()}

// ====== 快捷键 ======
function onKeydown(e:KeyboardEvent){
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();showSearch.value=true;}
  if(e.key==='Escape'){showSearch.value=false;showNotifications.value=false;}
}
onMounted(()=>window.addEventListener('keydown',onKeydown));
onUnmounted(()=>window.removeEventListener('keydown',onKeydown));

// 折叠
const collapsed=ref(false);

// 折叠态下的分组展开状态（图标菜单模式）
const expandedCollapsedGroups = ref<string[]>(["业务管理", "人员管理"]);
function toggleCollapsedGroup(name: string) {
  const idx = expandedCollapsedGroups.value.indexOf(name);
  if (idx >= 0) expandedCollapsedGroups.value.splice(idx, 1);
  else expandedCollapsedGroups.value.push(name);
}
</script>

<style scoped>
/* 布局 */
.layout{display:flex;height:100vh;overflow:hidden;background:#f5f7fa;color:#333;transition:background .3s}
.dark-theme{background:#141414;color:#ddd}
.dark-theme .sidebar{background:#1a1a1a;border-color:#333;color:#ccc}
.dark-theme .sidebar-header{border-bottom-color:#333}
.dark-theme .topbar{background:#1a1a1a;border-color:#333;color:#eee;border-bottom:none}
.dark-theme .tabs-bar{background:#1a1a1a;border-bottom-color:#333}
.dark-theme .tab-chip{color:#aaa}
.dark-theme .tab-chip:hover{background:#222;color:#ccc}
.dark-theme .tab-chip.active{color:#1890FF;background:rgba(24,144,255,0.12)}
.dark-theme .search-trigger{border-color:#444;color:#aaa}
.dark-theme .icon-btn:hover{background:#333}
.dark-theme .cm-item{color:#aaa}
.dark-theme .cm-item:hover{background:#222;color:#ccc}
.dark-theme .cm-item.active{color:#1890FF;background:rgba(24,144,255,0.12)}

/* 侧边栏 */
.sidebar{
  width:220px;background:#fff;border-right:1px solid #eee;
  display:flex;flex-direction:column;flex-shrink:0;
  transition:width .25s ease;
}
.sidebar.collapsed{width:64px}
.sidebar-header{
  display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 12px;
  border-bottom:1px solid #f0f0f0;flex-shrink:0;height:56px;
}
.sidebar-logo{font-size:24px}
.sidebar-title{font-size:16px;font-weight:bold;color:#07C160;letter-spacing:.5px}

/* 折叠态 logo */
.collapsed-logo{display:flex;align-items:center;justify-content:center}

/* 导航区 */
.sidebar-nav{flex:1;padding:8px 0;overflow-y:auto;overflow-x:hidden}

/* ====== 折叠态：图标+文字垂直菜单 ====== */
.cm-item{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:10px 4px;margin:2px 6px;cursor:pointer;border-radius:8px;
  transition:all .15s;color:#666;font-size:11px;
  user-select:none;gap:4px;height:auto;min-height:56px;
}
.cm-item:hover{background:#f5f7fa;color:#333}
.cm-item.active{color:#1890FF;background:#E6F7FF}
.cmi-icon{font-size:20px;line-height:1;display:block}
.cmi-label{font-size:11px;line-height:1.2;text-align:center;word-break:break-all;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.cm-child{min-height:48px;padding:8px 2px}
.cm-child .cmi-icon{font-size:17px}
.cm-child .cmi-label{font-size:10px}

/* 分组标题 */
.menu-group{margin-bottom:2px}
.menu-group-header{
  display:flex;align-items:center;gap:8px;padding:10px 12px;margin:1px 4px;
  cursor:pointer;border-radius:6px;transition:all .15s;color:#555;font-size:13.5px;font-weight:500;
  user-select:none;
}
.menu-group-header:hover{background:#f5f5f5}
.menu-group-header.expanded .mg-arrow{transform:rotate(90deg)}
.mg-icon{font-size:16px;flex-shrink:0}
.mg-label{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mg-arrow{font-size:10px;color:#bbb;transition:transform .2s;flex-shrink:0;width:12px;text-align:center}

/* 分组子菜单 */
.menu-group-children{padding-left:18px;overflow:hidden}
.slide-enter-active,.slide-leave-active{transition:all .2s ease}
.slide-enter-from,.slide-leave-to{opacity:0;max-height:0}
.child-item{padding:8px 10px;margin:1px 4px;font-size:13px;color:#666}

/* 单个菜单项 */
.menu-item{
  padding:10px 14px;margin:1px 4px;cursor:pointer;border-radius:6px;
  font-size:13.5px;color:#555;transition:all .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.menu-item:hover{background:#f5f5f5}
.menu-item.active{color:#07C160;background:#07C16010;font-weight:600}
.single-item.active{border-left:3px solid #07C160}

.sidebar-footer{padding:12px 8px;border-top:1px solid #f0f0f0;text-align:center;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.collapse-expand-btn{
  width:36px;height:36px;border:none;background:transparent;border-radius:8px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  color:#999;transition:all .15s;margin:0 auto;
}
.collapse-expand-btn:hover{background:#f5f7fa;color:#555}

/* 主区域 */
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}

/* 顶部导航 — 与标签页栏融为一体 */
.topbar{
  height:52px;padding:0 16px;
  display:flex;align-items:center;justify-content:space-between;
  background:#fff;border-bottom:none;flex-shrink:0;z-index:50;
}
.topbar-left,.topbar-right{display:flex;align-items:center;gap:10px}
.icon-btn{
  width:32px;height:32px;border:none;background:transparent;border-radius:6px;
  cursor:pointer;font-size:15px;display:inline-flex;align-items:center;justify-content:center;
  color:#666;transition:all .15s;
}
.icon-btn:hover{background:#f0f0f0;color:#333}
.star-btn.starred{color:#FAAD14}
.topbar-left :deep(.n-breadcrumb){font-size:13px}

.search-trigger{
  display:flex;align-items:center;gap:6px;
  padding:5px 12px;border:1px solid #e0e0e0;border-radius:6px;
  cursor:pointer;font-size:13px;color:#999;transition:all .15s;
}
.search-trigger:hover{border-color:#07C160;color:#666}
.search-trigger kbd{padding:1px 5px;border:1px solid #ddd;border-radius:3px;font-size:11px;font-family:inherit;color:#bbb}
.tool-group{display:flex;gap:2px}
.user-info{display:flex;align-items:center;gap:6px;padding:3px 8px;border-radius:6px;cursor:pointer;transition:background .15s}
.user-info:hover{background:#f5f5f5}
.user-name{font-size:13px;font-weight:500;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.arrow{font-size:10px;color:#999}

/* 内容区 */
.content{flex:1;padding:24px;overflow-y:auto}

/* 标签页栏 — 紧贴导航栏下方，作为二级导航 */
.tabs-bar{
  display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:40px;
  background:#fff;border-bottom:1px solid #e8e8e8;flex-shrink:0;
}
.tabs-left{display:flex;gap:6px;align-items:center;flex:1;overflow-x:auto;scrollbar-width:none}
.tabs-left::-webkit-scrollbar{display:none}
.tabs-right{display:flex;align-items:center;gap:2px;margin-left:12px;flex-shrink:0}
.tab-chip{
  display:inline-flex;align-items:center;gap:5px;padding:0 10px;
  height:28px;border-radius:6px;font-size:13px;color:#666;cursor:pointer;
  white-space:nowrap;background:transparent;border:none;transition:all .18s;
  line-height:28px;vertical-align:middle;
}
.tab-chip:hover{background:#f0f0f0;color:#333}
.tab-chip.active{color:#1890FF;background:#E6F7FF;font-weight:500}
.tc-icon{font-size:13px;line-height:1}
.tc-label{font-size:13px;cursor:pointer;line-height:1}
.tc-close{
  margin-left:-2px;font-size:14px;opacity:.45;line-height:1;width:16px;text-align:center;border-radius:3px;
  cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
}
.tc-close:hover{opacity:1;background:#ddd;color:#333}

/* 标签页右侧工具按钮 */
.tb-tool{
  width:28px;height:28px;border:none;background:transparent;border-radius:4px;
  cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;
  color:#999;transition:all .15s;
}
.tb-tool:hover{background:#f0f0f0;color:#555}

/* 搜索弹窗 */
.search-results{margin-top:12px;max-height:300px;overflow-y:auto}
.search-result-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:6px;cursor:pointer}
.search-result-item:hover{background:#f5f5f5}
.sr-tag{padding:2px 8px;border-radius:4px;font-size:11px;background:#E6F7FF;color:#1890FF}
.sr-title{flex:1;font-size:14px;font-weight:500}
.sr-sub{font-size:12px;color:#999;white-space:nowrap}
.search-empty,.search-hint{text-align:center;padding:32px 0;color:#999;font-size:13px}
.sh-row{padding:4px 0;font-size:12px;color:#bbb}
.sk{display:inline-block;padding:1px 6px;background:#f0f0f0;border-radius:3px;font-size:11px;margin-right:4px}
</style>
