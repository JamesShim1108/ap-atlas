import { escapeHtml as esc } from "./ui.js";

export function renderBlocks(blocks, assets = {}) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${esc(block.text)}</p>`;
        case "callout":
          return `<aside class="note"><strong>${esc(block.title)}</strong> ${esc(block.text)}</aside>`;
        case "list": {
          const tag = block.ordered ? "ol" : "ul";
          return `<${tag}>${block.items.map((item) => `<li>${esc(item)}</li>`).join("")}</${tag}>`;
        }
        case "table":
          return renderTable(block);
        case "image":
          return renderImage(block, assets[block.assetId]);
        default:
          throw new Error(`Unsupported content block: ${block.type}`);
      }
    })
    .join("\n");
}

export function renderTable({ caption, columns, rows }) {
  return `<div class="table-wrap" role="region" tabindex="0" aria-label="${esc(caption)}">
    <table><caption>${esc(caption)}</caption>
      <thead><tr>${columns.map((column) => `<th scope="col">${esc(column)}</th>`).join("")}</tr></thead>
      <tbody>${rows
        .map(
          (row) =>
            `<tr><th scope="row">${esc(row[0])}</th>${row
              .slice(1)
              .map((cell) => `<td>${esc(cell)}</td>`)
              .join("")}</tr>`,
        )
        .join("")}</tbody>
    </table>
  </div>`;
}

function assetUrl(path) {
  // Base this on the module, so /page-one/ and a future custom domain both work.
  return new URL(`../${path}`, import.meta.url).href;
}

export function renderImage(block, asset) {
  if (!asset) throw new Error(`Missing image: ${block.assetId}`);
  const src = assetUrl(asset.file);
  const variants = [...(asset.variants || []), { file: asset.file, width: asset.width }];
  const unique = [
    ...new Map(variants.map((variant) => [variant.width, variant])).values(),
  ].sort((a, b) => a.width - b.width);
  const srcset = unique
    .map((variant) => `${assetUrl(variant.file)} ${variant.width}w`)
    .join(", ");
  return `<figure class="lesson-figure">
    <a class="lesson-figure__enlarge" href="${esc(src)}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size image: ${esc(asset.title)}" title="Open full-size image">
      <img src="${esc(src)}" srcset="${esc(srcset)}" sizes="(max-width: 700px) calc(100vw - 88px), 650px"
        width="${asset.width}" height="${asset.height}" alt="${esc(block.alt)}" loading="lazy" decoding="async">
    </a>
    <figcaption>${esc(block.caption)}
      <small><a href="${esc(asset.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(asset.creator)}</a>
      / ${asset.licenseUrl ? `<a href="${esc(asset.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(asset.license)}</a>` : esc(asset.license)}</small>
    </figcaption>
  </figure>`;
}
