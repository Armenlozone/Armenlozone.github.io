const articleImageModules = import.meta.glob(
    "../pages/Articles/ArticlePages/**/assets/*",
    { eager: true, query: "?url", import: "default" }
);

export const missingImage = "/missing-image.svg";

export function getArticleImage(articleDirectory, filename) {
    const modulePath = `../pages/Articles/ArticlePages/${articleDirectory}/assets/${filename}`;
    return articleImageModules[modulePath] || missingImage;
}