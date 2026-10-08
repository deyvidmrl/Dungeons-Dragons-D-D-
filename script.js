
function moveButton(mouseX, mouseY) {
    if (isTransitioned || moving) return;

    const rect = noBtn.getBoundingClientRect();

    // Distância entre o cursor e o centro do botão
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(centerX - mouseX, centerY - mouseY);

    // Só foge quando o cursor realmente se aproxima
    if (distance >= CONFIG.escapeDistance) return;

    moving = true;

    // Limites seguros da tela
    const padding = 12;
    const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
    const maxY = Math.max(padding, window.innerHeight - rect.height - padding);

    // Procura uma posição distante do cursor
    let newX = rect.left;
    let newY = rect.top;
    let bestDistance = -1;

    for (let i = 0; i < 40; i++) {
        const candidateX = padding + Math.random() * (maxX - padding);
        const candidateY = padding + Math.random() * (maxY - padding);
        const candidateDistance = Math.hypot(
            candidateX + rect.width / 2 - mouseX,
            candidateY + rect.height / 2 - mouseY
        );

        if (candidateDistance > bestDistance) {
            bestDistance = candidateDistance;
            newX = candidateX;
            newY = candidateY;
        }
    }

    // Garante posicionamento fixo dentro da janela
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${Math.min(maxX, Math.max(padding, newX))}px`;
    noBtn.style.top = `${Math.min(maxY, Math.max(padding, newY))}px`;

    if (CONFIG.enableCounter) {
        escapeCount++;
        escapeCountSpan.textContent = escapeCount;
    }

    // Evita saltos em sequência enquanto o botão está se movendo
    setTimeout(() => {
        moving = false;
    }, 250);
}
