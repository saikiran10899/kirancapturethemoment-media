(function () {
  var data = window.PORTFOLIO || { settings: {}, categories: [] };
  var S = data.settings;

  // When this page is served from the Netlify link, the photos and videos live on
  // GitHub; ASSET_ROOT (set by that page) points every file path there.
  var ROOT = window.ASSET_ROOT || "";
  function at(p) { return p && ROOT && !/^https?:/.test(p) ? ROOT + p : p; }
  ["logo", "hero_image", "hero_video", "intro_video"].forEach(function (k) { S[k] = at(S[k]); });
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
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'
  };
  function icon(name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }
  function contactChips() {
    var c = [];
    var wa = (S.whatsapp || "").replace(/[^\d]/g, "");
    if (wa) c.push('<a class="chip" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">' + icon("whatsapp") + "WhatsApp</a>");
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
      (location.hash.indexOf("book") < 0 ? '<div class="cta">' + bookButton() + "</div>" : "") +
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
        (S.hero_video && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)
          ? '<video class="hero-video" src="' + esc(S.hero_video) + '" poster="' + esc(S.hero_image) + '" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>' : "") +
        '<div class="hero-inner">' +
          (S.logo ? '<img class="logo" src="' + esc(S.logo) + '" alt="">' : "") +
          '<div class="eyebrow">' + esc(S.tagline) + "</div>" +
          "<h1" + (S.logo ? ' class="sr-only"' : "") + ">" + esc(S.company_name) + "</h1>" +
          (S.about ? '<p class="about">' + esc(S.about) + "</p>" : "") +
          '<div class="cta">' + bookButton() + "</div>" +
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
      // photos keep their own shape so collages and text are never cut off
      var shape = it.type === "photo" && it.w && it.h ? ' style="aspect-ratio:' + it.w + "/" + it.h + '"' : "";
      return '<button class="' + cardClass(it) + '"' + shape + ' data-i="' + i + '" aria-label="' + esc(it.title) + '">' +
        '<img src="' + esc(it.thumb) + '" alt="" loading="lazy" onload="this.classList.add(\'loaded\')">' +
        (isVideo ? '<span class="play"></span><span class="meta"><b>' + esc(it.title) + "</b><i>" + mmss(it.duration) + "</i></span>" : "") +
        "</button>";
    }).join("");
    app.innerHTML =
      '<nav class="topbar"><a class="back" href="#/">All work</a><a class="brand-small" href="#/">' + (S.logo ? '<img src="' + esc(S.logo) + '" alt="' + esc(S.company_name) + '">' : esc(S.company_name)) + "</a></nav>" +
      '<div class="cat-head"><div class="eyebrow">' + count(cat) + "</div><h1>" + esc(cat.name) + "</h1></div>" +
      '<div class="grid' + (cat.items.every(function (it) { return it.type === "photo"; }) ? " masonry" : "") + '">' +
      cards + "</div>" +
      '<section class="cta-band"><h2>Love what you see?</h2><p>Tell us your date — we\'ll send availability and packages.</p>' + bookButton("Check your date") + "</section>" +
      footer();
    app.querySelectorAll(".card").forEach(function (el) {
      el.addEventListener("click", function () { openViewer(cat, +el.dataset.i); });
    });
    window.scrollTo(0, 0);
  }

  // ---------- booking enquiry ----------
  function bookButton(label) {
    return '<a class="book-btn" href="#/book">' + icon("calendar") + esc(label || "Book Us · Check Availability") + "</a>";
  }
  function options(list, placeholder) {
    return '<option value="" disabled selected>' + esc(placeholder) + "</option>" +
      (list || []).map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("");
  }
  function field(label, html, hint) {
    return '<label class="field"><span>' + label + "</span>" + html + (hint ? "<small>" + esc(hint) + "</small>" : "") + "</label>";
  }

  function renderBook() {
    document.title = "Book Us · " + (S.company_name || "");
    var today = new Date().toISOString().slice(0, 10);
    var services = (S.booking_services || []).map(function (s) {
      return '<label class="pill"><input type="checkbox" name="services" value="' + esc(s) + '"><span>' + esc(s) + "</span></label>";
    }).join("");
    app.innerHTML =
      '<nav class="topbar"><a class="back" href="#/">All work</a><a class="brand-small" href="#/">' + (S.logo ? '<img src="' + esc(S.logo) + '" alt="' + esc(S.company_name) + '">' : esc(S.company_name)) + "</a></nav>" +
      '<div class="cat-head"><div class="eyebrow">Booking enquiry</div><h1>Let\'s capture your moments</h1>' +
      '<p class="about">Tell us about your celebration and we\'ll send availability and packages. ' + esc(S.booking_reply_note || "") + "</p></div>" +
      '<form class="book-form" novalidate>' +
        '<div class="row">' +
          field("Your name *", '<input name="name" required autocomplete="name">') +
          field("Partner / family name", '<input name="partner_name" autocomplete="off">') +
        "</div>" +
        '<div class="row">' +
          field("Phone *", '<input name="phone" type="tel" required autocomplete="tel" inputmode="tel">') +
          field("Email *", '<input name="email" type="email" required autocomplete="email">') +
        "</div>" +
        '<div class="row">' +
          field("Event type *", '<select name="event_type" required>' + options(S.booking_event_types, "Choose…") + "</select>") +
          field("Event date *", '<input name="event_date" type="date" required min="' + today + '">', "Main day — add other days below") +
        "</div>" +
        field("City / venue *", '<input name="venue" required placeholder="e.g. St. Louis, MO — venue name if booked">') +
        '<div class="field"><span>Services you\'re interested in</span><div class="pills">' + services + "</div></div>" +
        '<div class="row">' +
          field("Guests (approx.)", '<select name="guests">' + options(["Under 100", "100 – 250", "250 – 500", "500+"], "Choose…") + "</select>") +
          field("Budget", '<select name="budget">' + options(S.booking_budgets, "Choose…") + "</select>") +
        "</div>" +
        field("How did you hear about us?", '<select name="heard_from">' + options(["Instagram", "YouTube", "Friend / family", "Google", "Saw us at an event", "Other"], "Choose…") + "</select>") +
        field("Tell us more", '<textarea name="message" rows="4" placeholder="Other event days (haldi, sangeet…), timings, ideas, questions"></textarea>') +
        '<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off">' +
        '<p class="form-error" hidden></p>' +
        '<button type="submit" class="book-btn submit">' + icon("calendar") + "Send enquiry</button>" +
        '<p class="fine">Prefer to chat? ' + (S.whatsapp ? '<a href="https://wa.me/' + esc(S.whatsapp.replace(/[^\d]/g, "")) + '" target="_blank" rel="noopener">WhatsApp us</a>' : "") +
          (S.email ? ' or email <a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>" : "") + "</p>" +
      "</form>" + footer();
    app.querySelector(".book-form").addEventListener("submit", submitBooking);
    window.scrollTo(0, 0);
  }

  function submitBooking(e) {
    e.preventDefault();
    var form = e.target, err = form.querySelector(".form-error"), btn = form.querySelector(".submit");
    var missing = [].filter.call(form.querySelectorAll("[required]"), function (el) { return !el.value.trim(); });
    var email = form.email.value.trim();
    if (missing.length || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      err.textContent = missing.length ? "Please fill in the fields marked *." : "Please check your email address.";
      err.hidden = false;
      (missing[0] || form.email).focus();
      return;
    }
    err.hidden = true;
    var services = [].map.call(form.querySelectorAll('[name=services]:checked'), function (c) { return c.value; }).join(", ");
    var d = {
      "Name": form.name.value.trim(), "Partner / family": form.partner_name.value.trim(),
      "Phone": form.phone.value.trim(), "Email": email,
      "Event type": form.event_type.value, "Event date": form.event_date.value, "City / venue": form.venue.value.trim(),
      "Services": services, "Guests": form.guests.value, "Budget": form.budget.value,
      "Heard about us": form.heard_from.value, "Message": form.message.value.trim()
    };
    if (d["Event date"]) { // 2027-03-14 -> March 14, 2027 (read as a local date, not UTC)
      var dt = new Date(d["Event date"] + "T12:00:00");
      d["Event date"] = dt.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
    }
    var subject = "Booking enquiry: " + d["Event type"] + " on " + d["Event date"] + " — " + d["Name"];

    if (!S.web3forms_key && !S.formsubmit) { // no form service connected yet: open the client's mail app instead
      var body = Object.keys(d).filter(function (k) { return d[k]; }).map(function (k) { return k + ": " + d[k]; }).join("\n");
      location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      return thanks(form, d);
    }
    btn.disabled = true;
    btn.lastChild.textContent = "Sending…";
    // Web3Forms (with a key) or FormSubmit (free, no sign-up) emails the enquiry to our inbox
    var url, payload;
    if (S.web3forms_key) {
      url = "https://api.web3forms.com/submit";
      payload = { access_key: S.web3forms_key, subject: subject, from_name: d["Name"] + " (website)", replyto: email, botcheck: form.botcheck.checked };
    } else {
      url = "https://formsubmit.co/ajax/" + S.email;
      payload = { _subject: subject, _replyto: email, _template: "table", _captcha: "false", _honey: form.botcheck.checked ? "bot" : "" };
    }
    Object.keys(d).forEach(function (k) { if (d[k]) payload[k] = d[k]; });
    fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (!(res.success === true || res.success === "true")) throw new Error(res.message);
      thanks(form, d);
    }).catch(function () {
      btn.disabled = false;
      btn.lastChild.textContent = "Send enquiry";
      err.innerHTML = "Sorry, that didn't go through. Please try again, or " +
        (S.whatsapp ? '<a href="https://wa.me/' + esc(S.whatsapp.replace(/[^\d]/g, "")) + '">WhatsApp us</a>.' : "email us.");
      err.hidden = false;
    });
  }

  function thanks(form, d) {
    form.outerHTML = '<div class="thanks"><div class="tick">✓</div><h2>Thank you, ' + esc(d["Name"].split(" ")[0]) + "!</h2>" +
      "<p>We've received your enquiry for <b>" + esc(d["Event type"]) + "</b> on <b>" + esc(d["Event date"]) + "</b>. " +
      esc(S.booking_reply_note || "") + "</p>" +
      '<a class="book-btn" href="#/">See more of our work</a></div>';
    window.scrollTo(0, 0);
  }

  function route() {
    closeViewer(true);
    var slug = location.hash.replace(/^#\/?/, "");
    if (slug === "book") return renderBook();
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
