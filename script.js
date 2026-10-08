const CONFIG = {
question: "Você vai no RPG de D&D sexta?",
yesText: "Com certeza! ⚔️",
noText: "Não vou poder 😭",
successMessage: "Excelente! Prepare sua ficha e os dados críticos! 🎲✨",

```
// Distância além das bordas do botão.
// Aumente para fugir mais cedo; diminua para fugir mais tarde.
escapeDistance: 18,

enableCounter: true,
screenPadding: 16,
maxAttempts: 80
```

};

document.addEventListener("DOMContentLoaded", () => {
const questionText = document.getElementById("questionText");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const counterBox = document.getElementById("counterBox");
const escapeCountSpan = document.getElementById("escapeCount");
const mainCard = document.getElementById("mainCard");
const buttonsWrapper = document.getElementById("buttonsWrapper");

```
if (
    !questionText || !yesBtn || !noBtn ||
    !counterBox || !escapeCountSpan ||
    !mainCard || !buttonsWrapper
) {
    console.error("Não foi possível encontrar todos os elementos do site.");
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

// Guarda a posição do cursor para não fugir repetidamente
// durante o mesmo movimento.
let lastPointerX = null;
let lastPointerY = null;

function makeFixed() {
    if (isFixed) return;

    const rect = noBtn.getBoundingClientRect();

    noBtn.style.position = "fixed";
    noBtn.style.left = `${rect.left}px`;
    noBtn.style.top = `${rect.top}px`;
    noBtn.style.margin = "0";

    isFixed = true;
}

function overlaps(a, b) {
    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}

function getSafePosition() {
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

    const card = mainCard.getBoundingClientRect();

    for (let i = 0; i < CONFIG.maxAttempts; i++) {
        const x = padding + Math.random() * (maxX - padding);
        const y = padding + Math.random() * (maxY - padding);

        const candidate = {
            left: x,
            top: y,
            right: x + rect.width,
            bottom: y + rect.height
        };

        // Mantém o botão fora do cartão principal.
        if (!overlaps(candidate, card)) {
            return { x, y };
        }
    }

    // Alternativa segura se não houver espaço suficiente.
    const candidates = [
        { x: padding, y: padding },
        { x: maxX, y: padding },
        { x: padding, y: maxY },
        { x: maxX, y: maxY }
    ];

    for (const position of candidates) {
        const candidate = {
            left: position.x,
            top: position.y,
            right: position.x + rect.width,
            bottom: position.y + rect.height
        };

        if (!overlaps(candidate, card)) {
            return position;
        }
    }

    // Em telas pequenas, prioriza manter o botão visível.
    return {
        x: padding,
        y: maxY
    };
}

function moveButton() {
    if (finished || moving) return;

    moving = true;
    makeFixed();

    const position = getSafePosition();

    noBtn.style.left = `${position.x}px`;
    noBtn.style.top = `${position.y}px`;

    escapeCount++;

    if (CONFIG.enableCounter) {
        escapeCountSpan.textContent = escapeCount;
    }

    // Evita que o mesmo movimento provoque fugas em sequência.
    requestAnimationFrame(() => {
        moving = false;
    });
}

function isPointerNearButton(x, y) {
    const rect = noBtn.getBoundingClientRect();
    const distance = CONFIG.escapeDistance;

    return (
        x >= rect.left - distance &&
        x <= rect.right + distance &&
        y >= rect.top - distance &&
        y <= rect.bottom + distance
    );
}

// Computador: reage apenas quando o cursor entra na área
// próxima do botão, e não em qualquer lugar da página.
document.addEventListener("mousemove", (event) => {
    if (finished || moving) return;

    const x = event.clientX;
    const y = event.clientY;

    const pointerMoved =
        lastPointerX === null ||
        Math.hypot(
            x - lastPointerX,
            y - lastPointerY
        ) > 1;

    lastPointerX = x;
    lastPointerY = y;

    if (!pointerMoved) return;

    if (isPointerNearButton(x, y)) {
        moveButton();
    }
});

// Celular: ao tocar no botão, ele escapa.
noBtn.addEventListener("pointerdown", (event) => {
    if (finished) return;

    if (event.pointerType === "touch") {
        event.preventDefault();
        moveButton();
    }
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
            colors: [
                "#d69e2e",
                "#e53e3e",
                "#ecc94b",
                "#ffffff"
            ]
        });
    }
});

// Reposiciona o botão caso a janela mude de tamanho.
window.addEventListener("resize", () => {
    if (finished || !isFixed) return;

    const rect = noBtn.getBoundingClientRect();
    const padding = CONFIG.screenPadding;

    const x = Math.max(
        padding,
        Math.min(
            rect.left,
            window.innerWidth - rect.width - padding
        )
    );

    const y = Math.max(
        padding,
        Math.min(
            rect.top,
            window.innerHeight - rect.height - padding
        )
    );

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
});
```

});
