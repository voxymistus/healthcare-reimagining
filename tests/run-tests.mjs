/* =========================================================================
   Avenir site — test suite (no dependencies)
   Run: node tests/run-tests.mjs            (static checks only)
        node tests/run-tests.mjs --smoke    (+ headless-Chrome smoke tests)
   ========================================================================= */
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = ["index.html", "concierge.html", "doctors.html", "booking.html", "dashboard.html"];
const CSS = ["styles.css", "pages.css", "effects.css"];
const JS = ["main.js", "effects.js", "booking.js", "concierge.js"];
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let passed = 0, failed = 0;
const fail = (msg) => { failed++; console.error(`  ✗ ${msg}`); };
const ok = (cond, msg) => { if (cond) { passed++; } else fail(msg); };
const read = (f) => readFileSync(join(ROOT, f), "utf8");
const count = (s, re) => (s.match(new RegExp(re, "g")) || []).length;

/* --- 1. Page structure --------------------------------------------------- */
console.log("1. Page structure");
for (const page of PAGES) {
  const html = read(page);
  ok(/<title>[^<]*Avenir[^<]*<\/title>/.test(html), `${page}: <title> mentions Avenir`);
  ok(html.includes("Reimagining Premium Healthcare Experience"), `${page}: site name present`);
  ok(html.includes('href="img/avenir-mark-64.png"'), `${page}: favicon links to the Avenir mark`);
  ok(!html.includes("favicon.svg"), `${page}: no stale favicon.svg reference`);
  ok(count(html, 'class="brand"') === 2, `${page}: brand appears in header + footer`);
  ok(!html.includes("brand__mark"), `${page}: sky-blue logo image removed (wordmark is the logo)`);
  ok(/Inter:wght@[^"&]*;800/.test(html), `${page}: Inter heavy weight (800) loaded for the bold wordmark`);
  ok(html.includes("Avenir — Applied Future Lab"), `${page}: footer agency block present`);
  ok(count(html, "<section") === count(html, "</section>"), `${page}: <section> tags balanced`);
  ok(count(html, "<div") === count(html, "</div>"), `${page}: <div> tags balanced`);
  ok(html.includes('class="hero__figure'), `${page}: hero has a 3D figure`);
  ok(html.includes("next-chapter") || page === "index.html" || page === "dashboard.html",
     `${page}: next-chapter plaque present`);
}

/* --- 2. Per-page specifics ------------------------------------------------ */
console.log("2. Per-page specifics");
{
  const index = read("index.html");
  ok(!index.includes('class="plate'), "index: plates removed from hero");
  ok(index.includes('class="ekg-track"'), "index: seamless EKG marquee present");
  ok(count(index, "<path") >= 2 && /translate\(600 0\)/.test(index), "index: EKG wave duplicated for a seamless loop");
  ok(index.includes("hero__motes"), "index: hero motes present");
  ok(index.includes("fig-float"), "index: figure float wrapper present");
  ok(/<\/div>\s*<span class="fig-core">/.test(index), "index: orbital core sits OUTSIDE the spin group (stable 3D sphere)");
  ok(!index.includes('class="tick">○'), "index: off-centre ○ glyph removed from system radios");
  ok(count(index, 'class="tick"><svg') >= 4, "index: system radios use a centred svg circle");

  const dash = read("dashboard.html");
  ok(count(dash, 'class="plate plate--') === 2, "dashboard: both plaques moved here");
  ok(dash.includes("hero__figure--sonar"), "dashboard: sonar figure present");
  ok(dash.includes("Dr. Sarah Reid"), "dashboard: Dr. Sarah Reid plaque present");
  ok(dash.includes('class="cta-band'), "dashboard: closing CTA band present");

  const conc = read("concierge.html");
  ok(/<section class="section section--night" id="stage">/.test(conc), "concierge: stage section is night-themed");
  ok(conc.includes("hero__figure--radar"), "concierge: radar figure present");

  const doc = read("doctors.html");
  ok(doc.includes('src="img/elena-marchetti.jpg"'), "doctors: Elena Marchetti photo wired in");
  ok(doc.includes("hero__figure--sphere"), "doctors: sphere figure present");

  const book = read("booking.html");
  ok(book.includes("hero__figure--dial"), "booking: dial figure present");
  ok(!book.includes("Orientation consultation"), "booking: 'Orientation consultation' renamed");
  ok(book.includes("<b>Consultation</b>"), "booking: 'Consultation' label present");
  ok(count(book, 'class="chk"') === 2, "booking: checkmarks exist in steps 3 and 4");
  ok(count(book, 'class="num"') === 2, "booking: step numbers wrapped for toggling");
  ok(book.includes('id="bookingFoot"'), "booking: confirm-button foot has an id (hidden after confirm)");
}

/* --- 3. Local references resolve ----------------------------------------- */
console.log("3. Local asset references");
for (const page of PAGES) {
  const html = read(page);
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((m) => m[1])
    .filter((u) => !/^(https?:|mailto:|tel:)/.test(u));
  for (const ref of refs) {
    ok(existsSync(join(ROOT, ref)), `${page}: missing local file "${ref}"`);
  }
}
for (const cssFile of CSS) {
  const css = read(cssFile);
  for (const m of css.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) {
    const u = m[1];
    if (/^(data:|https?:)/.test(u)) continue;
    ok(existsSync(join(ROOT, u)), `${cssFile}: missing url() asset "${u}"`);
  }
}
ok(!existsSync(join(ROOT, "img/avenir-logo.jpg")), "img/avenir-logo.jpg removed (sky-blue logo gone)");
ok(existsSync(join(ROOT, "img/avenir-mark-64.png")) && existsSync(join(ROOT, "img/avenir-mark-256.png")),
   "favicon monogram PNGs present");
ok(existsSync(join(ROOT, "video/why-bg.mp4")), "video/why-bg.mp4 exists");

/* --- 4. CSS sanity -------------------------------------------------------- */
console.log("4. CSS sanity");
for (const cssFile of CSS) {
  const css = read(cssFile);
  ok(count(css, "\\{") === count(css, "\\}"), `${cssFile}: braces balanced`);
  ok(!css.includes("#fx-particles"), `${cssFile}: no leftover particle-canvas styles`);
  ok(!css.includes("favicon.svg"), `${cssFile}: no stale favicon.svg reference`);
}
{
  const fx = read("effects.css");
  ok(fx.includes(".fx-halo"), "effects.css: calm cursor halo styled");
  ok(fx.includes(".footer") && /\.footer\s*\{[^}]*radial-gradient/.test(fx), "effects.css: dark footer theme");
  ok(/\.nav\.scrolled\s*\{[^}]*rgba\(8, 21, 18/.test(fx), "effects.css: dark scrolled nav");
  ok(fx.includes("body::before"), "effects.css: background grid texture");
  ok(!fx.includes("avenir-logo.jpg") && !fx.includes("brand__mark"), "effects.css: sky-blue logo image removed");
  ok(/\.brand__name\s*\{[^}]*font-weight:\s*800/.test(fx), "effects.css: wordmark is bold (800)");
  ok(/\.nav \.brand__name\s*\{[^}]*text-shadow/.test(fx), "effects.css: wordmark has contrast/glow shadow");
  ok(/\.brand__name small\s*\{[^}]*white-space:\s*nowrap/.test(fx), "effects.css: header subtitle stays one line (no header balloon)");
  ok(/\.fig-core\s*\{[^}]*box-shadow:[\s\S]*?inset/.test(fx), "effects.css: orbital core has volumetric inset shading");
  ok(/\.ekg-lg svg\s*\{[^}]*height:\s*100%/.test(fx), "effects.css: ekg svg pinned to box height (down-spikes not clipped)");
  ok(/object-position:\s*55% 50%/.test(fx), "effects.css: Elena portrait centred");
  ok(!fx.includes("backdrop-filter: blur(12px)"), "effects.css: glass panels no longer backdrop-blur");
  ok(fx.includes("@keyframes ekg-slide"), "effects.css: seamless EKG keyframes");
  ok(fx.includes(".hero__figure--radar") && fx.includes(".sonar-ring") && fx.includes(".dial-ticks") && fx.includes(".sph-ring"),
     "effects.css: all four page figures styled");
}
{
  const st = read("styles.css");
  ok(!/\.reveal\s*\{[^}]*will-change\s*:/.test(st), "styles.css: .reveal no longer forces GPU layers");
}
{
  const pg = read("pages.css");
  ok(/\.cta-band::after\s*\{[^}]*pointer-events:\s*none/.test(pg),
     "pages.css: CTA glow circle ignores clicks (buttons stay clickable)");
}

/* --- 5. JS sanity ---------------------------------------------------------- */
console.log("5. JS syntax + behaviours");
for (const jsFile of JS) {
  try { execFileSync("node", ["--check", join(ROOT, jsFile)], { stdio: "pipe" }); passed++; }
  catch (e) { fail(`${jsFile}: syntax error\n${e.stderr}`); }
}
{
  const main = read("main.js");
  ok(main.includes("ioHide") && main.includes('classList.remove("is-visible")'),
     "main.js: reveals replay (visibility is removed offscreen)");
  const fx = read("effects.js");
  ok(!fx.includes('createElement("canvas")'), "effects.js: particle canvas removed");
  ok(fx.includes("fx-halo"), "effects.js: cursor halo present");
  ok(/\(tx - x\) \* 0\.1[6-9]/.test(fx) && !fx.includes("* 0.085"), "effects.js: halo follows the cursor faster");
  ok(fx.includes("IntersectionObserver") && fx.includes("v.pause()"), "effects.js: video pauses offscreen");
  const book = read("booking.js");
  ok(book.includes('getElementById("bookingFoot")') && book.includes("foot.style.display"),
     "booking.js: confirm button hidden after confirming");
}

/* --- 6. Headless-Chrome smoke (opt-in: --smoke) ---------------------------- */
if (process.argv.includes("--smoke")) {
  console.log("6. Headless Chrome smoke");
  for (const page of PAGES) {
    let dom = "";
    try {
      dom = execFileSync(CHROME, [
        "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
        "--virtual-time-budget=6000", "--dump-dom", `file://${join(ROOT, page)}`,
      ], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, timeout: 60000,
           stdio: ["ignore", "pipe", "ignore"] });
    } catch (e) { fail(`${page}: Chrome failed to render (${e.message})`); continue; }
    ok(/data-year[^>]*>\d{4}</.test(dom), `${page}: scripts executed (year filled in)`);
    ok(dom.includes("fx-halo"), `${page}: cursor halo mounted`);
    if (page === "concierge.html") {
      ok(dom.includes("msg--bot"), "concierge: chat conversation rendered");
      ok(dom.includes('class="chip"'), "concierge: suggestion chips rendered");
    }
  }
}

/* --- summary ---------------------------------------------------------------- */
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
