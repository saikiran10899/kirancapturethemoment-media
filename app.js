(function () {
  var data = window.PORTFOLIO || { settings: {}, categories: [] };
  var S = data.settings;

  // When this page is served from the Netlify link, the photos and videos live on
  // GitHub; ASSET_ROOT (set by that page) points every file path there.
  var ROOT = window.ASSET_ROOT || "";
  function at(p) { return p && ROOT && !/^https?:/.test(p) ? ROOT + p : p; }
  ["logo", "hero_image", "intro_video"].forEach(function (k) { S[k] = at(S[k]); });
  data.categories.forEach(function (c) {
    c.cover = at(c.cover);
    c.items.forEach(function (it) { it.src = at(it.src); it.thumb = at(it.thumb); });
  });
  var app = document.getElementById("app");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function count(cat) {
    var v = 0, p = 0;
    cat.items.forEach(function (it) { it.type === "photo" ? p++ : v++; });
    var out = [];
    if (v) out.push(v + (v === 1 ? " film" : " films"));
    if (p) out.push(p + (p === 1 ? " photo" : " photos"));
    return out.join(" · ");
  }
  function mmss(sec) {
    if (!sec) return "";
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  var ICONS = {
    whatsapp: '<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M8.8 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.5.9 1.5 1.9 2.5 2.4.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .5-.2 1.2-.7 1.5-.6.4-1.5.6-2.7.1-1.8-.7-3.4-2.3-4.2-3.9-.6-1.1-.4-2.1-.1-2.4z"/>',
    phone: '<path d="M6.6 3.5h2.6l1.3 4.2-2 1.4a11 11 0 0 0 6.4 6.4l1.4-2 4.2 1.3v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'
  };
  function icon(name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }
  function contactChips() {
    var c = [];
    var wa = (S.whatsapp || "").replace(/[^\d]/g, "");
    if (wa) c.push('<a class="chip primary" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">' + icon("whatsapp") + "WhatsApp</a>");
    if (S.phone) c.push('<a class="chip" href="tel:' + esc(S.phone.replace(/[^\d+]/g, "")) + '">' + icon("phone") + "Call</a>");
    if (S.email) c.push('<a class="chip" href="mailto:' + esc(S.email) + '">' + icon("email") + "Email</a>");
    if (S.instagram) {
      // accepts a full profile link or just the @handle
      var ig = /^https?:\/\//.test(S.instagram) ? S.instagram
        : "https://www.instagram.com/" + S.instagram.replace(/^@/, "");
      c.push('<a class="chip" href="' + esc(ig) + '" target="_blank" rel="noopener">' + icon("instagram") + "Instagram</a>");
    }
    if (S.youtube) c.push('<a class="chip" href="' + esc(S.youtube) + '" target="_blank" rel="noopener">' + icon("youtube") + "YouTube</a>");
    return c.length ? '<div class="contact">' + c.join("") + "</div>" : "";
  }
  function footer() {
    return "<footer>" + (S.logo ? '<img class="logo-small" src="' + esc(S.logo) + '" alt="' + esc(S.company_name) + '">'
        : '<div class="brand">' + esc(S.company_name) + "</div>") +
      (S.website_footer ? "<div>" + esc(S.website_footer) + "</div>" : "") +
      contactChips() + "</footer>";
  }

  function renderHome() {
    document.title = S.company_name || "Portfolio";
    var tiles = data.categories.map(function (c) {
      return '<a class="tile" href="#/' + c.slug + '">' +
        '<img src="' + esc(c.cover) + '" alt="" loading="lazy">' +
        '<div class="tile-label"><strong>' + esc(c.name) + "</strong><small>" + count(c) + "</small></div></a>";
    }).join("");
    app.innerHTML =
      '<header class="hero">' +
        (S.hero_image ? '<div class="hero-bg" style="background-image:url(\'' + esc(S.hero_image) + '\')"></div>' : "") +
        '<div class="hero-inner">' +
          (S.logo ? '<img class="logo" src="' + esc(S.logo) + '" alt="">' : "") +
          '<div class="eyebrow">' + esc(S.tagline) + "</div>" +
          "<h1" + (S.logo ? ' class="sr-only"' : "") + ">" + esc(S.company_name) + "</h1>" +
          (S.about ? '<p class="about">' + esc(S.about) + "</p>" : "") +
          contactChips() +
        "</div>" +
      "</header>" +
      '<main class="section"><div class="section-head"><h2>Our Work</h2><span>Tap a folder</span></div>' +
      (tiles ? '<div class="tiles">' + tiles + "</div>" : '<p class="empty">New work coming soon.</p>') +
      "</main>" + footer();
  }

  function cardClass(it) {
    if (it.type === "photo") return it.h > it.w * 1.15 ? "card tall" : "card";
    return it.h > it.w ? "card tall" : "card wide";
  }

  function renderCategory(cat) {
    document.title = cat.name + " · " + (S.company_name || "");
    var cards = cat.items.map(function (it, i) {
      var isVideo = it.type !== "photo";
      return '<button class="' + cardClass(it) + '" data-i="' + i + '" aria-label="' + esc(it.title) + '">' +
        '<img src="' + esc(it.thumb) + '" alt="" loading="lazy" onload="this.classList.add(\'loaded\')">' +
        (isVideo ? '<span class="play"></span><span class="meta"><b>' + esc(it.title) + "</b><i>" + mmss(it.duration) + "</i></span>" : "") +
        "</button>";
    }).join("");
    app.innerHTML =
      '<nav class="topbar"><a class="back" href="#/">All work</a><a class="brand-small" href="#/">' + (S.logo ? '<img src="' + esc(S.logo) + '" alt="' + esc(S.company_name) + '">' : esc(S.company_name)) + "</a></nav>" +
      '<div class="cat-head"><div class="eyebrow">' + count(cat) + "</div><h1>" + esc(cat.name) + "</h1></div>" +
      '<div class="grid">' + cards + "</div>" + footer();
    app.querySelectorAll(".card").forEach(function (el) {
      el.addEventListener("click", function () { openViewer(cat, +el.dataset.i); });
    });
    window.scrollTo(0, 0);
  }

  function route() {
    closeViewer(true);
    var slug = location.hash.replace(/^#\/?/, "");
    var cat = data.categories.filter(function (c) { return c.slug === slug; })[0];
    if (cat) renderCategory(cat); else { renderHome(); window.scrollTo(0, 0); }
  }

  // ---------- full-screen viewer ----------
  var viewer = document.getElementById("viewer");
  var stage = document.getElementById("viewer-stage");
  var current = null, index = 0;

  function openViewer(cat, i) {
    current = cat; index = i;
    viewer.hidden = false;
    document.body.style.overflow = "hidden";
    show();
  }
  function closeViewer(silent) {
    if (viewer.hidden) return;
    stage.innerHTML = "";
    viewer.hidden = true;
    document.body.style.overflow = "";
    current = null;
  }
  function show() {
    var it = current.items[index];
    var html;
    if (it.type === "photo") {
      html = '<img src="' + esc(it.src) + '" alt="' + esc(it.title) + '">';
    } else if (it.type === "video") {
      html = '<video src="' + esc(it.src) + '" poster="' + esc(it.thumb) + '" controls autoplay playsinline preload="metadata"></video>';
    } else {
      var url = it.provider === "youtube"
        ? "https://www.youtube-nocookie.com/embed/" + it.id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        : "https://player.vimeo.com/video/" + it.id + "?autoplay=1" + (it.hash ? "&h=" + it.hash : "");
      html = '<div class="embed-box' + (it.h > it.w ? " vertical" : "") + '"><iframe src="' + url +
        '" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe></div>';
    }
    stage.innerHTML = html;
    document.getElementById("viewer-title").textContent = it.type === "photo" ? "" : it.title;
    document.getElementById("viewer-count").textContent = (index + 1) + " / " + current.items.length;
    document.getElementById("viewer-prev").disabled = index === 0;
    document.getElementById("viewer-next").disabled = index === current.items.length - 1;
    // preload neighbouring photos
    [index - 1, index + 1].forEach(function (j) {
      var n = current.items[j];
      if (n && n.type === "photo") (new Image()).src = n.src;
    });
  }
  function step(d) {
    if (!current) return;
    var j = index + d;
    if (j < 0 || j >= current.items.length) return;
    index = j; show();
  }
  document.getElementById("viewer-close").onclick = function () { closeViewer(); };
  document.getElementById("viewer-prev").onclick = function () { step(-1); };
  document.getElementById("viewer-next").onclick = function () { step(1); };
  document.addEventListener("keydown", function (e) {
    if (viewer.hidden) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  // swipe left/right to move, swipe down to close
  var sx = 0, sy = 0;
  stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) && current && current.items[index].type === "photo") closeViewer();
  }, { passive: true });

  // ---------- logo intro (home page, once per visit, tap to skip) ----------
  function playIntro() {
    if (!S.intro_video || location.hash.replace(/^#\/?/, "")) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try { if (sessionStorage.getItem("introSeen")) return; sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    var box = document.createElement("div");
    box.className = "intro";
    box.innerHTML = '<video muted playsinline autoplay preload="auto" src="' + esc(S.intro_video) + '"></video><span>Tap to skip</span>';
    document.body.appendChild(box);
    var v = box.querySelector("video"), done = false;
    function finish() {
      if (done) return;
      done = true;
      box.classList.add("out");
      setTimeout(function () { box.remove(); }, 700);
    }
    v.addEventListener("ended", finish);
    v.addEventListener("error", finish);
    box.addEventListener("click", finish);
    setTimeout(finish, 5000); // never block the site
    var p = v.play();
    if (p && p.catch) p.catch(finish); // e.g. phone in low-power mode
  }

  window.addEventListener("hashchange", route);
  route();
  playIntro();
})();
