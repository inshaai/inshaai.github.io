// ====== Content ======
const POSTS = [
  {
    id: "welcome",
    title: "Welcome",
    date: "2026-01-16",
    tags: ["meta"],
    excerpt: "What this site is and what I will publish here.",
    url: "./posts/2026-01-16-welcome/", // folder contains index.html
  },
  {
    id: "linear-regression",
    title: "Linear Regression From Scratch",
    date: "2026-01-16",
    tags: ["meta"],
    excerpt: "Let's implement Linear Regression from scratch.",
    url: "./posts/2026-01-16-linear-regression-from-scratch/", // folder contains index.html
  },
  {
    id: "workflow",
    title: "My writing workflow",
    date: "2026-01-15",
    tags: ["emacs", "org-mode"],
    excerpt: "How I draft, revise, and publish posts.",
    url: "./posts/2026-01-15-my-workflow/",
  },

];

// ====== DOM ======
const app = document.getElementById("app");
const yearEl = document.getElementById("year");
const searchInput = document.getElementById("searchInput");

yearEl.textContent = new Date().getFullYear();

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

// ====== View: Index only ======
function renderIndex() {
  const q = currentQuery();

  const filtered = POSTS.filter((p) => {
    if (!q) return true;
    const hay = `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.date}`.toLowerCase();
    return hay.includes(q);
  });

  app.innerHTML = `
    <section class="card">
      <h1 class="h1">Blog</h1>
      <p class="muted">Posts</p>
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
                <div class="muted small">${escapeHtml(p.date)}</div>
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

// Initial render
renderIndex();
