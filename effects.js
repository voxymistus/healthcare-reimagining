/* =========================================================================
   Avenir — interaction layer
   Calm cursor halo · mouse parallax · scroll parallax · morphing text ·
   card tilt · offscreen video pause.
   Performance rules: transform/opacity only, one rAF per concern, no canvas.
   All effects are opt-out under reduced motion / touch / no-pointer.
   ========================================================================= */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* === 1. Calm cursor halo — a single soft glow that drifts after the
         cursor. One element, transform-only, no per-frame painting. ====== */
  function initCursorHalo() {
    if (reduce || !finePointer) return;

    const halo = document.createElement("div");
    halo.className = "fx-halo";
    halo.setAttribute("aria-hidden", "true");
    document.body.appendChild(halo);

    let tx = -800, ty = -800, x = tx, y = ty, raf = null, shown = false;

    const loop = () => {
      x += (tx - x) * 0.16;   // snappier follow — keeps closer to the cursor
      y += (ty - y) * 0.16;
      halo.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    };

    addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { x = tx; y = ty; shown = true; halo.classList.add("is-on"); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => halo.classList.remove("is-on"));
    document.documentElement.addEventListener("mouseenter", () => { if (shown) halo.classList.add("is-on"); });
  }

  /* === 2. Mouse parallax (hero depth) =================================== */
  function initMouseParallax() {
    if (reduce || !finePointer) return;
    const hero = document.querySelector(".hero");
    if (!hero) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      hero.style.setProperty("--mx", cx.toFixed(4));
      hero.style.setProperty("--my", cy.toFixed(4));
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    };

    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    hero.addEventListener("mouseleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* === 3. Scroll parallax (depth on [data-parallax]) ==================== */
  function initScrollParallax() {
    if (reduce) return;
    const items = [...document.querySelectorAll("[data-parallax]")];
    if (!items.length) return;
    let ticking = false;

    const update = () => {
      const vh = innerHeight;
      for (const el of items) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) continue;   // offscreen: skip
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 around center
        el.style.transform = `translate3d(0, ${(-progress * speed * 100).toFixed(1)}px, 0)`;
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* === 4. Morphing text ================================================= */
  function initMorph() {
    document.querySelectorAll("[data-morph]").forEach((el) => {
      const words = el.querySelectorAll(".morph__w");
      if (words.length < 2) return;
      let i = 0;
      words[0].classList.add("is-active");
      if (reduce) return; // keep the first word, no cycling
      setInterval(() => {
        words[i].classList.remove("is-active");
        i = (i + 1) % words.length;
        words[i].classList.add("is-active");
      }, 2400);
    });
  }

  /* === 5. Card tilt on hover ============================================ */
  function initTilt() {
    if (reduce || !finePointer) return;
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
      }, { passive: true });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* === 6. Background video: pause offscreen, respect reduced motion ===== */
  function initVideo() {
    const vids = document.querySelectorAll(".videoband__bg");
    if (!vids.length) return;
    if (reduce) {
      vids.forEach((v) => { v.removeAttribute("autoplay"); try { v.pause(); } catch (e) {} });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) { if (v.paused) v.play().catch(() => {}); }
        else if (!v.paused) v.pause();
      });
    }, { rootMargin: "160px 0px" });
    vids.forEach((v) => io.observe(v));
  }

  /* --- boot ------------------------------------------------------------- */
  const boot = () => {
    initCursorHalo();
    initMouseParallax();
    initScrollParallax();
    initMorph();
    initTilt();
    initVideo();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
