// --- SLIDER DE IMÁGENES ---
const $sliderImg = document.querySelector("#slider-img");

let images = [
	"./assets/1.webp",
	"./assets/2.webp",
	"./assets/3.webp"
];

let currentIndex = 0;

setInterval(() => {
	currentIndex = (currentIndex + 1) % images.length;
	$sliderImg.src = images[currentIndex];
}, 1000);


// --- GENERACIÓN DE ESTRELLAS ---
const $containerStars = document.querySelector(".container-stars");

let db = [
	{ "name": "Nati", "color": "#3b82f6", "range": 1 },
	{ "name": "Nati", "color": "#ef4444", "range": 2 },
	{ "name": "Ana", "color": "#eab308", "range": 3 },
	{ "name": "Luisa", "color": "#22c55e", "range": 1 }
];

let lastZone = "";
let currentY = 0;

db.forEach((star, index) => {
	const $div = document.createElement("div");
	$div.classList.add("star");
	
	$div.innerHTML = `
		<div class="tooltip">${star.name}</div>
		<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
			<path fill="currentColor" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15	C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343	c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957	c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25	c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657	C63.951,25.771,64.131,24.987,63.893,24.277z"/>
		</svg>
	`;

	let size = "80px";
	if (star.range === 1) size = "90px";
	else if (star.range === 2) size = "65px";
	else if (star.range === 3) size = "45px";
	
	const $svg = $div.querySelector("svg");
	$svg.style.width = size;
	$svg.style.height = size;
	$svg.style.color = star.color;
	$svg.style.filter = `drop-shadow(0 0 8px ${star.color})`;

	let availableZones = ["left", "center", "right"];
	if (lastZone !== "") availableZones = availableZones.filter(z => z !== lastZone);

	let chosenZone = availableZones[Math.floor(Math.random() * availableZones.length)];
	lastZone = chosenZone;

	let positionX = 0;
	if (chosenZone === "left") positionX = Math.random() * 25;
	else if (chosenZone === "center") positionX = 35 + Math.random() * 30;
	else positionX = 70 + Math.random() * 25;

	if (index === 0) currentY = 0;
	else {
		let verticalDistance = 250 + Math.floor(Math.random() * 70);
		currentY += verticalDistance;
	}

	let rotation = Math.floor(Math.random() * 30) - 15;

	$div.style.position = "absolute";
	$div.style.left = positionX + "%";
	$div.style.top = currentY + "px";
	$div.style.transform = `rotate(${rotation}deg)`;
	$div.style.setProperty("--star-rotation", `${rotation}deg`);
	$div.style.setProperty("--star-color", star.color);

	// --- ANIMACIÓN: ESTRELLA AL CENTRO -> SOBRE ---
	$div.addEventListener('click', (e) => {
		animateStarToCenter($div, star);
	});

	$containerStars.appendChild($div);
});

$containerStars.style.height = `${currentY + 150}px`;


// --- ELEMENTOS DEL SOBRE Y MODAL ---
const envelopeModal = document.getElementById('envelope-modal');
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const instruction = document.getElementById('instruction');
const resetBtn = document.getElementById('resetBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const letterAuthor = document.getElementById('letter-author');

let state = 'closed';

// --- LÓGICA DE ANIMACIÓN AL CENTRO ---
function animateStarToCenter(originalStar, starData) {
	// Obtener la posición exacta de la estrella en pantalla
	const rect = originalStar.getBoundingClientRect();

	// Crear una copia flotante de la estrella
	const starClone = originalStar.cloneNode(true);
	starClone.classList.add('star-animating');
	
	// Posicionar el clon exactamente sobre la estrella original
	starClone.style.position = 'fixed';
	starClone.style.left = `${rect.left}px`;
	starClone.style.top = `${rect.top}px`;
	starClone.style.margin = '0';
	starClone.style.zIndex = '9999';
	starClone.style.pointerEvents = 'none';

	document.body.appendChild(starClone);

	// Ocultar temporalmente la estrella original
	originalStar.style.opacity = '0';

	// Animación con requestAnimationFrame para suavidad
	requestAnimationFrame(() => {
		starClone.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
		starClone.style.left = '50%';
		starClone.style.top = '50%';
		starClone.style.transform = 'translate(-50%, -50%) scale(2.5) rotate(360deg)';
		starClone.style.filter = `drop-shadow(0 0 35px ${starData.color})`;
	});

	// Cuando la estrella llega al centro:
	setTimeout(() => {
		// Asignar el nombre del autor
		letterAuthor.textContent = `De: ${starData.name}`;

		// Mostrar el sobre desde el centro
		envelopeModal.classList.add('active');
		resetEnvelopeState();

		// Desvanecer la estrella clonada
		starClone.style.opacity = '0';
		setTimeout(() => {
			starClone.remove();
			originalStar.style.opacity = '1';
		}, 400);
	}, 750);
}


// --- INTERACCIONES DEL SOBRE ---
envelope.addEventListener('click', (e) => {
	e.stopPropagation();
	if (state === 'closed') {
		envelope.classList.add('open');
		state = 'opened';
		instruction.textContent = 'Ahora haz clic en la carta para sacarla';
	}
});

letter.addEventListener('click', (e) => {
	e.stopPropagation();
	if (state === 'opened') {
		letter.classList.remove('returning');
		letter.classList.add('extracted');
		state = 'extracted';
		instruction.textContent = 'Haz clic en la carta o en el botón para guardarla';
		resetBtn.classList.add('visible');
	} else if (state === 'extracted') {
		triggerCloseSequence();
	}
});

resetBtn.addEventListener('click', (e) => {
	triggerCloseSequence(e);
});

closeModalBtn.addEventListener('click', () => {
	envelopeModal.classList.remove('active');
	resetEnvelopeState();
});

function triggerCloseSequence(e) {
	if (e) e.stopPropagation();
	if (state !== 'extracted' && state !== 'opened') return;

	if (state === 'extracted') {
		state = 'animating';
		resetBtn.classList.remove('visible');
		instruction.textContent = 'Guardando carta...';

		letter.classList.remove('extracted');
		letter.classList.add('returning');

		setTimeout(() => {
			letter.classList.remove('returning');
			envelope.classList.remove('open');
			state = 'closed';
			instruction.textContent = 'Haz clic en el sobre para abrirlo';
		}, 800);
	} else if (state === 'opened') {
		envelope.classList.remove('open');
		state = 'closed';
		instruction.textContent = 'Haz clic en el sobre para abrirlo';
	}
}

function resetEnvelopeState() {
	envelope.classList.remove('open');
	letter.classList.remove('extracted', 'returning');
	resetBtn.classList.remove('visible');
	state = 'closed';
	instruction.textContent = 'Haz clic en el sobre para abrirlo';
}