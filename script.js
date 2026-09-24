const CONFIG = {
    question: "Você vai no RPG de D&D sexta?",
    yesText: "Com certeza! ⚔️",
    noText: "Não vou poder 😭",
    successMessage: "Excelente! Prepare sua ficha e os dados críticos! 🎲✨",
    escapeDistance: 90, // Distância em pixels para começar a fugir
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
    let isFixedSet = false;

    // Transforma o botão em fixed na primeira tentativa de fuga para saltar livremente pelo ecrã
    function makeFixedIfNeeded() {
        if (!isFixedSet) {
            const rect = noBtn.getBoundingClientRect();
            noBtn.style.position = 'fixed';
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;
            isFixedSet = true;
        }
    }

    function moveButton(mouseX, mouseY) {
        if (isTransitioned) return;

        makeFixedIfNeeded();

        const rect = noBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distX = btnCenterX - mouseX;
        const distY = btnCenterY - mouseY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < CONFIG.escapeDistance) {
            escapeCount++;
            escapeCountSpan.textContent = escapeCount;

            // Margens de segurança para o botão nunca sumir para fora da janela
            const padding = 20;
            const maxX = window.innerWidth - rect.width - padding;
            const maxY = window.innerHeight - rect.height - padding;
            const minX = padding;
            const minY = padding;

            let randomX = Math.floor(minX + Math.random() * (maxX - minX));
            let randomY = Math.floor(minY + Math.random() * (maxY - minY));

            // Garante que ele não salte para cima do cartão principal no centro
            const cardRect = mainCard.getBoundingClientRect();
            const overlapsCard = (
                randomX < cardRect.right &&
                randomX + rect.width > cardRect.left &&
                randomY < cardRect.bottom &&
                randomY + rect.height > cardRect.top
            );

            if (overlapsCard) {
                // Se cair em cima do cartão, joga para as extremidades laterais
                randomX = randomX > window.innerWidth / 2 ? window.innerWidth - rect.width - padding : padding;
            }

            noBtn.style.left = `${randomX}px`;
            noBtn.style.top = `${randomY}px`;
        }
    }

    // Eventos para computador (mouse) e telemóvel (touch)
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

    // Ação ao clicar no botão SIM
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
