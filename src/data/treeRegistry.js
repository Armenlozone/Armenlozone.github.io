async function safeModuleLoad(loader, slug, type) {
    try {
        const loadedModule = await loader();
        return loadedModule?.default ?? loadedModule ?? null;
    } catch (error) {
        console.warn(`Failed to load ${type}: ${slug}`, error);
        return null;
    }
}

export const treeRegistry = {
    "PkBd": () => import("../pages/TechTrees/TreePages/Gr_PkBd/Gr_PkBd"),//"../pages/TechTrees/TreePages/Gr_PkBd/Gr_PkBd.js"),
};

export async function loadTree(slug) {
    const loader = treeRegistry?.[slug];

    if (!loader) {
        return null;
    }

    return safeModuleLoad(loader, slug, "tech tree");
}