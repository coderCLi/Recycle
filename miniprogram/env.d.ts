// 在代码中获取这些以 VITE_ 为前缀的用户自定义环境变量的 TypeScript 智能提示

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string,
    // readonly VITE_API_URL: string
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

