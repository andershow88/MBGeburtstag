(function () {
  const params = new URLSearchParams(window.location.search);
  const rawName = params.get("name");
  const name = rawName ? decodeURIComponent(rawName) : null;
  const displayName = name || "du wundervoller Mensch";

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("bday-name").textContent = displayName;
    document.title = name
      ? "Alles Gute, " + name + "!"
      : "Alles Gute zum Geburtstag!";

    initParticles();
    launchFloatingElements();

    setTimeout(function () {
      document.querySelector(".loading-overlay").classList.add("hidden");
    }, 400);
  });

  // --- Particle background ---
  function initParticles() {
    var canvas = document.getElementById("particles-canvas");
    var ctx = canvas.getContext("2d");
    var particles = [];
    var count = window.innerWidth < 600 ? 40 : 80;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color:
          Math.random() > 0.7
            ? "197, 164, 109"
            : "255, 255, 255",
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.color + "," + p.alpha + ")";
        ctx.fill();
      }

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              "rgba(197, 164, 109," + 0.06 * (1 - dist / 120) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // --- Floating emoji elements on page load ---
  function launchFloatingElements() {
    var emojis = [
      "\u{1F388}","\u{2B50}","\u{1F381}","\u{1F389}","\u{1F382}",
      "\u{2728}","\u{1F496}","\u{1F38A}","\u{1F31F}","\u{1F386}"
    ];
    var container = document.querySelector(".floating-elements");

    for (var i = 0; i < 20; i++) {
      (function (index) {
        setTimeout(function () {
          var el = document.createElement("span");
          el.className = "floating-element";
          el.textContent = emojis[index % emojis.length];
          el.style.left = Math.random() * 90 + 5 + "%";
          el.style.fontSize = Math.random() * 20 + 16 + "px";
          el.style.animationDuration = Math.random() * 4 + 5 + "s";
          el.style.animationDelay = "0s";
          container.appendChild(el);
          el.addEventListener("animationend", function () {
            el.remove();
          });
        }, index * 200);
      })(i);
    }
  }

  // --- Confetti ---
  window.startSurprise = function () {
    var canvas = document.querySelector(".confetti-canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var confetti = [];
    var colors = [
      "#c5a46d","#d4bb8a","#ffffff","#f5c542",
      "#e8a87c","#41b3a3","#e27d60","#85cdca",
    ];

    for (var i = 0; i < 200; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
      });
    }

    var frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      for (var i = 0; i < confetti.length; i++) {
        var c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.rotSpeed;
        c.vy += 0.04;
        if (frame > 120) c.alpha -= 0.01;
        if (c.alpha <= 0) continue;
        alive = true;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, c.alpha);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
      frame++;
      if (alive) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    draw();

    launchFloatingElements();
  };

  // --- Link generator ---
  window.generateLink = function () {
    var input = document.getElementById("name-input");
    var val = input.value.trim();
    if (!val) {
      input.focus();
      return;
    }
    var base = window.location.origin + window.location.pathname;
    var link = base + "?name=" + encodeURIComponent(val);
    var output = document.getElementById("link-output");
    output.textContent = link;
    output.classList.add("visible");
    document.getElementById("btn-copy").classList.add("visible");
  };

  window.copyLink = function () {
    var output = document.getElementById("link-output");
    var text = output.textContent;
    navigator.clipboard.writeText(text).then(function () {
      var btn = document.getElementById("btn-copy");
      btn.textContent = "Kopiert!";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = "Link kopieren";
        btn.classList.remove("copied");
      }, 2000);
    });
  };
})();
