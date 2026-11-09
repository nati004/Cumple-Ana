// ==========================================
// 1. ENGINE DE AURORA BOREAL (FOOTER)
// ==========================================
class AuroraEngine {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d', { alpha: false });
		this.footerContainer = canvas.parentElement;
		
		this.speed = 0.8;
		this.intensity = 1.25;
		this.layerCount = 5;

		this.solarCrimsonTheme = [
			{ stop: 0.0, color: 'rgba(0, 0, 0, 0)' },
			{ stop: 0.25, color: 'rgba(239, 68, 68, ' },
			{ stop: 0.55, color: 'rgba(245, 158, 11, ' },
			{ stop: 0.80, color: 'rgba(253, 224, 71, ' },
			{ stop: 1.0, color: 'rgba(0, 0, 0, 0)' }
		];

		this.time = 0;
		this.lastFrameTime = performance.now();
		this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
		
		this.stars = [];
		this.mountainCanvas = document.createElement('canvas');
		this.mountainCtx = this.mountainCanvas.getContext('2d');

		this.init();
	}

	init() {
		this.resize();
		this.generateStars();
		this.generateMountains();
		
		window.addEventListener('resize', () => {
			this.resize();
			this.generateStars();
			this.generateMountains();
		});
	}

	resize() {
		this.width = this.footerContainer.clientWidth;
		this.height = this.footerContainer.clientHeight;

		this.canvas.width = Math.floor(this.width * this.pixelRatio);
		this.canvas.height = Math.floor(this.height * this.pixelRatio);
		this.ctx.scale(this.pixelRatio, this.pixelRatio);
	}

	generateStars() {
		this.stars = [];
		const count = Math.floor((this.width * this.height) / 2400);
		
		for (let i = 0; i < count; i++) {
			this.stars.push({
				x: Math.random() * this.width,
				y: Math.random() * (this.height * 0.75),
				radius: Math.random() * 1.1 + 0.3,
				alpha: Math.random() * 0.85 + 0.15,
				twinkleSpeed: Math.random() * 0.02 + 0.005,
				phase: Math.random() * Math.PI * 2
			});
		}
	}

	generateMountains() {
		this.mountainCanvas.width = this.canvas.width;
		this.mountainCanvas.height = this.canvas.height;
		const mCtx = this.mountainCtx;
		mCtx.scale(this.pixelRatio, this.pixelRatio);
		
		mCtx.clearRect(0, 0, this.width, this.height);
		
		mCtx.fillStyle = '#06050b';
		mCtx.beginPath();
		mCtx.moveTo(0, this.height);
		for (let x = 0; x <= this.width; x += 25) {
			const y = this.height * 0.76 + Math.sin(x * 0.004) * 45 + Math.cos(x * 0.012) * 20;
			mCtx.lineTo(x, y);
		}
		mCtx.lineTo(this.width, this.height);
		mCtx.closePath();
		mCtx.fill();

		mCtx.fillStyle = '#020104';
		mCtx.beginPath();
		mCtx.moveTo(0, this.height);
		for (let x = 0; x <= this.width; x += 15) {
			const y = this.height * 0.83 + Math.sin(x * 0.008) * 35 + Math.sin(x * 0.025) * 15;
			mCtx.lineTo(x, y);
		}
		mCtx.lineTo(this.width, this.height);
		mCtx.closePath();
		mCtx.fill();

		mCtx.fillStyle = '#010002';
		for (let x = 5; x < this.width; x += 10 + Math.random() * 18) {
			const treeHeight = 16 + Math.random() * 26;
			const baseY = this.height * 0.84 + Math.sin(x * 0.008) * 30;
			
			mCtx.beginPath();
			mCtx.moveTo(x, baseY - treeHeight);
			mCtx.lineTo(x - 5, baseY);
			mCtx.lineTo(x + 5, baseY);
			mCtx.closePath();
			mCtx.fill();
		}
	}

	drawSky() {
		const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
		
		// Transición desde la oscuridad nocturna arriba hasta un "amanecer" cálido abajo
		skyGradient.addColorStop(0.0, '#040207'); // Oscuridad arriba
		skyGradient.addColorStop(0.5, '#0b0410'); // Carmesí nocturno medio
		skyGradient.addColorStop(0.8, '#2a1215'); // Transición cálida / rojiza del amanecer
		skyGradient.addColorStop(1.0, '#4a2311'); // Brillo ámbar/dorado suave justo en el horizonte (abajo)
		
		this.ctx.fillStyle = skyGradient;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	drawStars() {
		this.ctx.save();
		for (let i = 0; i < this.stars.length; i++) {
			const s = this.stars[i];
			s.phase += s.twinkleSpeed;
			const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
			
			this.ctx.fillStyle = `rgba(255, 245, 230, ${currentAlpha})`;
			this.ctx.beginPath();
			this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
			this.ctx.fill();
		}
		this.ctx.restore();
	}

	drawAuroraCurtains() {
		this.ctx.save();
		this.ctx.globalCompositeOperation = 'screen';

		const baseHeight = this.height * 0.42;

		for (let layer = 0; layer < this.layerCount; layer++) {
			const layerYOffset = baseHeight + (layer * 30) - (this.layerCount * 12);
			const ribbonHeight = 230 + layer * 35;

			const gradient = this.ctx.createLinearGradient(0, layerYOffset - ribbonHeight, 0, layerYOffset + 70);
			
			this.solarCrimsonTheme.forEach(pt => {
				let alphaVal = 0;
				if (pt.stop > 0 && pt.stop < 1) {
					// CAMBIO: Bajamos de 0.24 a 0.16 para que sea más translúcida y sutil
					alphaVal = (0.1 / (layer * 0.3 + 1)) * this.intensity;
				}
				gradient.addColorStop(pt.stop, `${pt.color}${alphaVal})`);
			});

			this.ctx.fillStyle = gradient;
			this.ctx.beginPath();

			const step = 8;
			this.ctx.moveTo(0, this.height);

			for (let x = 0; x <= this.width + step; x += step) {
				const wave1 = Math.sin(x * 0.002 + this.time * 0.4 + layer * 1.4) * 65;
				const wave2 = Math.cos(x * 0.005 - this.time * 0.25 + layer) * 35;
				const wave3 = Math.sin(x * 0.008 + this.time * 0.5) * 18;

				const y = layerYOffset + wave1 + wave2 + wave3 - ribbonHeight;
				
				if (x === 0) {
					this.ctx.moveTo(x, y);
				} else {
					this.ctx.lineTo(x, y);
				}
			}

			for (let x = this.width; x >= -step; x -= step) {
				const wave1 = Math.sin(x * 0.002 + this.time * 0.4 + layer * 1.4) * 65;
				const wave2 = Math.cos(x * 0.005 - this.time * 0.25 + layer) * 35;
				const wave3 = Math.sin(x * 0.008 + this.time * 0.5) * 18;

				const y = layerYOffset + wave1 + wave2 + wave3 + 45;
				this.ctx.lineTo(x, y);
			}

			this.ctx.closePath();
			this.ctx.fill();
		}

		this.ctx.restore();
	}

	drawLandscape() {
		this.ctx.drawImage(this.mountainCanvas, 0, 0, this.width, this.height);
	}

	render() {
		const now = performance.now();
		const dt = (now - this.lastFrameTime) / 1000;
		this.lastFrameTime = now;

		this.time += dt * this.speed;

		this.drawSky();
		this.drawStars();
		this.drawAuroraCurtains();
		this.drawLandscape();

		requestAnimationFrame(() => this.render());
	}

	start() {
		requestAnimationFrame(() => this.render());
	}
}

window.addEventListener('load', () => {
	const canvas = document.getElementById('auroraCanvas');
	if (canvas) {
		const engine = new AuroraEngine(canvas);
		engine.start();
	}
});

// ==========================================
// 2. SLIDER DE IMÁGENES
// ==========================================
const $sliderImg = document.querySelector("#slider-img");
let images = ["./assets/1.webp", "./assets/2.webp", "./assets/3.webp"];
let currentIndex = 0;

if ($sliderImg) {
	setInterval(() => {
		currentIndex = (currentIndex + 1) % images.length;
		$sliderImg.src = images[currentIndex];
	}, 1000);
}

// ==========================================
// 3. GENERACIÓN DE ESTRELLAS INTERACTIVAS
// ==========================================
const $containerStars = document.querySelector(".container-stars");

let db = [
	{ "name": "Nati", "color": "#3b82f6", "range": 1, "image": "./database/1600w-UmAZgx8HXa0.webp" },
	{ "name": "Sammi", "color": "#ef4444", "range": 2, "image": "./database/1600w-UmAZgx8HXa0.webp" },
	{ "name": "Ana", "color": "#eab308", "range": 3, "image": "./database/568w-kicFvFb6tZo.jpg" },
	{ "name": "Sammi", "color": "#ef4444", "range": 2, "image": "./database/1600w-UmAZgx8HXa0.webp" },
	{ "name": "Ana", "color": "#eab308", "range": 3, "image": "./database/568w-kicFvFb6tZo.jpg" },
	{ "name": "Sammi", "color": "#ef4444", "range": 2, "image": "./database/1600w-UmAZgx8HXa0.webp" },
	{ "name": "Ana", "color": "#eab308", "range": 3, "image": "./database/568w-kicFvFb6tZo.jpg" },
];

let lastZone = "";
let currentY = 0;

if ($containerStars) {
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

		$div.addEventListener('click', () => {
			animateStarToCenter($div, star);
		});

		$containerStars.appendChild($div);
	});

	$containerStars.style.height = `${currentY + 150}px`;
}

// ==========================================
// 4. SOBRE Y MODAL INTERACTIVO
// ==========================================
const envelopeModal = document.getElementById('envelope-modal');
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const instruction = document.getElementById('instruction');
const resetBtn = document.getElementById('resetBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const letterAuthor = document.getElementById('letter-author');

let state = 'closed';

const envelopeAuthor = document.getElementById('envelope-author'); // Seleccionamos el elemento del sobre
const letterImg = document.getElementById('letter-img'); 

function animateStarToCenter(originalStar, starData) {
	const rect = originalStar.getBoundingClientRect();

	// Asignamos la imagen y el nombre en el sobre antes de abrir el modal
	letterImg.src = starData.image; 
	envelopeAuthor.textContent = `De: ${starData.name}`; // <-- Aquí se actualiza el sobre

	const starClone = originalStar.cloneNode(true);
	starClone.classList.add('star-animating');
	
	starClone.style.position = 'fixed';
	starClone.style.left = `${rect.left}px`;
	starClone.style.top = `${rect.top}px`;
	starClone.style.margin = '0';
	starClone.style.zIndex = '9999';
	starClone.style.pointerEvents = 'none';

	document.body.appendChild(starClone);
	originalStar.style.opacity = '0';

	requestAnimationFrame(() => {
		starClone.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
		starClone.style.left = '50%';
		starClone.style.top = '50%';
		starClone.style.transform = 'translate(-50%, -50%) scale(2.5) rotate(360deg)';
		starClone.style.filter = `drop-shadow(0 0 35px ${starData.color})`;
	});

	setTimeout(() => {
		envelopeModal.classList.add('active');
		resetEnvelopeState();

		starClone.style.opacity = '0';
		setTimeout(() => {
			starClone.remove();
			originalStar.style.opacity = '1';
		}, 400);
	}, 750);
}

if (envelope) {
	envelope.addEventListener('click', (e) => {
		e.stopPropagation();
		if (state === 'closed') {
			envelope.classList.add('open');
			state = 'opened';
			instruction.textContent = 'Ahora haz clic en la carta para sacarla';
		}
	});
}

if (letter) {
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
}

if (resetBtn) {
	resetBtn.addEventListener('click', (e) => triggerCloseSequence(e));
}

if (closeModalBtn) {
	closeModalBtn.addEventListener('click', () => {
		envelopeModal.classList.remove('active');
		resetEnvelopeState();
	});
}

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
// ==========================================
// 5. FONDO DE ESTRELLAS Y ESTRELLAS FUGACES
// ==========================================
function generateStars(count, maxVh) {
	let stars = [];
	for (let i = 0; i < count; i++) {
		const x = Math.floor(Math.random() * 100);
		// Distribuimos las estrellas aleatoriamente en base a la altura total en píxeles
		const y = Math.floor(Math.random() * maxVh);
		const alpha = (Math.random() * 0.6 + 0.4).toFixed(2);
		stars.push(`${x}vw ${y}px rgba(255, 255, 255, ${alpha})`);
	}
	return stars.join(', ');
}

// Creamos dinámicamente el contenedor del fondo si no existe
const bgStarsContainer = document.createElement('div');
bgStarsContainer.id = 'bgStars';
bgStarsContainer.classList.add('bg-stars');
document.body.insertBefore(bgStarsContainer, document.body.firstChild);

// Calculamos la altura total real del documento para que las estrellas cubran todo el scroll
function updateBgHeight() {
	const totalHeight = document.documentElement.scrollHeight;
	bgStarsContainer.style.height = `${totalHeight}px`;
	
	// Cantidad de estrellas proporcional a la altura de la página
	const smallCount = Math.floor(totalHeight / 3);
	const mediumCount = Math.floor(totalHeight / 6);

	bgStarsContainer.style.setProperty('--stars-small', generateStars(smallCount, totalHeight));
	bgStarsContainer.style.setProperty('--stars-medium', generateStars(mediumCount, totalHeight));
}

// Ejecutamos al cargar y si cambia el tamaño de la ventana
window.addEventListener('load', updateBgHeight);
window.addEventListener('resize', updateBgHeight);

function createShootingStar() {
	const star = document.createElement('div');
	star.classList.add('shooting-star');

	const scrollY = window.scrollY;
	const viewportHeight = window.innerHeight;
	const viewportWidth = window.innerWidth;

	const randomTop = scrollY + Math.random() * (viewportHeight * 0.6); 
	const randomLeft = (viewportWidth * 0.4) + Math.random() * (viewportWidth * 0.5); 

	star.style.top = `${randomTop}px`;
	star.style.left = `${randomLeft}px`;

	const randomScale = (Math.random() * 0.9 + 0.5).toFixed(2);
	star.style.setProperty('--star-scale', randomScale);

	star.innerHTML = `
		<svg width="150" height="50" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="tailGrad10" x1="0%" y1="100%" x2="100%" y2="0%">
					<stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
					<stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
				</linearGradient>
			</defs>
			<line x1="10" y1="33" x2="140" y2="0" stroke="url(#tailGrad10)" stroke-width="1.5" stroke-linecap="round"/>
			<circle cx="10" cy="33" r="2" fill="#ffffff" />
		</svg>
	`;

	bgStarsContainer.appendChild(star);

	setTimeout(() => {
		star.remove();
	}, 1500);
}

function scheduleNextShootingStar() {
	const randomTime = Math.random() * 2000 + 2000;
	setTimeout(() => {
		createShootingStar();
		scheduleNextShootingStar();
	}, randomTime);
}

scheduleNextShootingStar();