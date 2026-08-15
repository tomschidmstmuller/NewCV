/* =============================================
   Nguyễn Ngọc Gia Khang — Interaction Engine
   v4.0 — Minimal engineering portfolio
   ============================================= */

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Mobile Drawer ───
(function initMobileNav() {
  var panel = document.getElementById("side-panel");
  if (!panel) return;
  var btn = document.getElementById("side-menu-btn");
  if (!btn) return;

  function setOpen(open) {
    panel.classList.toggle("nav-open", open);
    btn.setAttribute("aria-expanded", String(open));
  }

  btn.addEventListener("click", function () {
    setOpen(!panel.classList.contains("nav-open"));
  });

  panel.querySelectorAll(".side-nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) setOpen(false);
  });
})();

// ─── Active Nav on Scroll ───
(function initScrollSpy() {
  var links = document.querySelectorAll(".side-nav-links a[href^='#']");
  if (!links.length) return;
  var sections = Array.prototype.map.call(links, function (link) {
    return document.getElementById(link.getAttribute("href").slice(1));
  }).filter(Boolean);
  if (!sections.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();

// ─── Section Reveal ───
(function initReveal() {
  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
