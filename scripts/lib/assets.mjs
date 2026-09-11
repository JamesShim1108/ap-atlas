import { access, realpath } from "node:fs/promises";
import { resolve, relative, dirname, extname } from "node:path";
import sharp from "sharp";
import { requireValue, requireText, safeUrl, uniqueById } from "./validate.mjs";

// Manifest file paths are relative to their assets.js file, never the current page URL.
export async function loadAssets(records, manifestPath, docsRoot) {
  const assets = uniqueById(records, manifestPath);
  for (const asset of assets.values()) {
    for (const field of ["title", "creator", "license"])
      requireText(asset[field], `${manifestPath}.${asset.id}.${field}`);
    safeUrl(asset.sourceUrl, manifestPath);
    if (asset.licenseUrl) safeUrl(asset.licenseUrl, manifestPath);
    requireValue(
      Number.isInteger(asset.width) &&
        asset.width > 0 &&
        Number.isInteger(asset.height) &&
        asset.height > 0,
      manifestPath,
      "image dimensions must be positive integers",
    );
    const readFile = async (file, width, height) => {
      requireText(file, manifestPath);
      requireValue(
        !/^[a-z]+:/i.test(file),
        manifestPath,
        "image files must be local; keep source URLs in sourceUrl",
      );
      const path = resolve(dirname(manifestPath), file);
      await access(path);
      const actual = await realpath(path);
      const fromDocs = relative(await realpath(docsRoot), actual);
      requireValue(!fromDocs.startsWith(".."), manifestPath, "image must be inside docs");
      requireValue(
        /[.](avif|webp|png|jpe?g|gif)$/i.test(extname(path)),
        manifestPath,
        "use a bitmap image format",
      );
      const info = await sharp(actual).metadata();
      requireValue(
        info.width === width && info.height === height,
        manifestPath,
        `declared dimensions do not match ${file}`,
      );
      return fromDocs.split("\\").join("/");
    };
    asset.file = await readFile(asset.file, asset.width, asset.height);
    const widths = new Set();
    for (const variant of asset.variants || []) {
      requireValue(!widths.has(variant.width), manifestPath, "duplicate variant width");
      widths.add(variant.width);
      requireValue(
        Math.abs(variant.width / variant.height - asset.width / asset.height) < 0.02,
        manifestPath,
        "variants must preserve the original aspect ratio",
      );
      variant.file = await readFile(variant.file, variant.width, variant.height);
    }
  }
  return assets;
}

export function mergeAssets(...maps) {
  return uniqueById(
    maps.flatMap((map) => [...map.values()]),
    "asset IDs within a topic",
  );
}

export function usedAssets(blocks, assets) {
  return Object.fromEntries(
    blocks
      .filter((block) => block.type === "image")
      .map((block) => [block.assetId, assets.get(block.assetId)]),
  );
}
