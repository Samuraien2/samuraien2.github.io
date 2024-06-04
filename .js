// Canvas Size: 4:3 (917:692)
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gameWidth = 800;
const gameHeight = 600;
const playerSize = 36;
const SMALL_ZOMBIE_SIZE = 50;
const LARGE_ZOMBIE_SIZE = 200;
const zombie_rewards = [1, 1, 2, 5, 20, 5, 10];
const zombie_speeds = [0, 0, 1.2, 1.2, -1.54];
const TOTAL_ZOMBIES = 3;
const zombie_cooldowntimes = [90, 150, 230];
const imageUrls = [
'skins/heart.png', // https://i.ibb.co/Xjjh9cG/h.png, https://i.ibb.co/ykFPDjC/h.png 'start.png'
];
let x, y;
let leftKeyDown = false, rightKeyDown = false, upKeyDown = false, downKeyDown = false;
let zombieSpeed = 1;
let playerSpeed = 3;
let gameState = 0;

let zombie_cooldowns = [];
let zombie_destinations = [];
let zombie_type = [], zombie_x = [], zombie_y = [], zombie_hp = [];
let mouseX = 0;
let mouseY = 0;
let score = 0;
let distance = 0;
let endless = false;
function loadImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});
}

Promise.all(imageUrls.map(url => loadImage(url)))
	.then(images =>
{
document.body.addEventListener('keydown', keyChange)
document.body.addEventListener('keyup', keyChange)

document.body.addEventListener('mousedown', () => {
	touchingZombies();
});

function keyChange(e){
	const keyCode = e.keyCode;
	const isKeyDown = e.type === 'keydown';
	switch(keyCode) {
		case 87: upKeyDown = isKeyDown; break;
		case 65: leftKeyDown = isKeyDown; break;
		case 83: downKeyDown = isKeyDown; break;
		case 68: rightKeyDown = isKeyDown; break;
	}
}

document.body.addEventListener('mousemove', (e) => {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
});

ctx.imageSmoothingEnabled = false;
imgs = images;
startGame();

});


function titleScreen(){
	gameState = 0;
	
}

function startGame(){
	x = (gameWidth-playerSize)/2;
	y = (gameHeight-playerSize)/2;
	gameState = 1;
	score = 0;
	zombie_cooldowns = [...zombie_cooldowntimes];
	endless = false;
	zombieSpeed = 1;
	playerSpeed = 3;
	gameFrame();
}

function gameFrame(){
	ctx.clearRect(0,0,gameWidth,gameHeight);
	mouseDistance();
	zombieSpawnTick();
	movePlayer();
	processZombies();
	drawZombies();
	drawPlayer();
	if (gameState === 1) requestAnimationFrame(gameFrame);
};

function zombieSpawnTick(){
	for (let i = 0; i < TOTAL_ZOMBIES; i++){
		zombie_cooldowns[i]--;
		if(zombie_cooldowns[i] === 0){
			zombie_cooldowns[i] = zombie_cooldowntimes[i];
			
			// spawn zombie
			zombie_type.push(i);
			if (i === 1){
				zombie_hp.push(2);
			} else if (i === 2) {
				zombie_hp.push(0); // opacity
			} else {
				zombie_hp.push(1);
			}
			regularRandomSpawn(Math.floor(Math.random() * 4))
		}
	}
};

function mouseDistance(){
	
}

function touchingZombies() {
	for (let i = zombie_type.length - 1; i >= 0; i--) {
		const zombieSize = SMALL_ZOMBIE_SIZE;
		if (mouseTouchingRect(zombie_x[i], zombie_y[i], zombieSize, zombieSize)){
			if (zombie_hp[i] === 1 || zombie_type[i] === 2) {
				killZombie(i);
			} else {
				zombie_hp[i]--
				if (zombie_type[i] === 1) {
					
				}
			}
			break;
		}
	}
}

function killZombie(zombie) {
	zombie_type.splice(zombie, 1);
	zombie_x.splice(zombie, 1);
	zombie_y.splice(zombie, 1);
	zombie_hp.splice(zombie, 1);
}

function mouseTouchingRect(rectX, rectY, rectWidth, rectHeight) {
	if (mouseX < rectX) return false;
	if (mouseX > rectX + rectWidth) return false;
	if (mouseY < rectY) return false;
	if (mouseY > rectY + rectHeight) return false;
	return true;
}

function squaresTouching(x1, y1, size1, x2, y2, size2) {
	if (x1 > x2 + size2) return false;
	if (x1 + size1 < x2) return false;
	if (y1 > y2 + size2) return false;
	if (y1 + size1 < y2) return false;
	return true;
}

function movePlayer(){
	if (downKeyDown) y += playerSpeed;
	if (upKeyDown) y -= playerSpeed;
	if (leftKeyDown) x -= playerSpeed;
	if (rightKeyDown) x += playerSpeed;
	// fence
	if (y < 0) {y = 0;} else if (y > gameHeight - playerSize) {y = gameHeight - playerSize}
	if (x < 0) {x = 0;} else if (x > gameWidth - playerSize) {x = gameWidth - playerSize}
};

function regularRandomSpawn(random){
	switch (random) {
		case 0:
			zombie_x.push(Math.random() * gameWidth);
			zombie_y.push(0-SMALL_ZOMBIE_SIZE);
			break;
		case 1:
			zombie_x.push(Math.random() * gameWidth);
			zombie_y.push(gameHeight);
			break;
		case 2:
			zombie_x.push(0-SMALL_ZOMBIE_SIZE);
			zombie_y.push(Math.random() * gameHeight);
			break;
		default:
			zombie_x.push(gameWidth);
			zombie_y.push(Math.random() * gameHeight);
	}
}

function drawPlayer() {
	ctx.fillStyle = "#B838E5";
	ctx.drawImage(imgs[0], x, y, playerSize, playerSize);
};

function drawZombies(){
	for (let i = 0; i < zombie_type.length; i++) {
		if(zombie_type[i] === 1 && zombie_hp[i] === 2){
			ctx.fillStyle = "#267F00";
		}else if (zombie_type[i] === 2) {
			ctx.globalAlpha = zombie_hp[i] / 200;
			ctx.fillStyle = "#FFE97F";
		} else {
			ctx.fillStyle = "#2D9900";
		}
		ctx.fillRect(zombie_x[i],zombie_y[i],SMALL_ZOMBIE_SIZE,SMALL_ZOMBIE_SIZE);
		ctx.globalAlpha = 1;
	}
}

function processZombies(){
	for (let i = 0; i < zombie_type.length; i++){
		// move
		const zombieSize = SMALL_ZOMBIE_SIZE;
		const center = playerSize/2 - zombieSize/2;
		const dx = x - zombie_x[i] + center;
		const dy = y - zombie_y[i] + center;
		const distance = (zombieSpeed + zombie_speeds[zombie_type[i]]) / Math.sqrt(dx * dx + dy * dy);

		zombie_x[i] += distance * dx;
		zombie_y[i] += distance * dy;

		// check collisions
		if (squaresTouching(x, y, playerSize, zombie_x[i], zombie_y[i], zombieSize)){
			console.log("--- LOST ---")
			gameState = 0;
		}
		// other events
		if (zombie_type[i] === 2 && zombie_hp[i] != 200) {
			zombie_hp[i]++;
		}

	}
}