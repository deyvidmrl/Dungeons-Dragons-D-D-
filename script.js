const CONFIG = {
question: "Você vai no RPG de D&D sexta?",
yesText: "Com certeza! ⚔️",
noText: "Não vou poder 😭",
successMessage: "Excelente! Prepare sua ficha e os dados críticos! 🎲✨",

```
escapeDistance: 22,
screenPadding: 12,
enableCounter: true
```

};

document.addEventListener("DOMContentLoaded", () => {
const questionText = document.getElementById("questionText");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const counterBox = document.getElementById("counterBox");
const escapeCountSpan = document.getElementById("escapeCount");
const mainCard = document.getElementById("mainCard");

```
if (!questionText || !yesBtn || !noBtn || !counterBox ||
    !escapeCountSpan || !mainCard) {
    console.error("Não foi possível encontrar os elementos da página.");
    return;
}

questionText.textContent = CONFIG.question;
yesBtn.textContent = CONFIG.yesText;
noBtn.textContent = CONFIG.noText;

if (!CONFIG.enableCounter) {
    counterBox.style.display = "none";
}

let escapeCount = 0;
let finished = false;
let isFixed = false;
let moving = false;

function keepInsideScreen(x, y, width, height) {
    const padding = CONFIG.screenPadding;

    const maxX = Math.max(
        padding,
        window.innerWidth - width - padding
    );

    const maxY = Math.max(
        padding,
        window.innerHeight - height - padding
    );

    return {
        x: Math.max(padding, Math.min(x, maxX)),
        y: Math.max(padding, Math.min(y, maxY))
    };
}

function makeFixed() {
    if (isFixed) return;

    const rect = noBtn.getBoundingClientRect();

    noBtn.style.position = "fixed";
    noBtn.style.left = `${rect.left}px`;
    noBtn.style.top = `${rect.top}px`;
    noBtn.style.margin = "0";

    isFixed = true;
}

function moveButton() {
    if (finished || moving) return;

    moving = true;
    makeFixed();

    const rect = noBtn.getBoundingClientRect();
    const padding = CONFIG.screenPadding;

    const maxX = Math.max(
        padding,
        window.innerWidth - rect.width - padding
    );

    const maxY = Math.max(
        padding,
        window.innerHeight - rect.height - padding
    );

    // Sorteia posições por toda a tela.
    // Não tenta evitar o cartão central.
    let x = padding + Math.random() * (maxX - padding);
    let y = padding + Math.random() * (maxY - padding);

    // Evita que o botão reapareça praticamente no mesmo lugar.
    const currentX = rect.left;
    const currentY = rect.top;

    if (
        Math.abs(x - currentX) < 100 &&
        Math.abs(y - currentY) < 70
    ) {
        x = x > window.innerWidth / 2
            ? padding
            : maxX;

        y = Math.random() * (maxY - padding) + padding;
    }

    const safePosition = keepInsideScreen(
        x,
        y,
        rect.width,
        rect.height
    );

    noBtn.style.left = `${safePosition.x}px`;
    noBtn.style.top = `${safePosition.y}px`;

    escapeCount++;

    if (CONFIG.enableCounter) {
        escapeCountSpan.textContent = escapeCount;
    }

    // Pequeno intervalo para evitar múltiplas fugas
    // no mesmo instante, sem bloquear as próximas tentativas.
    setTimeout(() => {
        moving = false;
    }, 120);
}

function isNearButton(x, y) {
    const rect = noBtn.getBoundingClientRect();
    const distance = CONFIG.escapeDistance;

    return (
        x >= rect.left - distance &&
        x <= rect.right + distance &&
        y >= rect.top - distance &&
        y <= rect.bottom + distance
    );
}

// Computador: só foge quando o cursor se aproxima.
document.addEventListener("mousemove", (event) => {
    if (finished || moving) return;

    if (isNearButton(event.clientX, event.clientY)) {
        moveButton();
    }
});

// Celular: foge ao tocar no botão.
noBtn.addEventListener("pointerdown", (event) => {
    if (finished || event.pointerType !== "touch") return;

    event.preventDefault();
    moveButton();
});

// Botão SIM.
yesBtn.addEventListener("click", () => {
    if (finished) return;

    finished = true;

    noBtn.style.display = "none";
    yesBtn.style.display = "none";
    counterBox.style.display = "none";

    questionText.textContent = CONFIG.successMessage;

    mainCard.style.transform = "scale(1.05)";

    setTimeout(() => {
        mainCard.style.transform = "scale(1)";
    }, 200);

    if (typeof confetti === "function") {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#d69e2e", "#e53e3e", "#ecc94b", "#ffffff"]
        });
    }
});

// Mantém o botão dentro da tela ao redimensionar a janela.
window.addEventListener("resize", () => {
    if (!isFixed || finished) return;

    const rect = noBtn.getBoundingClientRect();

    const position = keepInsideScreen(
        rect.left,
        rect.top,
        rect.width,
        rect.height
    );

    noBtn.style.left = `${position.x}px`;
    noBtn.style.top = `${position.y}px`;
});
```

});
