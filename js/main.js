(() => {
  "use strict";

  const C = window.WEDDING;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Anything still holding a [placeholder] is treated as not filled in yet.
  const isReal = (s) => Boolean(s) && !/\[[^\]]*\]/.test(String(s));
  const digits = (s) => String(s || "").replace(/\D/g, "");
  const formatPhone = (p) => {
    const d = digits(p);
    return d.length === 11 && d.startsWith("09") ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : p;
  };
  const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  const mapEmbed = (q) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage blocked */ } }
  };

  /* ---------- SVG pieces ---------- */
  const HEART = `<svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>`;

  // Calla lily line drawing, like the ones on the invitation
  const LILY = `<svg class="lily" viewBox="0 0 140 320" aria-hidden="true">
    <path class="lily__stem" pathLength="1" style="--i:0" d="M56 318 C 49 280, 67 230, 62 176"/>
    <path class="lily__leaf" pathLength="1" style="--i:1" d="M57 272 C 33 260, 17 236, 19 202 C 39 216, 53 242, 57 272 Z"/>
    <path class="lily__vein" pathLength="1" style="--i:2" d="M56 268 C 43 250, 31 230, 21 206"/>
    <path class="lily__petal lily__body" pathLength="1" style="--i:2" d="M62 176 C 51 160, 45 136, 45 110 C 45 84, 53 62, 70 50"/>
    <path class="lily__petal" pathLength="1" style="--i:3" d="M62 176 C 73 162, 83 142, 88 118 C 92 102, 96 88, 104 78"/>
    <path class="lily__petal" pathLength="1" style="--i:4" d="M70 50 C 83 44, 99 55, 104 78"/>
    <path class="lily__petal lily__lip" pathLength="1" style="--i:5" d="M70 50 C 84 36, 104 26, 124 21 C 133 19, 136 27, 128 32 C 117 40, 108 58, 104 78"/>
    <path class="lily__petal" pathLength="1" style="--i:6" d="M64 168 C 68 138, 82 104, 102 82"/>
    <path class="lily__spadix" pathLength="1" style="--i:7" d="M76 104 C 78 88, 83 75, 91 64"/>
  </svg>`;

  const draw = (inner, box = 48) => `<svg class="draw" viewBox="0 0 ${box} ${box}" aria-hidden="true">${inner}</svg>`;
  const ICONS = {
    church: draw(`<path pathLength="1" d="M24 3 V11 M20.5 6.5 H27.5"/><path pathLength="1" style="--i:1" d="M16 23 L24 13 L32 23 M18 21 V44 M30 21 V44"/><path pathLength="1" style="--i:2" d="M18 31 L8 35 V44 H40 V35 L30 31"/><path pathLength="1" style="--i:3" d="M21 44 V38 a3 3 0 0 1 6 0 V44"/><circle pathLength="1" style="--i:3" cx="24" cy="28" r="2.5"/>`),
    rings: draw(`<circle pathLength="1" cx="18" cy="31" r="11"/><circle pathLength="1" style="--i:1" cx="30" cy="29" r="11"/><path pathLength="1" style="--i:2" d="M25 12 L28 8 H32 L35 12 L30 18 Z M25 12 H35"/>`),
    glass: draw(`<g transform="rotate(-12 16 24)"><path pathLength="1" d="M10 8 h11 l-1.2 13 a4.3 4.3 0 0 1 -8.6 0 z"/><path pathLength="1" style="--i:1" d="M15.5 25.5 V41 M11 41 h9"/></g><g transform="rotate(12 32 24)"><path pathLength="1" style="--i:1" d="M27 8 h11 l-1.2 13 a4.3 4.3 0 0 1 -8.6 0 z"/><path pathLength="1" style="--i:2" d="M32.5 25.5 V41 M28 41 h9"/></g><path pathLength="1" style="--i:3" d="M24 1 v4 M18 3 l2 3 M30 3 l-2 3"/>`),
    car: draw(`<path pathLength="1" d="M17 33 H31 M39 33 H43 V27 C 43 25, 42 24, 40 24 L36 23 L31 15 H17 L12 23 L8 24 C 6 24, 5 25, 5 27 V33 H9"/><circle pathLength="1" style="--i:1" cx="13" cy="33" r="4"/><circle pathLength="1" style="--i:1" cx="35" cy="33" r="4"/><path pathLength="1" style="--i:2" d="M24 15 V23 M12 23 H36"/><path pathLength="1" style="--i:3" d="M5 30 C 2 30, 0 32, -2 35 M5 31 C 3 33, 3 36, 1 39"/>`),
    pin: draw(`<path pathLength="1" d="M24 44 C 24 44, 10 31, 10 20 a14 14 0 0 1 28 0 C 38 31, 24 44, 24 44 z"/><circle pathLength="1" style="--i:1" cx="24" cy="20" r="5"/>`),
    parking: draw(`<rect pathLength="1" x="8" y="8" width="32" height="32" rx="8"/><path pathLength="1" style="--i:1" d="M19 34 V14 h7 a6 6 0 0 1 0 12 h-7"/>`),
    landmark: draw(`<path pathLength="1" d="M24 4 L31 14 H17 Z"/><path pathLength="1" style="--i:1" d="M19 14 V40 M29 14 V40 M12 44 H36 M15 40 H33"/>`),
    route: draw(`<circle pathLength="1" cx="12" cy="36" r="4"/><circle pathLength="1" style="--i:1" cx="36" cy="12" r="4"/><path pathLength="1" style="--i:1" d="M16 36 H30 a6 6 0 0 0 0 -12 H18 a6 6 0 0 1 0 -12 H32"/>`),
    camera: draw(`<path pathLength="1" d="M6 16 a4 4 0 0 1 4 -4 h6 l3 -4 h10 l3 4 h6 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 H10 a4 4 0 0 1 -4 -4 Z"/><circle pathLength="1" style="--i:1" cx="24" cy="26" r="8"/>`),
    gift: draw(`<rect pathLength="1" x="7" y="18" width="34" height="8" rx="1"/><path pathLength="1" style="--i:1" d="M10 26 V42 H38 V26 M24 18 V42"/><path pathLength="1" style="--i:2" d="M24 18 C 18 18, 12 16, 13 11 C 14 6, 21 9, 24 18 C 27 9, 34 6, 35 11 C 36 16, 30 18, 24 18"/>`)
  };
  const I = {
    pin: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
    phone: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>`,
    sms: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 13h5"/></svg>`,
    messenger: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C7 3 3 6.7 3 11.3c0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.9.3 1.8.4 2.7.4 5 0 9-3.7 9-8.4S17 3 12 3z"/><path d="M7.5 13.5l3-3 2.5 2 3.5-3"/></svg>`,
    camera: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h2.5L9 4h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
    copy: `<svg class="i i--copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>`,
    check: `<svg class="i i--check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
    download: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>`
  };

  const monogramHTML = () => (isReal(C.couple.monogram) ? esc(C.couple.monogram) : HEART);

  // A link button, or a dimmed "coming soon" button while the link is missing
  const actionLink = (url, label, cls) => (isReal(url)
    ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`
    : `<span class="${cls} is-pending" aria-disabled="true">${label}</span><span class="pending-note">Link coming soon</span>`);

  function photo(src, alt, position) {
    if (!isReal(src)) return `<span class="ph" aria-hidden="true">${LILY}</span>`;
    return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"${position ? ` style="object-position:${esc(position)}"` : ""}>`;
  }

  const hideSection = (id) => { const s = document.getElementById(id); if (s) s.hidden = true; };

  /* ---------- Render content from config ---------- */
  let GALLERY = [];

  function render() {
    const venue = C.venues[0] || {};
    const venueLine = [venue.name, venue.address].filter(isReal).join(", ");
    const binds = {
      first: C.couple.first,
      second: C.couple.second,
      hashtag: C.couple.hashtag,
      namesShort: `${C.couple.first} & ${C.couple.second}`,
      heroEyebrow: C.hero.eyebrow,
      tagline: C.hero.tagline,
      displayDate: C.displayDate,
      shortDate: C.shortDate,
      dateTime: `${C.displayDate} · ${C.displayTime}`,
      weekday: C.dateParts.weekday,
      time: C.dateParts.time,
      day: C.dateParts.day,
      month: C.dateParts.month,
      year: C.dateParts.year,
      venueLine,
      venueName: venue.name,
      venueAddress: venue.address,
      welcomeQuote: C.welcome.quote,
      storyEnding: C.storyEnding,
      dressTitle: C.dressCode.title,
      dressNote: C.dressCode.note,
      dressThanks: C.dressCode.thanks,
      deadline: C.rsvp.deadline,
      rsvpLead: C.rsvp.lead,
      rsvpNoteTitle: C.rsvp.noteTitle,
      rsvpNote: C.rsvp.note,
      rsvpName: C.rsvp.contact ? C.rsvp.contact.name : "",
      rsvpPhone: C.rsvp.contact ? formatPhone(C.rsvp.contact.phone) : "",
      giftsEyebrow: C.gifts.eyebrow,
      giftsHowTo: C.gifts.howTo,
      shareLead: C.sharePhotos.lead,
      shareText: C.sharePhotos.text,
      shareNote: C.sharePhotos.note,
      contactLead: C.contact.lead,
      closingTitle: C.closing.title,
      closingText: C.closing.text,
      closingRequest: C.closing.request
    };
    $$("[data-bind]").forEach((el) => {
      const v = binds[el.dataset.bind];
      if (v == null) return;
      el.textContent = v;
      if (!isReal(v)) el.hidden = true;
    });
    $$("[data-monogram]").forEach((el) => { el.innerHTML = monogramHTML(); });
    $$("[data-heart]").forEach((el) => { el.innerHTML = HEART; });
    $$("[data-lily]").forEach((el) => { el.innerHTML = LILY; });

    if (!isReal(C.rsvp.note)) $("#rsvp-note").hidden = true;

    // Welcome photo
    $("#welcome-photo").innerHTML = photo(C.welcome.photo, `${C.couple.first} and ${C.couple.second}`, C.welcome.photoPosition);

    // Story: only moments that have real text
    const story = C.story.filter((s) => isReal(s.title) && isReal(s.text));
    if (!story.length) hideSection("story");
    $("#timeline").insertAdjacentHTML("beforeend", story.map((s, i) => {
      const flip = i % 2 === 1;
      return `<article class="timeline__item${flip ? " is-flipped" : ""}">
        <span class="timeline__dot" aria-hidden="true"></span>
        <div class="timeline__text" data-reveal="${flip ? "right" : "left"}">
          ${isReal(s.label) ? `<p class="timeline__label">${esc(s.label)}</p>` : ""}
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </div>
        <div class="timeline__media" data-reveal="${flip ? "left" : "right"}">${photo(s.photo, s.title)}</div>
      </article>`;
    }).join(""));

    // The details
    const moments = C.details.filter((m) => isReal(m.title) && isReal(m.time));
    $("#moments").insertAdjacentHTML("beforeend", moments.map((m, i) => `
      <li class="moment${i % 2 ? " is-flipped" : ""}" data-reveal="up">
        <span class="moment__icon">${ICONS[m.icon] || ""}</span>
        <span class="moment__dot" aria-hidden="true"></span>
        <div class="moment__text"><h3>${esc(m.title)}</h3><p>${esc(m.time)}</p></div>
      </li>`).join(""));
    if (!moments.length) $("#moments").hidden = true;

    const venues = C.venues.filter((v) => isReal(v.name));
    const venueMap = (v) => (isReal(v.mapUrl) ? v.mapUrl : mapsUrl(`${v.name}, ${v.address}`));
    $("#venue-cards").innerHTML = venues.map((v) => `
      <article class="venue-card" data-reveal="up">
        <div class="venue-card__icon">${ICONS.pin}</div>
        <p class="eyebrow">${esc(v.label)}</p>
        <h3>${esc(v.name)}</h3>
        ${isReal(v.address) ? `<p class="venue-card__address">${esc(v.address)}</p>` : ""}
        <a class="btn btn--solid" href="${esc(venueMap(v))}" target="_blank" rel="noopener">${I.pin} View location</a>
      </article>`).join("");

    // Dress code
    const [c1, c2] = C.dressCode.colors;
    $("#palette").innerHTML = C.dressCode.colors.map((c) => `<div class="palette__block" style="--c:${esc(c.hex)};--fg:${esc(c.text)}">${esc(c.name)}</div>`).join("")
      + (c1 && c2 ? `<span class="palette__plus" aria-hidden="true">+</span>` : "");

    // Location
    if (!venues.length) hideSection("location");
    $("#venues").classList.toggle("venues--single", venues.length === 1);
    $("#venues").innerHTML = venues.map((v) => {
      const query = isReal(v.coordinates) ? v.coordinates : `${v.name}, ${v.address}`;
      const map = isReal(v.mapEmbed) || isReal(v.address) || isReal(v.coordinates)
        ? `<iframe src="${esc(isReal(v.mapEmbed) ? v.mapEmbed : mapEmbed(query))}" title="Map of ${esc(v.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
        : "";
      return `<article class="venue" data-reveal="up">
        <div class="venue__map${map ? "" : " venue__map--empty"}">${map || `${ICONS.pin}<p>The map shows up once the address is in.</p>`}</div>
        <div class="venue__body">
          <p class="eyebrow">${esc(v.label)}</p>
          <h3>${esc(v.name)}</h3>
          ${isReal(v.address) ? `<p class="venue__address">${esc(v.address)}</p>` : ""}
          ${isReal(v.listedAs) ? `<p class="venue__listed">On Google Maps: <strong>${esc(v.listedAs)}</strong></p>` : ""}
          ${isReal(v.plusCode) ? `<p class="venue__code">
            <span class="venue__code-label">Plus code</span>
            <span class="venue__code-value">${esc(v.plusCode.split(",")[0])}</span>
            <button class="copy" type="button" data-copy="${esc(v.plusCode)}" aria-label="Copy plus code">${I.copy}${I.check}<span class="copy__label">Copy</span></button>
          </p>` : ""}
          <a class="btn btn--solid" href="${esc(venueMap(v))}" target="_blank" rel="noopener">${I.pin} View on Google Maps</a>
        </div>
      </article>`;
    }).join("");
    const tips = (C.location.tips || []).filter((t) => isReal(t.title) && isReal(t.text));
    $("#tips").innerHTML = tips.map((t) => `
      <div class="tip" data-reveal="up">
        <span class="tip__icon">${ICONS[t.icon] || ICONS.pin}</span>
        <div><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p></div>
      </div>`).join("");
    if (!tips.length) $("#tips").hidden = true;

    // Gallery
    GALLERY = C.gallery.filter((g) => isReal(g.src));
    if (!GALLERY.length) hideSection("gallery");
    $("#gallery-grid").innerHTML = GALLERY.map((g, i) => `
      <button class="tile${g.wide ? " tile--wide" : ""}" type="button" data-reveal="clip" data-index="${i}" aria-label="Open photo ${i + 1} of ${GALLERY.length}${g.alt ? `: ${esc(g.alt)}` : ""}">
        <span class="tile__media">${photo(g.thumb || g.src, "", g.position)}</span>
        ${isReal(g.caption) ? `<span class="tile__cap">${esc(g.caption)}</span>` : ""}
      </button>`).join("");

    // Share your photos
    if (!isReal(C.sharePhotos.url)) hideSection("share");
    $("#share-icon").innerHTML = ICONS.camera;
    $("#share-action").innerHTML = actionLink(C.sharePhotos.url, `${I.camera} Share your photos`, "btn btn--solid btn--lg");

    // Gifts: drop rows that are still placeholders
    const gifts = C.gifts.options
      .map((g) => ({ ...g, details: g.details.filter((d) => isReal(d.value)) }))
      .filter((g) => g.details.length || isReal(g.qr));
    if (!gifts.length) hideSection("gifts");
    $("#gifts-intro").innerHTML = C.gifts.intro.map((p) => `<p>${esc(p)}</p>`).join("");
    $("#gift-list").innerHTML = gifts.map((g) => {
      const file = isReal(g.download) ? g.download : g.qr;
      const saveAs = `Nicole-and-Lemuel-${g.label.replace(/\s+/g, "-")}-QR.${String(file).split(".").pop()}`;
      return `<article class="gift" data-reveal="up">
        <h3 class="gift__label">${esc(g.label)}</h3>
        ${isReal(g.qr) ? `<div class="gift__qr"><img src="${esc(g.qr)}" alt="${esc(g.label)} QR code" width="640" height="640" loading="lazy"></div>` : ""}
        ${g.details.length ? `<dl class="gift__details">${g.details.map((d) => `
          <div class="gift__row">
            <dt>${esc(d.key)}</dt>
            <dd><span>${esc(d.value)}</span>${d.copy ? `<button class="copy" type="button" data-copy="${esc(d.value)}" aria-label="Copy ${esc(d.key)}">${I.copy}${I.check}<span class="copy__label">Copy</span></button>` : ""}</dd>
          </div>`).join("")}</dl>` : ""}
        ${isReal(file) ? `<a class="btn btn--ghost btn--sm gift__save" href="${esc(file)}" download="${esc(saveAs)}">${I.download} Save QR</a>` : ""}
      </article>`;
    }).join("");

    // Contact
    const people = C.contact.people.filter((p) => isReal(p.name) && isReal(p.phone));
    const hasMessenger = isReal(C.contact.messengerUrl);
    if (!people.length && !hasMessenger) hideSection("contact");
    $("#contacts").innerHTML = people.map((p) => {
      const d = digits(p.phone);
      return `<article class="person" data-reveal="up">
        <span class="person__avatar" aria-hidden="true">${esc(p.name.trim()[0])}</span>
        <h3>${esc(p.name)}</h3>
        ${isReal(p.role) ? `<p class="person__role">${esc(p.role)}</p>` : ""}
        <p class="person__phone">${esc(formatPhone(p.phone))}</p>
        <div class="person__actions">
          <a class="btn btn--ghost btn--sm" href="tel:${d}">${I.phone} Call</a>
          <a class="btn btn--ghost btn--sm" href="sms:${d}">${I.sms} Text</a>
        </div>
      </article>`;
    }).join("");
    $("#messenger").innerHTML = hasMessenger ? actionLink(C.contact.messengerUrl, `${I.messenger} Message us on Messenger`, "btn btn--solid") : "";

    // FAQ
    const faq = C.faq.filter((f) => isReal(f.q) && isReal(f.a));
    if (!faq.length) hideSection("faq");
    $("#faq-list").innerHTML = faq.map((f, i) => `
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

    // Menu links to hidden sections go away too
    $$("#nav-menu a").forEach((a) => {
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target || target.hidden) a.hidden = true;
    });

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
    $("#open-invite").addEventListener("click", open);
    envelope.addEventListener("click", open);
  }

  /* ---------- Falling petals ---------- */
  function setupPetals() {
    const canvas = $("#petals");
    if (reduceMotion || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    // [rgb, max alpha]: burgundy, plum, beige, blush
    const colors = [["92,21,38", 0.55], ["62,42,51", 0.4], ["209,179,145", 0.75], ["225,196,190", 0.8]];
    let w = 0, h = 0, raf = 0, petals = [], visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const make = (anywhere, i) => {
      const [rgb, max] = colors[i % colors.length];
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -20 - Math.random() * 60,
        size: 5 + Math.random() * 8,
        vy: 0.35 + Math.random() * 0.7,
        vx: -0.15 + Math.random() * 0.3,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.03,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.018,
        flip: Math.random() * Math.PI * 2,
        rgb,
        alpha: max * (0.55 + Math.random() * 0.45)
      };
    };
    const paint = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.35 + Math.abs(Math.cos(p.flip)) * 0.65);
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.7, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
      ctx.fillStyle = `rgba(${p.rgb},${p.alpha})`;
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
        paint(petals[i]);
      });
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    resize();
    petals = Array.from({ length: w < 700 ? 14 : 26 }, (_, i) => make(true, i));
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
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

    // underline the menu item for the section you're in
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => { if (!s.hidden) io.observe(s); });
  }

  /* ---------- Scroll effects: parallax, line fills, back to top ---------- */
  function setupScrollFx() {
    const parallax = $$("[data-parallax]");
    const tracks = $$("[data-progress]").filter((el) => !el.closest("[hidden]"));
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
      tracks.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
        $(".progress-fill", el).style.setProperty("--p", p.toFixed(4));
      });
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
    // one countdown on the home screen, a bigger one further down
    const hosts = {};
    $$("[data-unit]").forEach((el) => { (hosts[el.dataset.unit] ||= []).push(el); });

    const set = (unit, value) => {
      const text = unit === "days" ? String(value) : String(value).padStart(2, "0");
      hosts[unit].forEach((host) => {
        if (host.dataset.shown === text) return;
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
        host.dataset.shown = text;
      });
    };

    let timer = 0;
    const tick = () => {
      let diff = target - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        $("#countdown-grid").hidden = true;
        $("#hero-countdown").hidden = true;
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
    const venue = C.venues[0] || {};
    const title = `${C.couple.first} & ${C.couple.second}'s Wedding`;
    const place = [venue.name, venue.address].filter(isReal).join(", ");
    const pageUrl = location.href.split(/[?#]/)[0];
    const details = `Details and directions: ${pageUrl}`;

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
      const a = Object.assign(document.createElement("a"), { href: url, download: "nicole-and-lemuel-wedding.ics" });
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

  /* ---------- Copy buttons (gift details) ---------- */
  function setupCopy() {
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = Object.assign(document.createElement("textarea"), { value: text });
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      const label = $(".copy__label", btn);
      btn.classList.add("is-copied");
      label.textContent = "Copied";
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.classList.remove("is-copied"); label.textContent = "Copy"; }, 1800);
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function setupLightbox() {
    if (!GALLERY.length) return;
    const lb = $("#lightbox");
    const mediaEl = $("#lightbox-media");
    const caption = $("#lightbox-caption");
    const count = $("#lightbox-count");
    const closeBtn = $(".lightbox__close", lb);
    const total = GALLERY.length;
    let index = 0;
    let lastFocus = null;

    const paint = () => {
      const g = GALLERY[index];
      mediaEl.innerHTML = `<img src="${esc(g.src)}" alt="${esc(g.alt)}">`;
      caption.textContent = isReal(g.caption) ? g.caption : "";
      count.textContent = `${index + 1} / ${total}`;
      new Image().src = GALLERY[(index + 1) % total].src; // warm up the next one
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
    const r = C.rsvp;
    if (isReal(r.googleFormUrl)) {
      $("#rsvp-external").hidden = false;
      $("#rsvp-external-link").href = r.googleFormUrl;
    } else if (isReal(r.endpoint)) {
      $("#rsvp-form").hidden = false;
      setupRsvpForm();
    } else if (r.contact && isReal(r.contact.phone)) {
      const d = digits(r.contact.phone);
      $("#rsvp-contact").hidden = false;
      // "?&body=" works for both iPhone and Android messaging apps
      $("#rsvp-sms").href = `sms:${d}?&body=${encodeURIComponent(r.smsMessage || "")}`;
      $("#rsvp-call").href = `tel:${d}`;
    } else {
      hideSection("rsvp");
    }
  }

  function setupRsvpForm() {
    const form = $("#rsvp-form");
    const more = $("#rsvp-more");
    const status = $("#form-status");
    const thanks = $("#rsvp-thanks");
    const submit = $("[type=submit]", form);

    const guests = $("#f-guests");
    for (let n = 1; n <= C.rsvp.maxGuests; n++) guests.add(new Option(n === 1 ? "Just me" : `${n} people`, String(n)));

    const setError = (name, msg) => {
      const field = $(`[data-field="${name}"]`, form);
      field.classList.toggle("has-error", Boolean(msg));
      $(`#e-${name}`).textContent = msg || "";
      $$("input", field).forEach((input) => input.setAttribute("aria-invalid", msg ? "true" : "false"));
    };
    const check = () => {
      const data = new FormData(form);
      const phone = String(data.get("phone") || "").trim();
      const errors = {
        name: String(data.get("name") || "").trim() ? "" : "Please add your name.",
        phone: !phone ? "Please add a number we can reach you on." : digits(phone).length < 7 ? "That number looks too short." : "",
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
      if (data.attending !== "yes") ["guests", "dietary"].forEach((k) => delete data[k]);
      data.submittedAt = new Date().toISOString();

      submit.classList.add("is-loading");
      submit.disabled = true;
      try {
        if (isBot) await wait(1000);
        // no-cors works with a Google Apps Script web app. The response is opaque, so a
        // network failure throws and anything else counts as sent.
        else await fetch(C.rsvp.endpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
        showThanks(data);
      } catch {
        status.textContent = "Something went wrong sending your RSVP. Please check your connection and try again.";
      } finally {
        submit.classList.remove("is-loading");
        submit.disabled = false;
      }
    });

    const showThanks = (data) => {
      const firstName = data.name.trim().split(/\s+/)[0];
      const coming = data.attending === "yes";
      $("#thanks-title").textContent = coming ? `See you there, ${firstName}!` : `We'll miss you, ${firstName}`;
      $("#thanks-text").textContent = coming
        ? `Your RSVP is in. We can't wait to celebrate with you on ${C.displayDate}.`
        : "Thank you for letting us know. You'll be with us in spirit.";
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
    const colors = ["#5C1526", "#D1B391", "#E1C4BE", "#3E2A33", "#E0C9A8"];
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
  setupCopy();
  setupLightbox();
  setupRsvp();
  setupIntro(() => {
    setupReveal();
    setupPetals();
  });
})();
