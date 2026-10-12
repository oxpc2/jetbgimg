"use strict";

const catalogUrl = new URL("index.json", window.location.href);
const form = document.querySelector("#wallpaper-form");
const gallery = document.querySelector("#gallery");
const emptyState = document.querySelector("#empty-state");
const countLabel = document.querySelector("#wallpaper-count");
const statusLabel = document.querySelector("#catalog-status");
let catalog = { version: 1, images: [] };

function safeUrl(value) {
  const url = new URL(value, catalogUrl);
  if (url.protocol !== "https:" && url.origin !== window.location.origin) {
    throw new Error("Use an HTTPS image URL or a file path in this catalog.");
  }
  return url.href;
}

function setStatus(message, isError = false) {
  statusLabel.textContent = message;
  statusLabel.classList.toggle("error", isError);
}

function renderCatalog() {
  gallery.replaceChildren();
  countLabel.textContent = `${catalog.images.length} ${catalog.images.length === 1 ? "image" : "images"}`;
  emptyState.hidden = catalog.images.length > 0;

  catalog.images.forEach((wallpaper, index) => {
    const card = document.createElement("article");
    card.className = "wallpaper-card";
    const image = document.createElement("img");
    image.src = safeUrl(wallpaper.thumbnail || wallpaper.image);
    image.alt = wallpaper.name;
    image.loading = "lazy";
    const footer = document.createElement("footer");
    const text = document.createElement("div");
    const title = document.createElement("p");
    title.className = "wallpaper-title";
    title.textContent = wallpaper.name;
    const credit = document.createElement("p");
    credit.className = "wallpaper-credit";
    credit.textContent = wallpaper.author || wallpaper.image;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${wallpaper.name}`);
    remove.addEventListener("click", () => {
      catalog.images.splice(index, 1);
      renderCatalog();
      setStatus("Catalog edited. Download index.json and publish the updated file.");
    });
    text.append(title, credit);
    footer.append(text, remove);
    card.append(image, footer);
    gallery.append(card);
  });
}

async function loadCatalog() {
  try {
    const response = await fetch(catalogUrl, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Catalog request failed (HTTP ${response.status}).`);
    const data = await response.json();
    if (data.version !== 1 || !Array.isArray(data.images)) {
      throw new Error("Expected a version 1 catalog with an images array.");
    }
    catalog = { version: 1, images: data.images };
    setStatus("Catalog loaded. Changes stay in this browser until you download and publish index.json.");
  } catch (error) {
    catalog = { version: 1, images: [] };
    setStatus(`${error.message} Starting with an empty catalog.`, true);
  }
  renderCatalog();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const image = String(data.get("image")).trim();
  const thumbnail = String(data.get("thumbnail")).trim();
  const entry = {
    id: crypto.randomUUID(),
    name: String(data.get("name")).trim(),
    image,
  };
  try {
    safeUrl(image);
    if (thumbnail) {
      safeUrl(thumbnail);
      entry.thumbnail = thumbnail;
    }
  } catch (error) {
    setStatus(error.message, true);
    return;
  }
  const author = String(data.get("author")).trim();
  if (author) entry.author = author;
  catalog.images.push(entry);
  form.reset();
  renderCatalog();
  setStatus("Catalog edited. Download index.json and publish the updated file.");
});

document.querySelector("#download-json").addEventListener("click", () => {
  const blob = new Blob([`${JSON.stringify(catalog, null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "index.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
  setStatus("Downloaded index.json. Replace the catalog file in your repository and publish it.");
});

loadCatalog();
