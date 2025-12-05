/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_UPSTOX_ACCESS_TOKEN: string
    readonly VITE_UPSTOX_API_KEY: string
    readonly VITE_UPSTOX_API_SECRET: string
    readonly VITE_UPSTOX_REDIRECT_URI: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_ADSENSE_CLIENT_ID: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
