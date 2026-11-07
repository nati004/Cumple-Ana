<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cielo de Deseos 🌟</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: linear-gradient(180deg, #cbe3f7 0%, #b3d6f3 40%, #9fcceb 70%, #90c2e6 100%);
            color: #334155;
            font-family: 'Quicksand', sans-serif;
            min-height: 100vh;
            user-select: none;
        }

        .script-font {
            font-family: 'Great Vibes', cursive;
        }

        /* Canvas de estrellas de fondo */
        #sky-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            pointer-events: none;
        }

        /* Capas de nubes de acuarela */
        .cloud-layer-1 {
            position: fixed;
            top: -20%;
            left: -10%;
            width: 120%;
            height: 140%;
            pointer-events: none;
            z-index: 2;
            opacity: 0.65;
            background: 
                radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.75) 0%, transparent 50%),
                radial-gradient(circle at 20% 45%, rgba(254, 243, 199, 0.4) 0%, transparent 45%),
                radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.6) 0%, transparent 55%);
            filter: blur(40px);
            animation: floatClouds 28s ease-in-out infinite alternate;
        }

        .cloud-layer-2 {
            position: fixed;
            top: -10%;
            left: -5%;
            width: 110%;
            height: 120%;
            pointer-events: none;
            z-index: 3;
            opacity: 0.45;
            background: 
                radial-gradient(circle at 75% 20%, rgba(255, 237, 213, 0.5) 0%, transparent 40%),
                radial-gradient(circle at 30% 75%, rgba(255, 255, 255, 0.7) 0%, transparent 50%);
            filter: blur(50px);
            animation: floatCloudsRev 35s ease-in-out infinite alternate;
        }

        @keyframes floatClouds {
            0% { transform: scale(1) translate(0, 0); }
            100% { transform: scale(1.05) translate(25px, -15px); }
        }

        @keyframes floatCloudsRev {
            0% { transform: scale(1) translate(0, 0); }
            100% { transform: scale(1.04) translate(-20px, 20px); }
        }

        /* Estrellas de 5 puntas */
        .star-node {
            position: absolute;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: 10;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
        }

        .star-svg-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: floatStar var(--float-duration, 4s) infinite ease-in-out var(--float-delay, 0s),
                       twinkleStar var(--twinkle-duration, 3s) infinite ease-in-out var(--float-delay, 0s);
        }

        .star-svg {
            width: 100%;
            height: 100%;
            transition: transform 0.3s ease, filter 0.3s ease;
        }

        .star-node:hover {
            transform: translate(-50%, -50%) scale(1.4) rotate(12deg);
            z-index: 30;
        }

        .star-node:hover .star-svg {
            filter: brightness(1.3) drop-shadow(0 0 15px rgba(255, 255, 255, 0.9));
        }

        @keyframes floatStar {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(3deg); }
        }

        @keyframes twinkleStar {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
        }

        /* Tooltip */
        .star-tooltip {
            position: absolute;
            top: 110%;
            left: 50%;
            transform: translateX(-50%) translateY(4px);
            white-space: nowrap;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.9);
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 700;
            color: #475569;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.25s ease, transform 0.25s ease;
            box-shadow: 0 4px 15px rgba(100, 116, 139, 0.15);
        }

        .star-node:hover .star-tooltip {
            opacity: 1;
            transform: translateX(-50%) translateY(8px);
        }

        /* Modales */
        .glass-card {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1.5px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 20px 40px -15px rgba(148, 163, 184, 0.35);
        }

        .modal-active {
            opacity: 1 !important;
            pointer-events: auto !important;
            transform: scale(1) translateY(0) !important;
        }

        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.4); border-radius: 10px; }
    </style>
</head>
<body class="relative min-h-screen w-full overflow-x-hidden">

    <!-- Reproductor de Audio -->
    <audio id="bg-audio" loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-piano-113884.mp3" type="audio/mpeg">
    </audio>

    <!-- Canvas de Fondo -->
    <canvas id="sky-canvas"></canvas>

    <!-- Capas de Nubes -->
    <div class="cloud-layer-1"></div>
    <div class="cloud-layer-2"></div>

    <!-- Contenedor Principal de Estrellas -->
    <div id="universe-container" class="fixed inset-0 w-full h-full z-10 overflow-hidden"></div>

    <!-- Título Central -->
    <header class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center w-full px-4">
        <h1 class="script-font text-6xl md:text-8xl text-white font-normal drop-shadow-[0_4px_12px_rgba(100,116,139,0.3)] tracking-wide">
            Feliz Cumpleaños
        </h1>
        <p class="text-sm md:text-base text-white/90 font-medium mt-2 drop-shadow-[0_2px_4px_rgba(100,116,139,0.2)]">
            Toca las estrellas para leer los deseos
        </p>
    </header>

    <!-- Barra de Controles Flotante -->
    <div class="fixed bottom-6 right-6 z-30 flex items-center gap-3">
        <button id="btn-audio" class="glass-card p-3 rounded-full text-slate-700 hover:text-slate-900 transition-all hover:scale-105 shadow-md">
            <svg id="audio-icon-off" class="w-5 h-5 fill-slate-700" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <svg id="audio-icon-on" class="w-5 h-5 fill-slate-700 hidden" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
        </button>

        <button id="btn-add-star" class="glass-card px-5 py-3 rounded-full flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-all hover:scale-105 shadow-md">
            <svg class="w-5 h-5 fill-amber-400" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>+ Agregar deseo</span>
        </button>
    </div>

    <!-- Modal para Leer Mensajes -->
    <div id="message-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300 transform scale-95">
        <div id="modal-backdrop" class="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"></div>

        <div class="glass-card relative w-full max-w-md rounded-3xl p-6 md:p-8 text-center text-slate-700 z-10 overflow-hidden shadow-2xl">
            <div class="relative mb-3 flex justify-center">
                <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md animate-bounce">
                    <svg class="w-8 h-8 fill-amber-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
            </div>

            <div id="modal-title" class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
                Deseo Especial
            </div>

            <div class="relative max-h-60 overflow-y-auto custom-scroll my-4 px-2">
                <p id="modal-text" class="text-base md:text-lg text-slate-700 font-medium leading-relaxed italic">
                    "¡Feliz cumpleaños! Que tu día sea tan brillante y hermoso como este cielo."
                </p>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span id="modal-sender" class="font-bold text-slate-600 text-sm">De: Nati</span>
                <span id="modal-date" class="text-slate-400">Con cariño</span>
            </div>

            <button id="btn-close-modal" class="mt-6 w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all">
                Cerrar Estrella ✨
            </button>
        </div>
    </div>

    <!-- Modal para Agregar Nueva Estrella -->
    <div id="add-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300 transform scale-95">
        <div id="add-modal-backdrop" class="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"></div>

        <div class="glass-card relative w-full max-w-md rounded-3xl p-6 md:p-8 text-slate-700 z-10 shadow-2xl">
            <h2 class="text-2xl text-center text-slate-800 font-bold mb-1">Encender una Estrella</h2>
            <p class="text-xs text-center text-slate-500 mb-6">Escribe tus palabras para agregar una estrella al cielo</p>

            <form id="add-star-form" class="space-y-4">
                <div>
                    <label class="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Título del Deseo</label>
                    <input type="text" id="input-title" required placeholder="Ej. ¡Muchas Felicidades!" class="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400">
                </div>

                <div>
                    <label class="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Mensaje de Felicitación</label>
                    <textarea id="input-message" rows="3" required placeholder="Escribe tu mensaje especial..." class="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 custom-scroll resize-none"></textarea>
                </div>

                <div>
                    <label class="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">De parte de</label>
                    <input type="text" id="input-sender" required placeholder="Tu nombre" class="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400">
                </div>

                <div class="flex gap-3 pt-2">
                    <button type="button" id="btn-cancel-add" class="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-white/50 transition-all">
                        Cancelar
                    </button>
                    <button type="submit" class="w-1/2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all">
                        Crear Estrella
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Paleta de colores pastel para las estrellas
        const starColors = [
            '#ffffff', // Blanco puro
            '#fff4b8', // Amarillo pastel brillante
            '#ffb3c6', // Rosa suave
            '#b3e5fc', // Azul cielo claro
            '#d7bde2', // Lavanda
            '#a3e4d7', // Menta
            '#ffd3b6'  // Melocotón
        ];

        const initialStarMessages = [
            { id: 1, title: "Deseo de Alegría", message: "¡Que este nuevo año esté lleno de momentos mágicos y muchas sonrisas!", sender: "De: Nati", date: "Hoy", x: 15, y: 18, size: 75 },
            { id: 2, title: "Luz y Amor", message: "Gracias por existir y llenar de luz la vida de todos a tu alrededor.", sender: "De: Tu amiga", date: "Hoy", x: 82, y: 22, size: 85 },
            { id: 3, title: "Estrella Brillante", message: "¡Sigue brillando como solo tú sabes hacerlo!", sender: "De: Carlos", date: "Hoy", x: 50, y: 30, size: 50 },
            { id: 4, title: "Deseo Dulce", message: "¡Que nunca falte el pastel, las risas y tus personas favoritas!", sender: "De: Sofía", date: "Hoy", x: 30, y: 78, size: 90 },
            { id: 5, title: "Abrazo Fuerte", message: "Te envío el abrazo más gigante del universo en tu día.", sender: "De: Fer", date: "Hoy", x: 78, y: 80, size: 80 },
            { id: 6, title: "Felicidad Infinita", message: "Deseo de todo corazón que cumplas cada uno de tus sueños.", sender: "De: Ana", date: "Hoy", x: 12, y: 82, size: 55 }
        ];

        let starMessages = [...initialStarMessages];

        // Canvas de polvo estelar de fondo
        const canvas = document.getElementById('sky-canvas');
        const ctx = canvas.getContext('2d');
        let bgStars = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initBgStars();
        }

        function initBgStars() {
            bgStars = [];
            const count = Math.floor((canvas.width * canvas.height) / 3500);
            for (let i = 0; i < count; i++) {
                bgStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.8 + 0.4,
                    alpha: Math.random(),
                    speed: Math.random() * 0.015 + 0.005
                });
            }
        }

        function drawBgStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bgStars.forEach(star => {
                star.alpha += star.speed;
                if (star.alpha > 1 || star.alpha < 0) {
                    star.speed = -star.speed;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = Math.abs(star.alpha) * 0.8;
                ctx.fill();
            });
            requestAnimationFrame(drawBgStars);
        }

        // Renderizar Estrellas de 5 Puntas con Colores Dinámicos
        const universeContainer = document.getElementById('universe-container');

        function renderInteractiveStars() {
            universeContainer.innerHTML = '';
            starMessages.forEach((star, index) => {
                const node = document.createElement('div');
                node.className = 'star-node';
                node.style.left = `${star.x}%`;
                node.style.top = `${star.y}%`;
                node.style.width = `${star.size}px`;
                node.style.height = `${star.size}px`;

                const color = star.color || starColors[index % starColors.length];
                const floatDuration = (4 + Math.random() * 2).toFixed(2);
                const twinkleDuration = (2.5 + Math.random() * 2).toFixed(2);
                const floatDelay = (Math.random() * 3).toFixed(2);

                node.innerHTML = `
                    <div class="star-svg-wrapper" style="--float-duration: ${floatDuration}s; --twinkle-duration: ${twinkleDuration}s; --float-delay: ${floatDelay}s;">
                        <svg class="star-svg" viewBox="0 0 512 512" style="filter: drop-shadow(0 0 10px ${color});">
                            <path fill="${color}" d="M256 0L330 170L512 195L379 323L412 504L256 417L100 504L133 323L0 195L182 170L256 0Z"/>
                        </svg>
                    </div>
                    <div class="star-tooltip">${star.title}</div>
                `;

                node.addEventListener('click', () => openMessageModal(star));
                universeContainer.appendChild(node);
            });
        }

        // Control de Audio
        const audio = document.getElementById('bg-audio');
        const btnAudio = document.getElementById('btn-audio');
        const iconOff = document.getElementById('audio-icon-off');
        const iconOn = document.getElementById('audio-icon-on');

        btnAudio.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                iconOff.classList.add('hidden');
                iconOn.classList.remove('hidden');
            } else {
                audio.pause();
                iconOff.classList.remove('hidden');
                iconOn.classList.add('hidden');
            }
        });

        // Modales de Mensaje
        const messageModal = document.getElementById('message-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const modalSender = document.getElementById('modal-sender');
        const modalDate = document.getElementById('modal-date');

        function openMessageModal(star) {
            modalTitle.textContent = star.title;
            modalText.textContent = `"${star.message}"`;
            modalSender.textContent = star.sender.startsWith('De:') ? star.sender : `De: ${star.sender}`;
            modalDate.textContent = star.date || "Hoy";
            messageModal.classList.add('modal-active');
        }

        function closeMessageModal() {
            messageModal.classList.remove('modal-active');
        }

        document.getElementById('btn-close-modal').addEventListener('click', closeMessageModal);
        document.getElementById('modal-backdrop').addEventListener('click', closeMessageModal);

        // Modal para Agregar Estrella
        const addModal = document.getElementById('add-modal');
        const btnAddStar = document.getElementById('btn-add-star');
        const btnCancelAdd = document.getElementById('btn-cancel-add');
        const addModalBackdrop = document.getElementById('add-modal-backdrop');
        const addStarForm = document.getElementById('add-star-form');

        btnAddStar.addEventListener('click', () => addModal.classList.add('modal-active'));

        function closeAddModal() {
            addModal.classList.remove('modal-active');
            addStarForm.reset();
        }

        btnCancelAdd.addEventListener('click', closeAddModal);
        addModalBackdrop.addEventListener('click', closeAddModal);

        addStarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('input-title').value;
            const message = document.getElementById('input-message').value;
            const sender = document.getElementById('input-sender').value;

            const x = Math.floor(Math.random() * 70) + 15;
            const y = Math.floor(Math.random() * 70) + 15;
            const size = Math.floor(Math.random() * 30) + 55;
            const randomColor = starColors[Math.floor(Math.random() * starColors.length)];

            const newStar = {
                id: Date.now(),
                title: title,
                message: message,
                sender: `De: ${sender}`,
                date: "Hoy",
                x: x, y: y, size: size,
                color: randomColor
            };

            starMessages.push(newStar);
            renderInteractiveStars();
            closeAddModal();

            setTimeout(() => openMessageModal(newStar), 300);
        });

        window.addEventListener('resize', resizeCanvas);

        window.onload = () => {
            resizeCanvas();
            drawBgStars();
            renderInteractiveStars();
        };
    </script>
</body>
</html>