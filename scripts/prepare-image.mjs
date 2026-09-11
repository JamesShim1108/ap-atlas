import { mkdir, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/** Create web-sized copies without changing the original. */
export async function prepareImage(input, outputDirectory, name) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(
      "Choose a lowercase image name with hyphens, such as song-rice-fields.",
    );
  }
  // Apply camera orientation before measuring or resizing.
  const oriented = await sharp(input).rotate().toBuffer();
  const metadata = await sharp(oriented).metadata();
  if (!Number.isInteger(metadata.width) || !Number.isInteger(metadata.height)) {
    throw new Error("The input must be a readable bitmap image with pixel dimensions.");
  }
  const maximum = Math.min(metadata.width, 1600);
  const widths = [...new Set([640, 1200, maximum].filter((width) => width <= maximum))];
  await mkdir(outputDirectory, { recursive: true });
  const files = widths.map((width) => ({
    width,
    path: join(outputDirectory, `${name}-${width}.webp`),
  }));
  for (const file of files) {
    try {
      await access(file.path);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    throw new Error(
      `Already exists: ${file.path}. Choose another name or remove that copy first.`,
    );
  }
  const variants = [];
  for (const file of files) {
    const result = await sharp(oriented)
      .resize({ width: file.width, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(file.path);
    variants.push({
      file: `${name}-${file.width}.webp`,
      width: result.width,
      height: result.height,
    });
  }
  variants.sort((a, b) => a.width - b.width);
  return { ...variants.pop(), variants };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [input, outputDirectory, name] = process.argv.slice(2);
  if (!input || !outputDirectory || !name) {
    throw new Error(
      "Usage: npm run image -- input.png output-directory descriptive-name",
    );
  }
  const result = await prepareImage(input, outputDirectory, name);
  console.log(JSON.stringify(result, null, 2));
  console.log(
    "Add these files to assets.js with the title, creator, source URL, and license. Paths are relative to assets.js.",
  );
}
