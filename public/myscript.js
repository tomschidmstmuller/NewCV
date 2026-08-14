/* =============================================
   CYBER PURPLE — Interaction Engine
   ============================================= */

// ─── Side Navigation ───
function openNav() {
  var nav = document.getElementById("mySidenav");
  if (nav) nav.style.width = "100%";
  var tri = document.getElementById("head-triangle");
  if (tri) tri.classList.add("glow");
}

function closeNav() {
  var nav = document.getElementById("mySidenav");
  if (nav) nav.style.width = "0";
  var tri = document.getElementById("head-triangle");
  if (tri) tri.classList.remove("glow");
}

// ─── Cursor Glow ───
(function initCursorGlow() {
  var glow = document.getElementById("cursor-glow");
  if (!glow) return;
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
  if (!canvas) return;
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
      hue: Math.random() > 0.5 ? 270 : 320 // purple or magenta hues
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse repel
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

      // Connection lines
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

// ─── Work Card Tilt ───
(function initCardTilt() {
  var cards = document.querySelectorAll(".work-item");
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        "perspective(800px) rotateY(" + x * 6 + "deg) rotateX(" + (-y * 6) + "deg) translateY(-6px) scale(1.01)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)";
    });
  });
})();

// ─── Hero Terminal Typing ───
(function initTerminalType() {
  var el = document.getElementById("typewriter");
  if (!el) return;
  var words = ["Software Engineer", "Systems Enthusiast", "Self-taught Learner", "Open Source Explorer"];
  var wordIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  function type() {
    var current = words[wordIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 400);
      return;
    }

    setTimeout(type, isDeleting ? 40 : 80);
  }
  type();
})();

// ─── Section Reveal Observer ───
(function initSectionReveal() {
  var sections = document.querySelectorAll("section");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach(function (section) {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(section);
  });
})();
