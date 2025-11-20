// =========================
//  FEATURE DATA
// =========================

const FEATURES = [
    {
        title: "Scripted Menus & Submenus",
        description: "Create full custom menus using Lua or HScript, including submenus, transitions, and dynamic UI elements.",
        image: "assets/images/features/feature1.png"
    },
    {
        title: "Easy Moddability",
        description: "A clean folder structure and engine tools designed to make modding simple, readable, and fast.",
        image: "assets/images/features/feature2.png"
    },
    {
        title: "Unique Mod Support",
        description: "ALE Psych [Rewritten] lets each mod define its own logic, resources, and systems without conflicts.",
        image: "assets/images/features/feature3.png"
    },
    {
        title: "In-Game Console (F2)",
        description: "Debug your mod with a powerful in-game console supporting commands, log output, and error reports.",
        image: "assets/images/features/feature4.png"
    },
    {
        title: "RuleScript Integration",
        description: "Supercharge your HScript mods with RuleScript, unlocking big scripting capabilities and advanced behaviors.",
        image: "assets/images/features/feature5.png"
    },
    {
        title: "Community Driven",
        description: "ALE Psych evolves with its user base. Suggestions, mods, and feedback directly shape the engine.",
        image: "assets/images/features/feature6.png"
    }
];


// =========================
//  STATE
// =========================
let currentIndex = 0;


// =========================
//  SELECTORS
// =========================
const featureContent = document.getElementById("featureContent");
const featureImage = document.getElementById("featureImage");
const featureTitle = document.getElementById("featureTitle");
const featureDescription = document.getElementById("featureDescription");

const leftArrow = document.getElementById("arrowLeft");
const rightArrow = document.getElementById("arrowRight");


// =========================
//  LOAD FEATURE
// =========================
function loadFeature(index) {
    const f = FEATURES[index];

    // Fade-out (small animation)
    featureContent.style.opacity = 0;

    setTimeout(() => {
        featureImage.src = f.image;
        featureTitle.textContent = f.title;
        featureDescription.textContent = f.description;

        // Fade-in
        featureContent.style.opacity = 1;

        // Remove placeholder state
        featureContent.classList.remove("loading");
    }, 180);
}


// =========================
//  ARROW HANDLERS
// =========================
leftArrow.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = FEATURES.length - 1;
    loadFeature(currentIndex);
});

rightArrow.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= FEATURES.length) currentIndex = 0;
    loadFeature(currentIndex);
});


// =========================
//  INITIAL LOAD
// =========================
document.addEventListener("DOMContentLoaded", () => {
    loadFeature(0); // Load the first feature automatically
});
