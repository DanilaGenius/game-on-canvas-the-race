//! consts
const gameInner = document.getElementById('gameInner');
const canvas = document.getElementById('race');
const ctx = canvas.getContext('2d');;
const mainMenu = document.getElementById('mainMenu');
const btnStart = document.getElementById('btnStart');
const btnInOntions = document.getElementById('btnInOntions');
const btnToggleMusic = document.getElementById('btnToggleMusic');
const lossMenu = document.getElementById('lossMenu');
const btnRepeat = document.getElementById('btnRepeat');
const btnInMenu = document.querySelectorAll("#btnInMenu")
const optionsMenu = document.getElementById('optionsMenu');
const valueAudio = document.getElementById('valueAudio');
const pointsBar = document.getElementById('pointsBar');
const numberPoints = document.querySelectorAll('#numberPoints')
let points = 0
let counterPoints;

const options = {
  state: 'stop',
  width: canvas.width,
  height: canvas.height,
  numberOfRoads: Math.floor(canvas.width/200),
  rangeOfLine: 500/3,
  colorOfLine: '#0000ff10',
  speedEnemy: 2,
  audio: false,
};

//! objects
const carPlayer = new Image();
carPlayer.src = "images/car-player.png";
carPlayer.X = 100;
carPlayer.Y = 400;
carPlayer.width = 166;
carPlayer.height = 50;

const carEnemy = new Image();
carEnemy.src = "images/car-enemy.png";
carEnemy.width = 77;
carEnemy.height = 64;

const lineOfRoad = new Path2D();
ctx.fillStyle = options.colorOfLine;
for (let i = 1; i <= options.numberOfRoads; i++) {
  lineOfRoad.rect(options.rangeOfLine * i - 5, 0, 10, options.height);
}

const audioCollision = new Audio();
audioCollision.src = './audio/Vo_dark_willow_axaxaxa.mp3';

//! functions
function drawLine() {
  ctx.fillStyle = options.colorOfLine;
  ctx.fill(lineOfRoad);
}

function drawPlayer() {
  ctx.drawImage(carPlayer, carPlayer.X, carPlayer.Y, carPlayer.width, carPlayer.height);
}

function drawEnemy() {
  ctx.drawImage(carEnemy, carEnemy.X, carEnemy.Y, carEnemy.width, carEnemy.height);
}

function clearField() {
  ctx.clearRect(0, 0, 1000, 1000);
}

function gameOver() {
  carEnemy.Y = null;
  ctx.clearRect(0, 0, 1000, 1000);
  closeAllMenu()
  toggleDisplayElem(lossMenu, 'flex');
  counterPointsReset()
  audioPlay(audioCollision)
}

function spawnEnemy() {
  carEnemy.X = options.width * Math.random()
  carEnemy.Y = 10;
}

function moveDownEnemy() {
  carEnemy.Y += options.speedEnemy;
}

function respawnEnemy() {
  if (carEnemy.Y >= options.height) {
    spawnEnemy();
  }
}

function checkCollisionCars() {
  if (((carPlayer.X <= (carEnemy.X + carEnemy.width)  && (carPlayer.X + carPlayer.width) >= (carEnemy.X + carEnemy.width)) ||
      ((carPlayer.X + carPlayer.width) >= carEnemy.X  && (carPlayer.X + carPlayer.width) <= (carEnemy.X + carEnemy.width))) &&
        (carEnemy.Y + carEnemy.height) >= carPlayer.Y &&
         carEnemy.Y  <= (carPlayer.Y + carPlayer.height)) {
      return true
    }
}

function toggleDisplayElem(elem, value) {
  elem.style.display = value;
}

function audioPlay(name) {
  if (options.audio) name.play();
}

function render() {
    clearField()
    drawLine()
    drawPlayer()
    respawnEnemy()
    drawEnemy()
    moveDownEnemy()
    counterPointsPlus()
    if ( checkCollisionCars() ) {
      gameOver()
      return
    }
    

    myReq = requestAnimationFrame(render);
}

function closeAllMenu() {
  toggleDisplayElem(lossMenu, 'none')
  toggleDisplayElem(optionsMenu, 'none')
  toggleDisplayElem(mainMenu, 'none')
  toggleDisplayElem(pointsBar, 'none')
}

function counterPointsPlus() {
  points += 0.1;
  
  numberPoints.forEach(el => {el.innerHTML = Math.floor(points)})
}
function counterPointsReset() {
  points = 0
}

//! init game
// spawnEnemy()
// render()

// ! events
btnRepeat.addEventListener('click', eventRepeatGame);
canvas.addEventListener('mousemove', eventMovePlayer);

btnStart.addEventListener('click', eventStartGame);
btnInOntions.addEventListener('click', eventInOntions);
btnToggleMusic.addEventListener('click', eventToggleMusic);
btnRepeat.addEventListener('click', eventRepeatGame);
btnInMenu.forEach(e => {e.addEventListener('click', eventInMainMenu);})
gameInner.addEventListener('mousedown', (e) => e.preventDefault());

function eventMovePlayer(e) {
  carPlayer.X = e.clientX - canvas.offsetLeft - carPlayer.width/2;
  carPlayer.Y = e.clientY - canvas.offsetTop - carPlayer.height/2;
}

function eventInMainMenu(e) {
  closeAllMenu()
  toggleDisplayElem(mainMenu, 'flex')
}

function eventRepeatGame() {
  eventStartGame()
}

function eventStartGame() {
  closeAllMenu()
  toggleDisplayElem(pointsBar, 'flex')
  spawnEnemy()
  render()
}

function eventInOntions(e) {
  closeAllMenu()
  toggleDisplayElem(optionsMenu, 'flex')
}

function eventToggleMusic() {
  options.audio = !options.audio
  if (options.audio) {
    valueAudio.textContent = 'ON';
    return
  }
  valueAudio.textContent = 'OFF';
}