function getSafePosition() {
const rect = noBtn.getBoundingClientRect();
const padding = CONFIG.screenPadding;

```
const maxX = Math.max(
    padding,
    window.innerWidth - rect.width - padding
);

const maxY = Math.max(
    padding,
    window.innerHeight - rect.height - padding
);

const card = mainCard.getBoundingClientRect();

for (let i = 0; i < 150; i++) {
    const x = padding + Math.random() * (maxX - padding);
    const y = padding + Math.random() * (maxY - padding);

    const candidate = {
        left: x,
        top: y,
        right: x + rect.width,
        bottom: y + rect.height
    };

    const overlapsCard =
        candidate.left < card.right &&
        candidate.right > card.left &&
        candidate.top < card.bottom &&
        candidate.bottom > card.top;

    if (!overlapsCard) {
        return { x, y };
    }
}

// Se não encontrar espaço fora do cartão,
// coloca o botão em uma posição visível.
const fallbackX = Math.max(
    padding,
    Math.min(maxX, window.innerWidth - rect.width - padding)
);

const fallbackY = Math.max(
    padding,
    Math.min(maxY, window.innerHeight - rect.height - padding)
);

return {
    x: fallbackX,
    y: fallbackY
};
```

}
