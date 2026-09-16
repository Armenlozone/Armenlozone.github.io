async function safeModuleLoad(loader, slug, type) {
    try {
        const loadedModule = await loader();
        return loadedModule?.default ?? loadedModule ?? null;
    } catch (error) {
        console.warn(`Failed to load ${type}: ${slug}`, error);
        return null;
    }
}

export const articleRegistry = {
    "skyguard-m": () => import("../pages/Articles/ArticlePages/SkyGuard-M/skyGuard-M.js"),
    "hfk-kv": () => import("../pages/Articles/ArticlePages/HFK-KV/hfk-kv.js"),
    "panther-ii": () => import("../pages/Articles/ArticlePages/Panther-II/panther-ii.js"),
};

export async function loadArticle(slug) {
    const loader = articleRegistry?.[slug];

    if (!loader) {
        return null;
    }

    return safeModuleLoad(loader, slug, "article");
}
