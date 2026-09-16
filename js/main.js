(() => {
  "use strict";

  const C = window.WEDDING;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage blocked */ } }
  };

  /* ---------- SVG pieces ---------- */
  const LEAVES = [
    "M58 300 C 52 230, 70 150, 60 90 C 55 60, 62 30, 66 8",
    "M56 262 C 40 260, 24 248, 20 230 C 36 230, 50 242, 56 262 Z",
    "M58 228 C 74 224, 90 210, 94 192 C 78 194, 64 208, 58 228 Z",
    "M61 190 C 45 188, 30 176, 26 158 C 42 158, 56 170, 61 190 Z",
    "M62 152 C 78 148, 92 134, 95 116 C 80 118, 67 132, 62 152 Z",
    "M60 115 C 46 112, 34 100, 32 84 C 46 86, 57 98, 60 115 Z",
    "M59 80 C 72 76, 84 64, 86 48 C 73 51, 62 62, 59 80 Z",
    "M63 46 C 53 42, 45 32, 45 20 C 56 24, 62 34, 63 46 Z"
  ];
  const sprig = () =>
    `<svg class="sprig" viewBox="0 0 120 300" aria-hidden="true">${LEAVES.map((d, i) => `<path pathLength="1" style="--i:${i}" d="${d}"/>`).join("")}</svg>`;

  const ICONS = {
    rings: `<svg class="draw" viewBox="0 0 48 48" aria-hidden="true"><circle pathLength="1" cx="18" cy="30" r="12"/><circle pathLength="1" style="--i:1" cx="30" cy="30" r="12"/><path pathLength="1" style="--i:2" d="M24 4 l5 5 -5 7 -5 -7 z"/></svg>`,
    glass: `<svg class="draw" viewBox="0 0 48 48" aria-hidden="true"><g transform="rotate(-12 16 24)"><path pathLength="1" d="M10 8 h11 l-1.2 13 a4.3 4.3 0 0 1 -8.6 0 z"/><path pathLength="1" style="--i:1" d="M15.5 25.5 V41 M11 41 h9"/></g><g transform="rotate(12 32 24)"><path pathLength="1" style="--i:1" d="M27 8 h11 l-1.2 13 a4.3 4.3 0 0 1 -8.6 0 z"/><path pathLength="1" style="--i:2" d="M32.5 25.5 V41 M28 41 h9"/></g><path pathLength="1" style="--i:3" d="M24 1 v4 M18 3 l2 3 M30 3 l-2 3"/></svg>`,
    pin: `<svg class="draw" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M24 44 C 24 44, 10 31, 10 20 a14 14 0 0 1 28 0 C 38 31, 24 44, 24 44 z"/><circle pathLength="1" style="--i:1" cx="24" cy="20" r="5"/></svg>`,
    bed: `<svg class="draw" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M5 10 V40 M5 32 H43 V40 M5 26 H43 V32"/><path pathLength="1" style="--i:1" d="M10 26 V21 a3 3 0 0 1 3 -3 H22 a3 3 0 0 1 3 3 V26"/></svg>`,
    car: `<svg class="draw" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M6 32 V24 L12 14 H36 L42 24 V32 Z M6 24 H42"/><circle pathLength="1" style="--i:1" cx="14" cy="33" r="4"/><circle pathLength="1" style="--i:1" cx="34" cy="33" r="4"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>`
  };

  const PH_COLORS = [["#EFE3D3", "#E3CFC3"], ["#E6E9DD", "#CBD4BF"], ["#F2E6DC", "#E6CBBF"], ["#EEE6D6", "#DBC8A8"]];
  // Photo or a soft placeholder when no photo is set yet.
  function media(src, alt, i) {
    if (src) return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
    const [a, b] = PH_COLORS[i % PH_COLORS.length];
    return `<span class="ph" style="--c1:${a};--c2:${b}" aria-hidden="true">${sprig()}<span class="ph__label">${esc(C.couple.monogram)}</span></span>`;
  }

  /* ---------- Render content from config ---------- */
  function render() {
    const binds = {
      first: C.couple.first,
      second: C.couple.second,
      monogram: C.couple.monogram,
      hashtag: C.couple.hashtag,
      namesShort: `${C.couple.first} & ${C.couple.second}`,
      displayDate: C.displayDate,
      shortDate: C.shortDate,
      venue: C.venue,
      city: C.city,
      intro: C.intro,
      dressCode: C.dressCode,
      deadline: C.rsvp.deadline,
      footerNote: C.footerNote
    };
    $$("[data-bind]").forEach((el) => {
      const v = binds[el.dataset.bind];
      if (v != null) el.textContent = v;
    });
    document.title = `${C.couple.first} & ${C.couple.second} · ${C.displayDate}`;
    $$("[data-sprig]").forEach((el) => { el.innerHTML = sprig(); });

    // Story
    $("#timeline").insertAdjacentHTML("beforeend", C.story.map((s, i) => {
      const flip = i % 2 === 1;
      return `<article class="timeline__item${flip ? " is-flipped" : ""}">
        <span class="timeline__dot" aria-hidden="true"></span>
        <div class="timeline__text" data-reveal="${flip ? "right" : "left"}">
          <p class="timeline__year">${esc(s.year)}</p>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </div>
        <div class="timeline__media" data-reveal="${flip ? "left" : "right"}">${media(s.photo, s.title, i)}</div>
      </article>`;
    }).join(""));

    // Events
    $("#events").innerHTML = C.events.map((e) => `
      <article class="event" data-reveal="up">
        <div class="event__icon">${ICONS[e.icon] || ""}</div>
        <p class="eyebrow">${esc(e.type)}</p>
        <h3 class="event__time">${esc(e.time)}</h3>
        <p class="event__venue">${esc(e.venue)}</p>
        <p class="event__address">${esc(e.address)}</p>
        <a class="link" href="${esc(e.mapUrl || mapsUrl(`${e.venue}, ${e.address}`))}" target="_blank" rel="noopener">Get directions ${ICONS.arrow}</a>
      </article>`).join("");

    // Schedule
    $("#schedule").innerHTML = C.schedule.map((s) => `
      <li class="schedule__item" data-reveal="up">
        <span class="schedule__time">${esc(s.time)}</span>
        <div><h4>${esc(s.title)}</h4><p>${esc(s.note)}</p></div>
      </li>`).join("");

    $("#swatches").innerHTML = C.palette.map((c, i) => `<span class="swatch" style="--c:${esc(c)};--i:${i}"></span>`).join("");

    // Gallery
    $("#gallery-grid").innerHTML = C.gallery.map((g, i) => `
      <button class="tile" type="button" data-reveal="clip" data-index="${i}" aria-label="Open photo: ${esc(g.caption || g.alt || `Photo ${i + 1}`)}">
        <span class="tile__media">${media(g.src, g.alt || g.caption, i)}</span>
        ${g.caption ? `<span class="tile__cap">${esc(g.caption)}</span>` : ""}
      </button>`).join("");

    // Travel
    $("#travel-grid").innerHTML = C.travel.map((t) => `
      <article class="card" data-reveal="up">
        <div class="card__icon">${ICONS[t.icon] || ""}</div>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.text)}</p>
        ${t.list ? `<ul class="card__list">${t.list.map((l) => `
          <li>
            <span class="card__list-name">${l.url ? `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a>` : esc(l.name)}</span>
            <span class="card__list-note">${esc(l.note)}</span>
          </li>`).join("")}</ul>` : ""}
        ${(t.links || []).map((l) => `<a class="link" href="${esc(l.url || mapsUrl(`${C.venue}, ${C.city}`))}" target="_blank" rel="noopener">${esc(l.label)} ${ICONS.arrow}</a>`).join("")}
      </article>`).join("");

    // FAQ
    $("#faq-list").innerHTML = C.faq.map((f, i) => `
      <div class="faq__item" data-reveal="up">
        <h3>
          <button class="faq__q" type="button" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">
            <span>${esc(f.q)}</span><span class="faq__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
          <div><p>${esc(f.a.replace("{deadline}", C.rsvp.deadline))}</p></div>
        </div>
      </div>`).join("");

    // Split section titles into words for the entrance effect
    $$("[data-split]").forEach((el) => {
      const text = el.textContent.trim();
      el.setAttribute("aria-label", text);
      el.innerHTML = text.split(/\s+/).map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${esc(w)}</span>`).join(" ");
    });
  }

  /* ---------- Intro envelope ---------- */
  function setupIntro(onReveal) {
    const intro = $("#intro");
    const envelope = $("#envelope");
    const btn = $("#open-invite");
    const main = $("#main");
    const nav = $("#nav");
    const skip = new URLSearchParams(location.search).has("nointro") || store.get("invite-opened");

    const reveal = () => {
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-revealed");
      onReveal();
    };

    if (skip) {
      intro.remove();
      reveal();
      return;
    }

    main.inert = true;
    nav.inert = true;

    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      store.set("invite-opened", "1");
      envelope.classList.add("is-open");
      intro.classList.add("is-opening");
      setTimeout(() => {
        intro.classList.add("is-gone");
        main.inert = false;
        nav.inert = false;
        reveal();
        $(".hero__names").focus({ preventScroll: true });
        setTimeout(() => intro.remove(), 1200);
      }, reduceMotion ? 50 : 2300);
    };
    btn.addEventListener("click", open);
    envelope.addEventListener("click", open);
  }

  /* ---------- Falling petals ---------- */
  function setupPetals() {
    const canvas = $("#petals");
    if (reduceMotion || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const colors = ["232,200,188", "216,188,142", "240,220,210", "205,170,160"];
    let w = 0, h = 0, raf = 0, petals = [], visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const make = (anywhere, i) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -20 - Math.random() * 60,
      size: 5 + Math.random() * 8,
      vy: 0.35 + Math.random() * 0.75,
      vx: -0.15 + Math.random() * 0.3,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.018,
      flip: Math.random() * Math.PI * 2,
      color: colors[i % colors.length],
      alpha: 0.45 + Math.random() * 0.4
    });

    const draw = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.35 + Math.abs(Math.cos(p.flip)) * 0.65);
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.7, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      petals.forEach((p, i) => {
        p.sway += p.swaySpeed;
        p.flip += 0.02;
        p.x += p.vx + Math.sin(p.sway) * 0.45;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 20 || p.x < -40 || p.x > w + 40) petals[i] = make(false, i);
        draw(petals[i]);
      });
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    resize();
    const count = w < 700 ? 14 : 28;
    petals = Array.from({ length: count }, (_, i) => make(true, i));
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }).observe(canvas);
    start();
  }

  /* ---------- Reveal on scroll ---------- */
  function setupReveal() {
    const targets = $$("[data-reveal], [data-split]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // stagger items that come into view together
        entry.target.style.setProperty("--d", n++);
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Nav ---------- */
  function setupNav() {
    const nav = $("#nav");
    const toggle = $(".nav__toggle");
    const menu = $("#nav-menu");
    const links = $$("a", menu);
    let lastY = window.scrollY;

    const setMenu = (open) => {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("is-locked", open);
    };
    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    links.forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });

    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 40);
      if (menu.classList.contains("is-open") || y < 400 || y < lastY) nav.classList.remove("is-hidden");
      else if (y > lastY + 4) nav.classList.add("is-hidden");
      lastY = y;
    }, { passive: true });

    // highlight the section you're in
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => io.observe(s));
  }

  /* ---------- Scroll effects: parallax, timeline fill, back to top ---------- */
  function setupScrollFx() {
    const parallax = $$("[data-parallax]");
    const timeline = $("#timeline");
    const fill = $("#timeline-fill");
    const toTop = $("#to-top");
    const ring = $("#to-top-ring");
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (!reduceMotion && y < vh * 1.3) {
        parallax.forEach((el) => { el.style.transform = `translate3d(0, ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`; });
      }
      const r = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
      fill.style.setProperty("--p", p.toFixed(4));

      const max = document.documentElement.scrollHeight - vh;
      toTop.classList.toggle("is-shown", y > vh * 0.9);
      ring.style.strokeDashoffset = String(1 - (max > 0 ? y / max : 0));
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---------- Countdown ---------- */
  function setupCountdown() {
    const target = new Date(C.start).getTime();
    const hosts = {};
    const shown = {};
    $$("[data-unit]").forEach((el) => { hosts[el.dataset.unit] = el; });

    const set = (unit, value) => {
      const text = unit === "days" ? String(value) : String(value).padStart(2, "0");
      if (shown[unit] === text) return;
      const host = hosts[unit];
      $$(".is-out", host).forEach((n) => n.remove());
      const current = host.querySelector("span");
      const next = document.createElement("span");
      next.textContent = text;
      if (current && !reduceMotion) {
        current.className = "is-out";
        next.className = "is-in";
        current.addEventListener("animationend", () => current.remove(), { once: true });
      } else if (current) {
        current.remove();
      }
      host.appendChild(next);
      shown[unit] = text;
    };

    let timer = 0;
    const tick = () => {
      let diff = target - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        $("#countdown-grid").hidden = true;
        $("#countdown-done").hidden = false;
        return;
      }
      const days = Math.floor(diff / 864e5); diff -= days * 864e5;
      const hours = Math.floor(diff / 36e5); diff -= hours * 36e5;
      const minutes = Math.floor(diff / 6e4); diff -= minutes * 6e4;
      set("days", days);
      set("hours", hours);
      set("minutes", minutes);
      set("seconds", Math.floor(diff / 1000));
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---------- Calendar links ---------- */
  function setupCalendar() {
    const start = new Date(C.start);
    const end = new Date(C.end);
    const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = `${C.couple.first} & ${C.couple.second}'s Wedding`;
    const place = `${C.venue}, ${C.city}`;
    const pageUrl = location.href.split(/[?#]/)[0];
    const details = `We can't wait to celebrate with you. Details and RSVP: ${pageUrl}`;

    const google = new URL("https://calendar.google.com/calendar/render");
    google.search = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${stamp(start)}/${stamp(end)}`, details, location: place }).toString();
    $("#cal-google").href = google.toString();

    $("#cal-ics").addEventListener("click", () => {
      const icsText = (s) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Website//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${stamp(start)}-${C.couple.first}-${C.couple.second}@wedding`.replace(/\s+/g, ""),
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(start)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${icsText(title)}`,
        `LOCATION:${icsText(place)}`,
        `DESCRIPTION:${icsText(details)}`,
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: "wedding.ics" });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  }

  /* ---------- FAQ ---------- */
  function setupFaq() {
    $("#faq-list").addEventListener("click", (e) => {
      const btn = e.target.closest(".faq__q");
      if (!btn) return;
      const item = btn.closest(".faq__item");
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function setupLightbox() {
    const lb = $("#lightbox");
    const mediaEl = $("#lightbox-media");
    const caption = $("#lightbox-caption");
    const count = $("#lightbox-count");
    const closeBtn = $(".lightbox__close", lb);
    const total = C.gallery.length;
    let index = 0;
    let lastFocus = null;

    const paint = () => {
      const g = C.gallery[index];
      mediaEl.innerHTML = media(g.src, g.alt || g.caption, index);
      mediaEl.classList.toggle("is-ph", !g.src);
      caption.textContent = g.caption || "";
      count.textContent = `${index + 1} / ${total}`;
    };
    const go = (step) => {
      index = (index + step + total) % total;
      if (reduceMotion) return paint();
      mediaEl.style.setProperty("--dir", step);
      mediaEl.classList.add("is-out");
      setTimeout(() => {
        paint();
        mediaEl.classList.remove("is-out");
        mediaEl.classList.add("is-in");
        void mediaEl.offsetWidth;
        mediaEl.classList.remove("is-in");
      }, 220);
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      index = i;
      paint();
      lb.hidden = false;
      document.body.classList.add("is-locked");
      void lb.offsetWidth;
      lb.classList.add("is-open");
      closeBtn.focus();
    };
    const close = () => {
      lb.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      setTimeout(() => { lb.hidden = true; }, reduceMotion ? 0 : 400);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };

    $("#gallery-grid").addEventListener("click", (e) => {
      const tile = e.target.closest(".tile");
      if (tile) open(Number(tile.dataset.index));
    });
    closeBtn.addEventListener("click", close);
    $(".lightbox__prev", lb).addEventListener("click", () => go(-1));
    $(".lightbox__next", lb).addEventListener("click", () => go(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        // keep focus inside the viewer
        const f = $$("button", lb);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    let touchX = null;
    lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }

  /* ---------- RSVP ---------- */
  function setupRsvp() {
    const form = $("#rsvp-form");
    const more = $("#rsvp-more");
    const status = $("#form-status");
    const thanks = $("#rsvp-thanks");
    const submit = $("[type=submit]", form);

    const guests = $("#f-guests");
    for (let n = 1; n <= C.rsvp.maxGuests; n++) guests.add(new Option(n === 1 ? "Just me" : `${n} people`, String(n)));
    const meal = $("#f-meal");
    if (C.rsvp.meals && C.rsvp.meals.length) {
      meal.add(new Option("Choose one", ""));
      C.rsvp.meals.forEach((m) => meal.add(new Option(m, m)));
    } else {
      $("#meal-field").hidden = true;
    }

    const setError = (name, msg) => {
      const field = $(`[data-field="${name}"]`, form);
      field.classList.toggle("has-error", Boolean(msg));
      $(`#e-${name}`).textContent = msg || "";
      $$("input", field).forEach((input) => input.setAttribute("aria-invalid", msg ? "true" : "false"));
    };
    const check = () => {
      const data = new FormData(form);
      const email = String(data.get("email") || "").trim();
      const errors = {
        name: String(data.get("name") || "").trim() ? "" : "Please add your name.",
        email: !email ? "Please add your email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "That email doesn't look quite right.",
        attending: data.get("attending") ? "" : "Let us know if you can make it."
      };
      Object.entries(errors).forEach(([k, v]) => setError(k, v));
      return Object.keys(errors).filter((k) => errors[k]);
    };

    form.addEventListener("change", (e) => {
      if (e.target.name === "attending") {
        more.classList.toggle("is-open", e.target.value === "yes");
        setError("attending", "");
      }
    });
    form.addEventListener("input", (e) => {
      const field = e.target.closest(".field");
      if (field && field.classList.contains("has-error")) check();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      const bad = check();
      if (bad.length) {
        const field = $(`[data-field="${bad[0]}"]`, form);
        field.classList.remove("shake");
        void field.offsetWidth;
        field.classList.add("shake");
        $("input", field).focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const isBot = Boolean(data.website);
      delete data.website;
      if (data.attending !== "yes") ["guests", "meal", "dietary", "song"].forEach((k) => delete data[k]);
      data.submittedAt = new Date().toISOString();

      submit.classList.add("is-loading");
      submit.disabled = true;
      const preview = !C.rsvp.endpoint;
      try {
        if (preview || isBot) {
          await wait(1000);
        } else {
          // no-cors works with a Google Apps Script web app. The response is opaque, so a
          // network failure throws and anything else counts as sent.
          await fetch(C.rsvp.endpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
        }
        showThanks(data, preview);
      } catch {
        status.textContent = "Something went wrong sending your RSVP. Please check your connection and try again.";
      } finally {
        submit.classList.remove("is-loading");
        submit.disabled = false;
      }
    });

    const showThanks = (data, preview) => {
      const firstName = data.name.trim().split(/\s+/)[0];
      const coming = data.attending === "yes";
      $("#thanks-title").textContent = coming ? `See you there, ${firstName}!` : `We'll miss you, ${firstName}`;
      $("#thanks-text").textContent = coming
        ? `Your RSVP is in. We can't wait to celebrate with you on ${C.displayDate}.`
        : "Thank you for letting us know. You'll be with us in spirit.";
      $("#thanks-note").hidden = !preview;
      form.classList.add("is-leaving");
      setTimeout(() => {
        form.hidden = true;
        thanks.hidden = false;
        void thanks.offsetWidth;
        thanks.classList.add("is-in");
        $(".thanks__mark", thanks).classList.add("is-visible");
        thanks.focus({ preventScroll: true });
        if (coming) burst(thanks);
      }, reduceMotion ? 0 : 450);
    };

    $("#rsvp-again").addEventListener("click", () => {
      form.reset();
      more.classList.remove("is-open");
      thanks.classList.remove("is-in");
      $(".thanks__mark", thanks).classList.remove("is-visible");
      thanks.hidden = true;
      form.hidden = false;
      form.classList.remove("is-leaving");
      $("#f-name").focus();
    });
  }

  // little shower of petals when someone says yes
  function burst(host) {
    if (reduceMotion || !Element.prototype.animate) return;
    const colors = ["#E8C8BC", "#B08D57", "#7D8C6F", "#D9A99A", "#D8BC8E"];
    for (let i = 0; i < 38; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.background = colors[i % colors.length];
      host.appendChild(piece);
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 190;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist * 0.7 - 50;
      piece.animate([
        { transform: "translate(-50%, -50%) scale(0) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${x * 1.15}px), calc(-50% + ${y + 140}px)) scale(.7) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], { duration: 1500 + Math.random() * 900, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }).onfinish = () => piece.remove();
    }
  }

  /* ---------- Go ---------- */
  render();
  setupNav();
  setupScrollFx();
  setupCountdown();
  setupCalendar();
  setupFaq();
  setupLightbox();
  setupRsvp();
  setupIntro(() => {
    setupReveal();
    setupPetals();
  });
})();
