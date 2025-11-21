// /js/features.js
(function () {
  const FEATURES = [
    {
      title: "Scripted Menus & Submenus",
      description:
        "Create full custom menus using Lua or HScript, including submenus, transitions, and dynamic UI elements.",
      image: "assets/images/features/feature1.png",
      alt: "Custom scripted menu with submenu transitions"
    },
    {
      title: "Easy Moddability",
      description:
        "A clean folder structure and engine tools designed to make modding simple, readable, and fast.",
      image: "assets/images/features/feature2.png",
      alt: "Folders and tools for quick modding"
    },
    {
      title: "Unique Mod Support",
      description:
        "ALE Psych [Rewritten] lets each mod define its own logic, resources, and systems without conflicts.",
      image: "assets/images/features/feature3.png",
      alt: "Multiple mods listed without conflicts"
    },
    {
      title: "In-Game Console (F2)",
      description:
        "Debug your mod with a powerful in-game console supporting commands, log output, and error reports.",
      image: "assets/images/features/feature4.png",
      alt: "In-game console showing logs and commands"
    },
    {
      title: "RuleScript Integration",
      description:
        "Supercharge your HScript mods with RuleScript, unlocking big scripting capabilities and advanced behaviors.",
      image: "assets/images/features/feature5.png",
      alt: "RuleScript code sample"
    },
    {
      title: "Community Driven",
      description:
        "ALE Psych evolves with its user base. Suggestions, mods, and feedback directly shape the engine.",
      image: "assets/images/features/feature6.png",
      alt: "Community discussion and feedback"
    }
  ];

  const content = document.getElementById("featureContent");
  const img = document.getElementById("featureImage");
  const title = document.getElementById("featureTitle");
  const desc = document.getElementById("featureDescription");
  const left = document.getElementById("arrowLeft");
  const right = document.getElementById("arrowRight");
  const carousel = document.getElementById("featureCarousel");
  if (!content || !img || !title || !desc || !left || !right || !carousel) return;

  let index = 0;
  let hover = false;
  let autoplayId = null;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const OUT_MS = 220;
  const IN_MS = 220;
  const AUTO_MS = 5000;

  function render(i) {
    const f = FEATURES[i];
    img.src = f.image;
    img.alt = f.alt || f.title || "";
    title.textContent = f.title;
    desc.textContent = f.description;
  }

  function animateOut(dir) {
    if (REDUCED) return Promise.resolve();
    return new Promise((resolve) => {
      content.classList.add(dir === "right" ? "transition-out-right" : "transition-out-left");
      setTimeout(() => {
        content.classList.remove("transition-out-right", "transition-out-left");
        resolve();
      }, OUT_MS);
    });
  }

  function animateIn(dir) {
    if (REDUCED) return;
    const cls = dir === "right" ? "transition-in-right" : "transition-in-left";
    content.classList.add(cls);
    setTimeout(() => content.classList.remove(cls), IN_MS);
  }

  async function go(delta) {
    const next = (index + delta + FEATURES.length) % FEATURES.length;
    await animateOut(delta > 0 ? "right" : "left");
    index = next;
    render(index);
    animateIn(delta > 0 ? "right" : "left");
  }

  function init() {
    content.classList.add("loading");
    render(index);
    requestAnimationFrame(() => content.classList.remove("loading"));
  }

  left.addEventListener("click", () => go(-1));
  right.addEventListener("click", () => go(1));

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  });

  ["mouseenter", "focusin"].forEach((ev) => carousel.addEventListener(ev, () => { hover = true; }));
  ["mouseleave", "focusout"].forEach((ev) => carousel.addEventListener(ev, () => { hover = false; }));

  let startX = null;
  content.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  content.addEventListener("touchend", (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx > 0 ? -1 : 1);
    startX = null;
  }, { passive: true });

  function autoStart() {
    if (REDUCED || autoplayId) return;
    autoplayId = setInterval(() => { if (!hover) go(1); }, AUTO_MS);
  }
  function autoStop() { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } }
  document.addEventListener("visibilitychange", () => { if (document.hidden) autoStop(); else autoStart(); });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { init(); autoStart(); });
  } else {
    init();
    autoStart();
  }
})();
