/* =========================================================================
   Future Healthcare Experience — shared behaviour
   Navigation, scroll-reveal, mobile menu. Quiet and restrained by design.
   ========================================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Nav: translucent → solid on scroll ------------------------------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Mobile menu ------------------------------------------------------ */
  const toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav__menu a").forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* --- Reveal on scroll (replays every time a block is passed) ---------- */
  const revealables = document.querySelectorAll(".reveal, .reveal-fade, .reveal-zoom, .reveal-left, .reveal-right");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    // shows when the element meaningfully enters the viewport
    const ioShow = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    // resets only once the element has fully left the viewport,
    // so the animation replays on the next pass (in either direction)
    const ioHide = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) entry.target.classList.remove("is-visible");
      }),
      { threshold: 0 }
    );
    revealables.forEach((el) => { ioShow.observe(el); ioHide.observe(el); });
  }

  /* --- Footer year ------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
