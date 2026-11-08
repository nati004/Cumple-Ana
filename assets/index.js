const $containerStars = document.querySelector(".container-stars");

let db = [
	{
		"name": "Nati",
		"color": "#3b82f6",
		"range": 1
	},
	{
		"name": "Nati",
		"color": "#ef4444",
		"range": 2
	},
	{
		"name": "Ana",
		"color": "#eab308",
		"range": 3
	},
	{
		"name": "Luisa",
		"color": "#22c55e",
		"range": 1
	}
];

let lastZone = "";
let currentY = 0;

db.forEach((star, index) => {
	const $div = document.createElement("div");

	$div.classList.add("star");
	
	$div.innerHTML = `
		<div class="tooltip">${star.name}</div>
		<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
			<path fill="currentColor" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15	C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343	c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957	c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25	c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657	C63.951,25.771,64.131,24.987,63.893,24.277z"/>
		</svg>
	`;

	let size = "80px";
	if (star.range === 1) {
		size = "90px";
	} else if (star.range === 2) {
		size = "65px";
	} else if (star.range === 3) {
		size = "45px";
	}
	
	const $svg = $div.querySelector("svg");
	$svg.style.width = size;
	$svg.style.height = size;
	$svg.style.color = star.color;
	$svg.style.filter = `drop-shadow(0 0 8px ${star.color})`;

	let availableZones = ["left", "center", "right"];
	if (lastZone !== "") {
		availableZones = availableZones.filter(z => z !== lastZone);
	}

	let chosenZone = availableZones[Math.floor(Math.random() * availableZones.length)];
	lastZone = chosenZone;

	let positionX = 0;
	if (chosenZone === "left") {
		positionX = Math.random() * 25;
	} else if (chosenZone === "center") {
		positionX = 35 + Math.random() * 30;
	} else {
		positionX = 70 + Math.random() * 25;
	}

	if (index === 0) {
		currentY = 0;
	} else {
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

	$containerStars.appendChild($div);
});

$containerStars.style.height = `${currentY + 150}px`;