//! consts
const canvas = document.getElementById('race');
const ctx = canvas.getContext('2d');;
const btnRepeat = document.getElementById('btnRepeat');

const options = {
  state: 'stop',
  width: canvas.width,
  height: canvas.height,
  numberOfRoads: Math.floor(canvas.width/200),
  rangeOfLine: 500/3,
  colorOfLine: '#948080',
  speedEnemy: 7,
  audio: false,
}
console.log(options.numberOfRoads);

//! objects
const carPlayer = new Image();
carPlayer.src = "images/car-player.png";
carPlayer.X = 100;
carPlayer.Y = 400;
carPlayer.width = 330;
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
  ctx.font = "50px serif";
  ctx.fillStyle = "red";
  ctx.fillText('GAME OVER', options.width/6, options.height/2);
  toggleDisplayElem(btnRepeat, 'flex');
  
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
    if ( checkCollisionCars() ) {
      gameOver()
      return
    }

    myReq = requestAnimationFrame(render);
}


//! init game
spawnEnemy()
render()

// ! events
btnRepeat.addEventListener('click', eventRepeatGame);
canvas.addEventListener('mousemove', eventMovePlayer);

function eventMovePlayer(e) {
  carPlayer.X = e.clientX - canvas.offsetLeft - carPlayer.width/2;
}

function eventRepeatGame() {
  toggleDisplayElem(btnRepeat, 'none');
  spawnEnemy()
  render()
}