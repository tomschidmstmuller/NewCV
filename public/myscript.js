/* =============================================
   NGOC GIA KHANG — Interaction Engine
   v3.0 — Developer Workstation
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

// ─── Cursor Glow ───
(function initCursorGlow() {
  var glow = document.getElementById("cursor-glow");
  if (!glow || reduceMotion) return;
  var x = window.innerWidth / 2, y = window.innerHeight / 2;

  document.addEventListener("mousemove", function (e) {
    x = e.clientX;
    y = e.clientY;
    glow.style.opacity = "1";
  });

  document.addEventListener("mouseleave", function () {
    glow.style.opacity = "0";
  });

  function tick() {
    var cx = parseFloat(glow.style.left) || window.innerWidth / 2;
    var cy = parseFloat(glow.style.top) || window.innerHeight / 2;
    glow.style.left = cx + (x - cx) * 0.08 + "px";
    glow.style.top = cy + (y - cy) * 0.08 + "px";
    requestAnimationFrame(tick);
  }
  tick();
})();

// ─── Particle System ───
(function initParticles() {
  var canvas = document.getElementById("particle-canvas");
  if (!canvas || reduceMotion) return;
  var ctx = canvas.getContext("2d");
  var particles = [];
  var mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  var count = Math.min(80, Math.floor(window.innerWidth / 12));

  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      hue: Math.random() > 0.5 ? 270 : 320
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      var dx = mouse.x - p.x;
      var dy = mouse.y - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        var force = (200 - dist) / 200 * 0.5;
        p.vx -= (dx / dist) * force * 0.05;
        p.vy -= (dy / dist) * force * 0.05;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(" + p.hue + ", 80%, 60%, " + p.alpha + ")";
      ctx.fill();

      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx2 = p.x - p2.x;
        var dy2 = p.y - p2.y;
        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = "hsla(270, 60%, 60%, " + (1 - dist2 / 120) * 0.08 + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

// ─── Magnetic Buttons ───
(function initMagneticButtons() {
  if (reduceMotion) return;
  var buttons = document.querySelectorAll(".btn-neon, .btn-neon-outline");
  buttons.forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform =
        "translate(" + x * 0.15 + "px, " + y * 0.15 + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "translate(0, 0)";
    });
  });
})();

// ─── Project Card Tilt ───
(function initCardTilt() {
  if (reduceMotion) return;
  var cards = document.querySelectorAll(".project-card");
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        "perspective(800px) rotateY(" + x * 3 + "deg) rotateX(" + (-y * 3) + "deg) translateY(-4px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)";
    });
  });
})();
