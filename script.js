const CONFIG = {
    question: "Você vai no RPG de D&D sexta?",
    yesText: "Com certeza! ⚔️",
    noText: "Não vou poder 😭",
    successMessage: "Excelente! Prepare sua ficha e os dados críticos! 🎲✨",

    // Distância que o mouse precisa chegar do botão para ele fugir
    escapeDistance: 45,

    enableCounter: true
};

document.addEventListener('DOMContentLoaded', () => {

    const questionText = document.getElementById('questionText');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const counterBox = document.getElementById('counterBox');
    const escapeCountSpan = document.getElementById('escapeCount');
    const mainCard = document.getElementById('mainCard');

    // ==============================
    // CONFIGURAÇÃO INICIAL
    // ==============================

    questionText.textContent = CONFIG.question;
    yesBtn.textContent = CONFIG.yesText;
    noBtn.textContent = CONFIG.noText;

    if (!CONFIG.enableCounter) {
        counterBox.style.display = 'none';
    }

    let escapeCount = 0;
    let isTransitioned = false;
    let isFixedSet = false;

    // ==============================
    // TRANSFORMA O BOTÃO EM FIXED
    // ==============================

    function makeFixedIfNeeded() {

        if (!isFixedSet) {

            const rect = noBtn.getBoundingClientRect();

            noBtn.style.position = 'fixed';
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;

            isFixedSet = true;
        }
    }

    // ==============================
    // MOVIMENTO DO BOTÃO
    // ==============================

    function moveButton(mouseX, mouseY) {

        if (isTransitioned) return;

        const rect = noBtn.getBoundingClientRect();

        /*
         * Calcula o ponto do botão mais próximo
         * do mouse.
         *
         * Isso é melhor do que calcular a distância
         * até o centro do botão.
         */

        const closestX = Math.max(
            rect.left,
            Math.min(mouseX, rect.right)
        );

        const closestY = Math.max(
            rect.top,
            Math.min(mouseY, rect.bottom)
        );

        const distX = mouseX - closestX;
        const distY = mouseY - closestY;

        const distance = Math.sqrt(
            distX * distX +
            distY * distY
        );

        // Só foge quando o mouse realmente chegar perto
        if (distance < CONFIG.escapeDistance) {

            // Agora sim transforma em fixed
            makeFixedIfNeeded();

            // Conta a fuga
            escapeCount++;

            if (CONFIG.enableCounter) {
                escapeCountSpan.textContent = escapeCount;
            }

            // ==============================
            // LIMITES DA TELA
            // ==============================

            const padding = 20;

            const minX = padding;
            const minY = padding;

            const maxX =
                window.innerWidth -
                rect.width -
                padding;

            const maxY =
                window.innerHeight -
                rect.height -
                padding;

            // ==============================
            // NOVA POSIÇÃO ALEATÓRIA
            // ==============================

            let randomX = Math.floor(
                minX +
                Math.random() * (maxX - minX)
            );

            let randomY = Math.floor(
                minY +
                Math.random() * (maxY - minY)
            );

            // ==============================
            // EVITA O CARTÃO PRINCIPAL
            // ==============================

            const cardRect =
                mainCard.getBoundingClientRect();

            const overlapsCard =
                randomX < cardRect.right &&
                randomX + rect.width > cardRect.left &&
                randomY < cardRect.bottom &&
                randomY + rect.height > cardRect.top;

            if (overlapsCard) {

                /*
                 * Se o botão cair sobre o cartão,
                 * joga para uma das laterais.
                 */

                if (
                    randomX >
                    window.innerWidth / 2
                ) {

                    randomX =
                        window.innerWidth -
                        rect.width -
                        padding;

                } else {

                    randomX = padding;
                }
            }

            // ==============================
            // APLICA A POSIÇÃO
            // ==============================

            noBtn.style.left = `${randomX}px`;
            noBtn.style.top = `${randomY}px`;
        }
    }

    // ==============================
    // MOVIMENTO DO MOUSE
    // ==============================

    document.addEventListener('mousemove', (e) => {

        requestAnimationFrame(() => {

            moveButton(
                e.clientX,
                e.clientY
            );

        });

    });

    // ==============================
    // CELULAR / TOUCH
    // ==============================

    noBtn.addEventListener('touchstart', (e) => {

        e.preventDefault();

        const touch = e.touches[0];

        moveButton(
            touch.clientX,
            touch.clientY
        );

    });

    // ==============================
    // BOTÃO SIM
    // ==============================

    yesBtn.addEventListener('click', () => {

        if (isTransitioned) return;

        isTransitioned = true;

        // Esconde botão NÃO
        noBtn.style.display = 'none';

        // Altera a pergunta
        questionText.textContent =
            CONFIG.successMessage;

        // Esconde contador
        counterBox.style.display = 'none';

        // Esconde botão SIM
        yesBtn.style.display = 'none';

        // ==============================
        // ANIMAÇÃO DO CARTÃO
        // ==============================

        mainCard.style.transform =
            'scale(1.05)';

        setTimeout(() => {

            mainCard.style.transform =
                'scale(1)';

        }, 200);

        // ==============================
        // CONFETES
        // ==============================

        if (typeof confetti === 'function') {

            confetti({
                particleCount: 150,
                spread: 80,
                origin: {
                    y: 0.6
                },
                colors: [
                    '#d69e2e',
                    '#e53e3e',
                    '#ecc94b',
                    '#ffffff'
                ]
            });

        }

    });

});
