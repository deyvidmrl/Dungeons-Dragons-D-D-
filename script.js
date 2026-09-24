const CONFIG = {
    question: "Você vai no RPG de D&D sexta?",
    yesText: "Com certeza! ⚔️",
    noText: "Não vou poder 😭",
    successMessage: "Excelente! Prepare sua ficha e os dados críticos! 🎲✨",
    escapeDistance: 110, // Distância em pixels para o botão começar a fugir
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
    let isAbsoluteSet = false;

    // Transforma o botão em absolute na primeira vez que ele foge para soltá-lo do card
    function makeAbsoluteIfNeeded() {
        if (!isAbsoluteSet) {
            const rect = noBtn.getBoundingClientRect();
            noBtn.style.position = 'absolute';
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;
            isAbsoluteSet = true;
        }
    }

    function moveButton(mouseX, mouseY) {
        if (isTransitioned) return;

        makeAbsoluteIfNeeded();

        const rect = noBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distX = btnCenterX - mouseX;
        const distY = btnCenterY - mouseY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < CONFIG.escapeDistance) {
            escapeCount++;
            escapeCountSpan.textContent = escapeCount;

            // Calcula nova posição aleatória segura dentro da tela visível
            const margin = 30;
            const maxX = window.innerWidth - rect.width - margin;
            const maxY = window.innerHeight - rect.height - margin;
            const minX = margin;
            const minY = margin;

            let newX = margin + Math.random() * (maxX - minX);
            let newY = margin + Math.random() * (maxY - minY);

            // Garante que ele não caia em cima do card central principal
            const cardRect = mainCard.getBoundingClientRect();
            if (
                newX + rect.width > cardRect.left - 20 &&
                newX < cardRect.right + 20 &&
                newY + rect.height > cardRect.top - 20 &&
                newY < cardRect.bottom + 20
            ) {
                // Se cair muito perto do centro, joga para as bordas externas
                newX = Math.random() > 0.5 ? margin : window.innerWidth - rect.width - margin;
            }

            noBtn.style.left = `${newX}px`;
            noBtn.style.top = `${newY}px`;
        }
    }

    // Monitoramento de movimento do mouse
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            moveButton(e.clientX, e.clientY);
        });
    });

    // Monitoramento para toque em celulares
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        moveButton(touch.clientX, touch.clientY);
    });

    // Ação do botão SIM
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
