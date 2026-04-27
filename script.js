(function () {
  var params = new URLSearchParams(window.location.search);
  var form = params.get("form") === "sie" ? "sie" : "du";
  var rawName = params.get("name");
  var rawAnrede = params.get("anrede");
  var name = rawName ? decodeURIComponent(rawName) : null;
  var anrede = rawAnrede === "Frau" ? "Frau" : "Herr";

  document.addEventListener("DOMContentLoaded", function () {
    if (form === "sie" && name) {
      // Sie-Form
      document.getElementById("bday-name").textContent = anrede + " " + name;
      var subtitleEl = document.querySelector(".birthday-subtitle");
      if (subtitleEl) {
        subtitleEl.innerHTML =
          "Heute ist Ihr Tag! Ich wünsche Ihnen von ganzem Herzen " +
          "viel Gesundheit, Erfolg und Freude am Leben – " +
          "der Rest kommt dann eh! Lassen Sie sich feiern!";
      }
      var greetingEl = document.querySelector(".birthday-greeting");
      if (greetingEl) {
        greetingEl.innerHTML = "Schöne Grüße,<br>Anderson Büttenbender";
      }
      document.title = "Alles Gute, " + anrede + " " + name + "!";
    } else {
      // Du-Form (Default)
      var displayName = name || "du wundervoller Mensch";
      document.getElementById("bday-name").textContent = displayName;
      document.title = name
        ? "Alles Gute, " + name + "!"
        : "Alles Gute zum Geburtstag!";
    }

    initParticles();
    runIntroSequence();
    initFormToggle();
  });

  function initFormToggle() {
    var btns = document.querySelectorAll(".form-toggle-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.dataset.form;
        btns.forEach(function (b) { b.classList.toggle("active", b === btn); });
        document.getElementById("form-fields-du").style.display = (f === "du") ? "" : "none";
        document.getElementById("form-fields-sie").style.display = (f === "sie") ? "" : "none";
        // Output zurücksetzen, weil ein vorher generierter Link nicht mehr passt
        var output = document.getElementById("link-output");
        if (output) { output.textContent = ""; output.classList.remove("visible"); }
        var copyBtn = document.getElementById("btn-copy");
        if (copyBtn) copyBtn.classList.remove("visible");
        // Fokus aufs erste Eingabefeld der aktiven Form
        setTimeout(function () {
          var firstInput = document.querySelector(
            (f === "sie" ? "#form-fields-sie" : "#form-fields-du") + " input[type=text]"
          );
          if (firstInput) firstInput.focus();
        }, 50);
      });
    });
  }

  // --- Intro: Cake + Beer crack open ---
  function runIntroSequence() {
    var overlay = document.getElementById("intro-overlay");

    setTimeout(function () {
      overlay.classList.add("cracking");
    }, 2600);

    setTimeout(function () {
      overlay.classList.add("split");
    }, 5200);

    setTimeout(function () {
      overlay.classList.add("done");
      launchFloatingElements();
    }, 7200);
  }

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
        color: Math.random() > 0.85 ? "168, 57, 107" : Math.random() > 0.6 ? "197, 164, 109" : "255, 255, 255",
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

  // --- Floating emoji elements ---
  function launchFloatingElements() {
    var emojis = [
      "\u{1F388}","\u{2B50}","\u{1F381}","\u{1F389}","\u{1F382}",
      "\u{2728}","\u{1F496}","\u{1F38A}","\u{1F31F}","\u{1F386}",
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

  // --- Falling Merkur logos ---
  function launchFallingLogos() {
    for (var i = 0; i < 15; i++) {
      (function (index) {
        setTimeout(function () {
          var img = document.createElement("img");
          img.src = "merkur-logo.svg";
          img.className = "falling-logo";
          var size = Math.random() * 40 + 25;
          img.style.width = size + "px";
          img.style.left = Math.random() * 95 + "%";
          img.style.top = "-60px";
          img.style.setProperty("--logo-rot", (Math.random() * 1080 + 360) + "deg");
          img.style.animationDuration = Math.random() * 3 + 3 + "s";
          img.style.opacity = "0";
          document.body.appendChild(img);
          img.addEventListener("animationend", function () {
            img.remove();
          });
        }, index * 250);
      })(i);
    }
  }

  // --- Confetti + logos ---
  window.startSurprise = function () {
    var canvas = document.querySelector(".confetti-canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var confetti = [];
    var colors = [
      "#c5a46d","#d4bb8a","#ffffff","#f5c542",
      "#e8a87c","#41b3a3","#e27d60","#85cdca","#a8396b","#c4548a",
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
    launchFallingLogos();
  };

  // --- Link generator ---
  window.generateLink = function () {
    var activeBtn = document.querySelector(".form-toggle-btn.active");
    var activeForm = activeBtn ? activeBtn.dataset.form : "du";
    var base = window.location.origin + window.location.pathname;
    var link;

    if (activeForm === "sie") {
      var anredeVal = document.getElementById("anrede-input").value || "Herr";
      var nachnameInput = document.getElementById("nachname-input");
      var nachname = nachnameInput.value.trim();
      if (!nachname) { nachnameInput.focus(); return; }
      link = base
        + "?form=sie"
        + "&anrede=" + encodeURIComponent(anredeVal)
        + "&name=" + encodeURIComponent(nachname);
    } else {
      var input = document.getElementById("name-input");
      var val = input.value.trim();
      if (!val) { input.focus(); return; }
      link = base + "?name=" + encodeURIComponent(val);
    }

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
