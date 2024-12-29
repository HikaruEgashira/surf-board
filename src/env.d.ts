/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GITHUB_TOKEN: string | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
