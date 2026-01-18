// ====== State ======
let POSTS = [];
let activeTag = null;

// ====== DOM ======
const app = document.getElementById("app");
const yearEl = document.getElementById("year");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

yearEl.textContent = new Date().getFullYear();

// ====== Theme Toggle ======
function getStoredTheme() {
  return localStorage.getItem("theme") || "dark";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const icon = themeToggle?.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// Initialize theme
setTheme(getStoredTheme());

themeToggle?.addEventListener("click", () => {
  const current = getStoredTheme();
  setTheme(current === "dark" ? "light" : "dark");
});

// ====== Utilities ======
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentQuery() {
  return (searchInput?.value || "").trim().toLowerCase();
}

// ====== Tag Filtering ======
function setActiveTag(tag) {
  activeTag = activeTag === tag ? null : tag;
  renderIndex();
}

// Make it available globally for onclick
window.setActiveTag = setActiveTag;

// ====== Render ======
function renderIndex() {
  const q = currentQuery();

  const filtered = POSTS.filter((p) => {
    // Filter by active tag
    if (activeTag && !p.tags.includes(activeTag)) {
      return false;
    }
    // Filter by search query
    if (!q) return true;
    const hay = `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.date}`.toLowerCase();
    return hay.includes(q);
  });

  // Get all unique tags
  const allTags = [...new Set(POSTS.flatMap((p) => p.tags))].sort();

  app.innerHTML = `
    <section class="card">
      <h1 class="h1">Blog</h1>
      <p class="muted">Technical posts on statistics, AI, and mathematics</p>
      <div class="hr"></div>

      <!-- Tag Filter -->
      <div class="tag-filter">
        <span class="muted small">Filter by tag:</span>
        <div class="badges">
          ${allTags
            .map(
              (t) => `
              <button
                class="badge badge--clickable ${activeTag === t ? "badge--active" : ""}"
                onclick="setActiveTag('${escapeHtml(t)}')"
              >
                ${escapeHtml(t)}
              </button>
            `
            )
            .join("")}
          ${activeTag ? `<button class="badge badge--clear" onclick="setActiveTag(null)">✕ Clear</button>` : ""}
        </div>
      </div>

      <div class="hr"></div>

      ${filtered.length === 0 ? `<p class="muted">No posts matched.</p>` : ""}

      <div class="grid">
        ${filtered
          .map(
            (p) => `
              <article class="card">
                <h2 class="h2">
                  <a href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a>
                </h2>
                <div class="post-meta">
                  <span class="muted small">${escapeHtml(p.date)}</span>
                  <span class="muted small">·</span>
                  <span class="muted small">${p.readingTime || 3} min read</span>
                </div>
                <p class="muted">${escapeHtml(p.excerpt)}</p>
                <div class="badges">
                  ${p.tags.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

// Search filters the index list
searchInput?.addEventListener("input", renderIndex);

// ====== Load Posts & Initialize ======
async function init() {
  try {
    const response = await fetch("./posts.json");
    POSTS = await response.json();
  } catch (e) {
    console.warn("Could not load posts.json, using fallback");
    POSTS = [];
  }
  renderIndex();
}

init();
