const app = document.querySelector("#app");
const data = window.LIBRARY_DATA;

const state = {
  query: "",
  routeId: localStorage.getItem("library-route") || "",
  chapterId: localStorage.getItem("library-chapter") || "",
  settings: JSON.parse(localStorage.getItem("library-settings") || '{"dark":false,"fontSize":18,"fontFamily":"sans"}')
};

function currentHash() {
  return location.hash.replace(/^#\/?/, "");
}

function saveSettings() {
  localStorage.setItem("library-settings", JSON.stringify(state.settings));
}

function applySettings() {
  document.body.classList.toggle("dark", state.settings.dark);
  document.body.classList.toggle("serif", state.settings.fontFamily === "serif");
  document.body.classList.toggle("kai", state.settings.fontFamily === "kai");
  document.documentElement.style.setProperty("--reader-size", `${state.settings.fontSize}px`);
}

function categoryById(id) {
  return data.categories.find((category) => category.id === id);
}

function bookById(id) {
  return data.books.find((book) => book.id === id);
}

function buildBookPayload(book) {
  if (book.id !== "shangjunshu") return { chapters: [] };
  return {
    chapters: window.SHANGJUN_BOOK.map((chapter) => {
      const explain = window.SHANGJUN_EXPLAIN[chapter.title] || {};
      return {
        ...chapter,
        summary: explain.summary || "",
        translation: explain.translation || [],
        terms: explain.terms || [],
        tension: explain.tension || "",
        route: book.routes.find((route) => route.chapters.includes(chapter.title))
      };
    })
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHome() {
  applySettings();
  const normalizedQuery = state.query.trim().toLowerCase();
  const books = data.books.filter((book) => {
    if (!normalizedQuery) return true;
    return [book.title, book.subtitle, book.description, ...(book.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  app.innerHTML = `
    <main class="library-home">
      <section class="hero">
        <div>
          <div class="eyebrow">${escapeHtml(data.site.subtitle)}</div>
          <h1>${escapeHtml(data.site.title)}</h1>
          <p>${escapeHtml(data.site.description)}</p>
        </div>
        <div class="home-tools">
          <input id="homeSearch" type="search" placeholder="搜索书名、标签或主题" value="${escapeHtml(state.query)}">
          <button id="homeDark" type="button">${state.settings.dark ? "浅色模式" : "暗黑模式"}</button>
        </div>
      </section>
      ${data.categories.map((category) => {
        const categoryBooks = books.filter((book) => book.categoryId === category.id);
        if (categoryBooks.length === 0) return "";
        return `
          <section class="category-section">
            <div class="category-head">
              <div>
                <h2>${escapeHtml(category.name)}</h2>
                <p>${escapeHtml(category.intro)}</p>
              </div>
              <span class="tag">${categoryBooks.length} 本</span>
            </div>
            <div class="book-grid">
              ${categoryBooks.map((book) => `
                <a class="book-card" href="#book/${book.id}">
                  <span class="cover-mark">${escapeHtml(book.coverMark)}</span>
                  <span>
                    <h3>${escapeHtml(book.title)}</h3>
                    <p>${escapeHtml(book.description)}</p>
                    <span class="tag-row">
                      ${(book.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                    </span>
                  </span>
                </a>
              `).join("")}
            </div>
          </section>
        `;
      }).join("")}
    </main>
  `;

  document.querySelector("#homeSearch").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderHome();
    document.querySelector("#homeSearch").focus();
  });
  document.querySelector("#homeDark").addEventListener("click", () => {
    state.settings.dark = !state.settings.dark;
    saveSettings();
    renderHome();
  });
}

function getRoute(book) {
  return book.routes.find((route) => route.id === state.routeId) || book.routes[0];
}

function getVisibleChapters(book, payload, route) {
  return route.chapters
    .map((title) => payload.chapters.find((chapter) => chapter.title === title))
    .filter(Boolean);
}

function getChapter(book, payload, route) {
  const visible = getVisibleChapters(book, payload, route);
  return visible.find((chapter) => chapter.id === state.chapterId) || visible[0] || payload.chapters[0];
}

function renderBook(book) {
  applySettings();
  const payload = buildBookPayload(book);
  const route = getRoute(book);
  const chapters = getVisibleChapters(book, payload, route);
  const chapter = getChapter(book, payload, route);
  state.routeId = route.id;
  state.chapterId = chapter.id;
  localStorage.setItem("library-route", state.routeId);
  localStorage.setItem("library-chapter", state.chapterId);

  app.innerHTML = `
    <div class="reader-layout">
      <aside class="reader-sidebar">
        <a class="back-link" href="#">返回图书馆</a>
        <div class="reader-brand">
          <div class="reader-mark">${escapeHtml(book.coverMark)}</div>
          <div>
            <h1>${escapeHtml(book.title)}</h1>
            <p>${escapeHtml(book.subtitle)}</p>
          </div>
        </div>
        <section class="settings">
          <label><span>暗黑模式</span><input id="darkMode" type="checkbox" ${state.settings.dark ? "checked" : ""}></label>
          <div class="setting-line">
            <span>字号</span>
            <span>
              <button id="fontMinus" type="button">A-</button>
              <button id="fontPlus" type="button">A+</button>
            </span>
          </div>
          <div class="setting-line">
            <span>字体</span>
            <select id="fontFamily">
              <option value="sans" ${state.settings.fontFamily === "sans" ? "selected" : ""}>清爽黑体</option>
              <option value="serif" ${state.settings.fontFamily === "serif" ? "selected" : ""}>宋体阅读</option>
              <option value="kai" ${state.settings.fontFamily === "kai" ? "selected" : ""}>楷体古书感</option>
            </select>
          </div>
        </section>
        <div class="route-list">
          ${book.routes.map((item) => `
            <button class="route-button ${item.id === route.id ? "active" : ""}" type="button" data-route="${item.id}">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.summary)}</span>
            </button>
          `).join("")}
        </div>
        <div class="chapter-list">
          ${chapters.map((item) => `
            <button class="chapter-button ${item.id === chapter.id ? "active" : ""}" type="button" data-chapter="${item.id}">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.volume)} · ${item.translation.length ? "已译" : "待补"}</span>
            </button>
          `).join("")}
        </div>
      </aside>
      <main class="reader-main">
        <section class="book-hero">
          <div>
            <div class="eyebrow">${escapeHtml(categoryById(book.categoryId)?.name || "图书")}</div>
            <h2>${escapeHtml(book.title)}</h2>
            <p>${escapeHtml(book.description)}</p>
            <div class="tag-row">
              ${(book.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
          <span class="tag">${escapeHtml(book.status)}</span>
        </section>
        <article class="chapter-panel">
          <header class="chapter-head">
            <div>
              <div class="chapter-meta">${escapeHtml(chapter.volume)} · ${escapeHtml(route.title)}</div>
              <h3>${escapeHtml(chapter.title)}</h3>
            </div>
            <span class="tag">${chapter.translation.length} 段译文</span>
          </header>
          <div class="chapter-body">
            <section class="section-card">
              <h4>完整白话译文</h4>
              <div class="translation-list">
                ${chapter.translation.map((paragraph, index) => `
                  <p><span>${index + 1}</span>${escapeHtml(paragraph)}</p>
                `).join("")}
              </div>
            </section>
            <section class="section-card">
              <h4>本章概览</h4>
              <p class="summary-copy">${escapeHtml(chapter.summary)}</p>
            </section>
            <section class="analysis-grid">
              <div class="section-card">
                <h4>关键词</h4>
                <ul class="terms-list">${chapter.terms.map((term) => `<li>${escapeHtml(term)}</li>`).join("")}</ul>
              </div>
              <div class="section-card">
                <h4>这一章的矛盾</h4>
                <p>${escapeHtml(chapter.tension)}</p>
              </div>
            </section>
            <section class="section-card notes">
              <h4>我的读书笔记</h4>
              <textarea id="noteBox" placeholder="写下这一章的理解、疑问或反驳。">${escapeHtml(localStorage.getItem(`library-note-${book.id}-${chapter.id}`) || "")}</textarea>
            </section>
          </div>
        </article>
      </main>
    </div>
  `;

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      state.routeId = button.dataset.route;
      state.chapterId = "";
      renderBook(book);
    });
  });
  document.querySelectorAll("[data-chapter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.chapterId = button.dataset.chapter;
      renderBook(book);
    });
  });
  document.querySelector("#darkMode").addEventListener("change", (event) => {
    state.settings.dark = event.target.checked;
    saveSettings();
    renderBook(book);
  });
  document.querySelector("#fontMinus").addEventListener("click", () => {
    state.settings.fontSize = Math.max(15, state.settings.fontSize - 1);
    saveSettings();
    applySettings();
  });
  document.querySelector("#fontPlus").addEventListener("click", () => {
    state.settings.fontSize = Math.min(24, state.settings.fontSize + 1);
    saveSettings();
    applySettings();
  });
  document.querySelector("#fontFamily").addEventListener("change", (event) => {
    state.settings.fontFamily = event.target.value;
    saveSettings();
    applySettings();
  });
  document.querySelector("#noteBox").addEventListener("input", (event) => {
    localStorage.setItem(`library-note-${book.id}-${chapter.id}`, event.target.value);
  });
}

function render() {
  const hash = currentHash();
  if (hash.startsWith("book/")) {
    const book = bookById(hash.split("/")[1]);
    if (book) {
      renderBook(book);
      return;
    }
  }
  renderHome();
}

window.addEventListener("hashchange", render);
render();
