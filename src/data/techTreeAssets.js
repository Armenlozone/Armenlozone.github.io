const treeImageModules = import.meta.glob(
  "../pages/TechTrees/TreePages/**/assets/*",
  { eager: true, query: "?url", import: "default" }
);

export const missingImage = "/missing-image.svg";

export function getImage(treeDirectory, filename) {
  const modulePath = `../pages/TechTrees/TreePages/${treeDirectory}/assets/${filename}`;
  return treeImageModules[modulePath] || missingImage;
}