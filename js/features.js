const features = [
    {
        title: "Scripted menus and submenus",
        desc: "Full Lua and HScript support for creating custom menus, submenus, UI pages and transitions.",
        img: "assets/images/engine-branding/iconbg.jpg"
    },
    {
        title: "Easy modability",
        desc: "A clean workflow and organized structure that makes creating, editing and customizing mods much easier.",
        img: "assets/images/engine-branding/brandpitcure.png"
    },
    {
        title: "Unique Mod Support",
        desc: "Automatic mod detection, extended mod data, and safer loading systems.",
        img: "assets/images/engine-branding/icon.png"
    },
    {
        title: "Game Console (F2)",
        desc: "Access the built-in console to inspect variables, debug scripts, and input commands.",
        img: "assets/images/engine-branding/iconbg.jpg"
    },
    {
        title: "RuleScript Integration",
        desc: "Advanced HScript extensions with clean, flexible and powerful syntax.",
        img: "assets/images/engine-branding/icon.png"
    }
];

let current = 0;

function updateFeature() {
    const f = features[current];
    document.getElementById("featureTitle").textContent = f.title;
    document.getElementById("featureDescription").textContent = f.desc;
    document.getElementById("featureImage").src = f.img;
}

document.getElementById("arrowLeft").onclick = () => {
    current = (current - 1 + features.length) % features.length;
    updateFeature();
};

document.getElementById("arrowRight").onclick = () => {
    current = (current + 1) % features.length;
    updateFeature();
};
