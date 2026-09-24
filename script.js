const CONFIG = {
    question: "Você vai no RPG de D&D sexta?",
    yesText: "Com certeza! ⚔️",
    noText: "Não vou poder 😭",
    successMessage: "Excelente! Prepare sua ficha e os dados críticos! 🎲✨",
    escapeDistance: 90, // Distância em pixels para o botão comecar a fugir
    enableCounter: true
};

document.addEventListener('DOMContentLoaded', () => {
    const questionText = document.getElementById('questionText');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const counterBox = document.getElementById('counterBox');
    const escapeCountSpan = document.getElementById('escapeCount');
    const mainCard = document.getElementById('mainCard');

    questionText.textContent = CONFIG.question;
    yesBtn.textContent = CONFIG.yesText;
    noBtn.textContent = CONFIG.noText;
    
    if (!CONFIG.enableCounter) {
        counterBox.style.display = 'none';
    }

    let escapeCount = 0;
    let isTransitioned = false;
    
    // Posição atual acumulada do botão em relação ao seu sítio original
    let currentX = 0;
    let currentY = 0;

    function moveButton(mouseX, mouseY) {
        if (isTransitioned) return;

        const rect = noBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distX = btnCenterX - mouseX;
        const distY = btnCenterY - mouseY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < CONFIG.escapeDistance) {
            escapeCount++;
            escapeCountSpan.textContent = escapeCount;

            // Direção de fuga baseada na posição do rato/toque
            const angle = Math.atan2(distY, distX);
            const moveDistance = 80 + Math.random() * 40;

            currentX += Math.cos(angle) * moveDistance;
            currentY += Math.sin(angle) * moveDistance;

            // Limites rígidos para garantir que o botão nunca sai do cartão principal
            const limitX = 110;
            const limitY = 70;

            currentX = Math.max(-limitX, Math.min(currentX, limitX));
            currentY = Math.max(-limitY, Math.min(currentY, limitY));

            noBtn.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    // Eventos de movimento do rato e toque em telemóveis
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            moveButton(e.clientX, e.clientY);
        });
    });

    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        moveButton(touch.clientX, touch.clientY);
    });

    // Ação ao clicar no SIM
    yesBtn.addEventListener('click', () => {
        if (isTransitioned) return;
        isTransitioned = true;

        noBtn.style.display = 'none';
        questionText.textContent = CONFIG.successMessage;
        counterBox.style.display = 'none';
        yesBtn.style.display = 'none';

        mainCard.style.transform = 'scale(1.05)';
        setTimeout(() => {
            mainCard.style.transform = 'scale(1)';
        }, 200);

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#d69e2e', '#e53e3e', '#ecc94b', '#ffffff']
            });
        }
    });
});
