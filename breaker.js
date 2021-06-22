var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 24;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 5;
var dy = 5;

var fastBallSpeed = 7;
var maxBallSpeed = 15;
var normalBallSpeed = 5;
var slowBallSpeed = 4;
var minBallSpeed = 3;
var ballSpeedChange = 1.3;
var currentBallSpeed = 5;

var fastPaddleSpeed = 22;
var maxPaddleSpeed = 22;
var normalPaddleSpeed = 15;
var slowPaddleSpeed = 9;
var minPaddleSpeed = 6.5;
var paddleSpeedChange = 1.15;
var currentPaddleSpeed = 15;

var startLasers = 3;
var currentLasers = 3;
var laserSpeed = 25;
var laserLength = 50;
var laserWidth = 10;

var powerupRadius = 30;
var powerupSpeed = 4;
var powerupTrackingSpeed = 3; 

var paddleHeight = 30;
var currentPaddleWidth = 180;
var smallPaddleWidth = 140;
var minPaddleWidth = 70;
var normalPaddle = 200;
var largePaddleWidth = 360;
var maxPaddleWidth = 350;
var paddleWidthChange = 1.3;

var paddleX = (canvas.width-currentPaddleWidth)/2;
var paddleY = canvas.height-paddleHeight;
var rightPressed = false;
var leftPressed = false;
var canHit = true;
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 180;
var brickHeight = 45;
var brickPadding = 18;
var brickOffsetTop = 60;
var brickOffsetLeft = 60;

var startEffectsCount = 4;
var effectsAddedPerRound = 0.5;
var maxEffectsCount = 12;
var currentEffectsCount = 4;

var startGoodEffectsRatio = 0.65;
var goodEffectsRatioLossRatePerRound = 0.95;
var minGoodEffectsRatio = 0.25;
var currentGoodEffectsRatio = 0.65;

var effectLength = 30;

var superball = false;
var splitPaddle = false;

var score = 0;

var cheat = false;
var cheated = false;
var tracking = false;
var hard = false;
var pause = false;

var balls = [];
var lasers = [];
var powerups = [];
var bricks = [];
var currentEffects = [];

var effects = {
'Superball':{ good:true, chance:0.33, color:'#00FFC8' },
'Big Paddle':{ good:true, chance:1, color:'#00FF5E' },
'Slow Ball':{ good:true, chance:1, color:'#00F2FF' },
'Multiball':{ good:true, chance:0.5, color:'#4800FF' },
'Fast Paddle':{ good:true, chance: 1, color:'#08B9FF' },
'TNT':{ good:true, chance:0.5, color:'#DD0000' },
'Have Fun':{ good:true, chance:0.2, color:'#BCF542' },
'Small Paddle':{ good:false, chance:1, color:'#FF0000' },
'Fast Ball':{ good:false, chance:1, color:'#FF0090' },
'Slow Paddle':{ good:false, chance:1, color:'#FF6600' },
'Reverse Paddle':{ good:false, chance:0.2, color:'#000000' },
'Good Luck':{ good:false, chance:0.2, color:'#B84900' },
'TOUGH':{ good:false, chance:0.5, color:'#333333' },
'All the Balls':{ good:true, chance:0.05, color:'#4800FF' },
'Split Paddle':{ good:false, chance:0.2, color:'#FFAA00' },
'+1 Laser':{ good:true, chance:0.5, color:'#00AD11' },
'Joe Mode':{ good:true, chance:0.05, color:'#00FFAA' },
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function getRandomEffect(goodEffect = true) {
  var choseEffect = false;
  var chosenEffect = "";
  while (!choseEffect) {
    chosenEffect = Object.keys(effects)[Math.floor(Math.random() * Object.keys(effects).length)];
    if (Math.random() < effects[chosenEffect].chance && effects[chosenEffect].good == goodEffect) {
      return chosenEffect;
    }
  }
}

function spawnBall(random=false) {
  if (random) {
    balls.push({ x: Math.random() * canvas.width, y: canvas.height-paddleHeight-ballRadius-10, dx: 1, dy: -1 });
  } else {
    balls.push({ x: paddleX+(currentPaddleWidth/2), y: canvas.height-paddleHeight-ballRadius-10, dx: 1, dy: -1 });
  }
}

function spawnLaser() {
  if (currentLasers > 0) {
    lasers.push ({ x: paddleX+(currentPaddleWidth/2), y: canvas.height-paddleHeight-laserLength, dx: 0, dy: -1 });
    currentLasers -= 1;
  }
}

function spawnPowerup(spawnX, spawnY, effect) {
  if (effect == 'TNT' || effect == 'TOUGH') { return; }
  powerups.push ({ x: spawnX, y: spawnY, dx: 0, dy: 1, effect: effect });
}

function clearBalls() {
  balls = [];
}

function clearLasers() {
  lasers = [];
}

function clearPowerups() {
  powerups = [];
}

function setSaveName() {
  setCookie('saveName', document.getElementById('name-input').value);
  //document.cookie = "saveName="+document.getElementById('name-input').value+";hardMode="+getCookie("hardMode");    
}

function setCookie(cookieName, cookieValue) {
  document.cookie = cookieName+'='+cookieValue;
}

function getCookie(cookieName) {
  var allCookies = document.cookie.split('; ');
  var foundCookie = allCookies.find(row => row.startsWith(cookieName));
  if (foundCookie == undefined) { return 'NULL' };

  var cookieValue = foundCookie.split('=')[1];
  return cookieValue;

  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  var saveName = "";
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName+"=") == 0) {
       saveName = c.substring(cookieName+"=".length, c.length);
    }
  }

  return saveName;
}

function showSaveName() {
  document.getElementById('name-input').value = getCookie("saveName");
}

function clearSave() {
  localStorage.removeItem('highScore', score);
  localStorage.removeItem('highScorer', score);
}

function nextRound() {
  currentEffectsCount += effectsAddedPerRound;
  if (currentEffectsCount >= maxEffectsCount) { currentEffectsCount = maxEffectsCount; }
  currentGoodEffectsRatio *= goodEffectsRatioLossRatePerRound;
  if (currentGoodEffectsRatio <= minGoodEffectsRatio) { currentGoodEffectsRatio = minGoodEffectsRatio; }
  initializeBricks();
  if (!hard) {
    disableEffects();
    balls = [];
    currentLasers += startLasers;
  } else {
    superball = false;
    tracking = false;
  }
  spawnBall();
}

function restartGame() {
  var saveName = getCookie('saveName');
  if (saveName == "") { 
    saveName = "???"
  }
  var hardMode = getCookie('hardMode');
  if (hardMode == 'true') {
    hard = true;
  } else if (hardMode == 'false') {
    hard = false;
  }

  if (localStorage.getItem('highScore') < score && !cheated) {
    localStorage.setItem('highScore', score);
    localStorage.setItem('highScorer', saveName);
  }
  cheated = false;
  score = 0;
  currentEffectsCount = startEffectsCount;
  currentGoodEffectsRatio = startGoodEffectsRatio;
  currentLasers = startLasers;
  initializeBricks();
  disableEffects();
  clearBalls();
  spawnBall();
}

function cheatMode() {
  cheat = !cheat;
  cheated = true;
}

function hardMode() {
  var hardModeCookie = getCookie('hardMode');
  if (hardModeCookie == 'true') {
    hard = false;
  } else if (hardModeCookie == 'false') {
    hard = true;
  } else {
    hard = !hard;
  }
  var hardModeCookieText = hard ? "true" : "false";
  setCookie('hardMode', hardModeCookieText);
  //document.cookie = "saveName="+getCookie("saveName")+";hardMode="+hardModeCookieText;  
}

function togglePause() {
  pause = !pause;
}

function initializeBricks() {
  bricks = [];

  //Initialize bricks in each column and row
  for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, health: 1, color: getRandomColor(), effect: '' };
    }
  }


  var goodEffectsCount = Math.round(currentEffectsCount * currentGoodEffectsRatio);

  //Using current round's calculated effect count, give random bricks effect
  for (var b=Math.floor(currentEffectsCount); b > 0; b--) {
    var randC = Math.floor(Math.random() * brickColumnCount);
    var randR = Math.floor(Math.random() * brickRowCount);
    
    var newEffect = '';

    if (b < goodEffectsCount) { newEffect = getRandomEffect(true); }
    else { newEffect = getRandomEffect(false); }

    bricks[randC][randR].effect = newEffect;
    bricks[randC][randR].color = effects[newEffect].color;
    bricks[randC][randR].health = newEffect == "TOUGH" ? 3 : 1;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
  else if (e.code == "Space") {
    togglePause();
  }
  else if (e.key == "e") {
    spawnLaser();
  }
}

//function mouseMoveHandler(e) {
//  var relativeX = e.clientX - canvas.offsetLeft;
//  if (relativeX > 0 && relativeX < canvas.width) {
//    paddleX = relativeX - currentPaddleWidth/2;
//  }
//}

function breakBlock(colliderIndex, c, r, bounce, colliderType="ball") {
  if (c < 0 || c >= bricks.length || r < 0 || r >= bricks[c].length) { return; }
  var b = bricks[c][r];
  if (b.health == 0) { return; }
  var collider;
  switch (colliderType) {
    case "ball":
      collider = balls[colliderIndex];
      break;
    case "laser":
      collider = lasers[colliderIndex];
      break;
    default:
      return;
      break;
  }

  side = 0; //none ... 1=left, 2=top, 3=right, 4=bottom
  var slopeMult = brickHeight/brickWidth;
  var slopeOffset = brickHeight;
  var f1 = (collider.x-b.x)*slopeMult;
  var f2 = (collider.x-b.x)*-slopeMult + slopeOffset;

  if (collider.y-b.y > f1 && collider.y-b.y <= f2) { side = 1; }
  else if (collider.y-b.y > f1 && collider.y-b.y > f2) { side = 2; }
  else if (collider.y-b.y <= f1 && collider.y-b.y > f2) { side = 3; }
  else if (collider.y-b.y <= f1 && collider.y-b.y <= f2) { side = 4; }
 
  //If we're in superball, don't change speed of ball when hitting a brick
  if (colliderType == "ball") {
    if ((bounce && b.effect != 'Superball') || b.effect == 'TOUGH') {
      if (side == 1 || side == 3) {
        collider.dx = -collider.dx;
      } else if (side == 2 || side == 4) {
        collider.dy = -collider.dy;
      }
    }
  } else if (colliderType == "laser") {
    lasers.splice(colliderIndex, 1);
  }
  
  //if (b.effect != '') {
  //  if (!hard) {
  //    enableEffect(b.effect);
  //  } else {
  //    enableEffect(b.effect);
  //    if (b.effect != 'TNT' && b.effect != 'TOUGH') {
  //      spawnPowerup(b.x, b.y, b.effect);
  //    }
  //  }
  //}

  b.health -= 1;
  if (b.health == 0) {
    score++;
    if (score % (brickRowCount*brickColumnCount) == 0) {
      //WIN BLOCK
      nextRound();
    }
 
    if (b.effect != '') {
      //if (!hard) {
        //enableEffect(b.effect);
      //} else {
        //enableEffect(b.effect);
        spawnPowerup(b.x, b.y, b.effect);
      //}
    }
  }

  addScreenShake(1.5);

  if (b.effect == 'TNT') {
    addScreenShake(100);
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) { continue; }
        else {
          breakBlock(colliderIndex, c+i, r+j, false);
        }
      }
    }
  }
}

function enableEffect(effectType) {
  if (!hard) {
    currentEffects.push({ type: effectType, time: effectLength });
  }
  switch (effectType) {
    case 'Superball':
      superball = true;
      break;
    case 'Big Paddle':
      if (hard && currentPaddleWidth*paddleWidthChange <= maxPaddleWidth) { currentPaddleWidth *= paddleWidthChange; }
      else if (!hard) { currentPaddleWidth = largePaddleWidth; }
      break;
    case 'Slow Ball':
      if (hard && currentBallSpeed/ballSpeedChange >= minBallSpeed) { currentBallSpeed /= ballSpeedChange; }
      else if (!hard) { currentBallSpeed = slowBallSpeed; }
      break;
    case 'Multiball':
      spawnBall();
      break;
    case 'Fast Paddle':
      if (hard && Math.abs(currentPaddleSpeed*paddleSpeedChange) <= maxPaddleSpeed) { currentPaddleSpeed *= paddleSpeedChange; }
      else if (!hard) { currentPaddleSpeed = fastPaddleSpeed; }
      break;
    case 'Have Fun':
      enableEffect('Superball');
      enableEffect('Big Paddle');
      enableEffect('Slow Ball');
      enableEffect('Multiball');
      enableEffect('Fast Paddle');
      break;
    case 'Small Paddle':
      if (hard && currentPaddleWidth/paddleWidthChange >= minPaddleWidth) { currentPaddleWidth /= paddleWidthChange; }
      else if (!hard) { currentPaddleWidth = smallPaddleWidth; }
      break;
    case 'Fast Ball':
      if (hard && currentBallSpeed*ballSpeedChange <= maxBallSpeed) { currentBallSpeed *= ballSpeedChange; }
      else if (!hard) { currentBallSpeed = fastBallSpeed; }
      break;
    case 'Slow Paddle':
      if (hard && currentPaddleSpeed/paddleSpeedChange >= minPaddleSpeed) { currentPaddleSpeed /= paddleSpeedChange; }
      else if (!hard) { currentPaddleSpeed = slowPaddleSpeed; }
      break;
    case 'Reverse Paddle':
      if (hard) {
        currentPaddleSpeed *= -1;
      } else if (currentPaddleSpeed > 0) {
        currentPaddleSpeed *= -1;
      }
      break;
    case 'Good Luck':
      enableEffect('Small Paddle');
      enableEffect('Fast Ball');
      enableEffect('Reverse Paddle');
      enableEffect('Split Paddle');
      break;
    case 'All the Balls':
      spawnBall(true);
      spawnBall(true);
      spawnBall(true);
      spawnBall(true);
      spawnBall(true);
      spawnBall(true);
    case 'Split Paddle':
      if (hard) {
        if (!splitPaddle) { currentPaddleWidth *= 1.5; }
        else { currentPaddleWidth /= 1.5; }
        splitPaddle = !splitPaddle; 
      } else { 
        if (!splitPaddle) { currentPaddleWidth *= 1.5; }
        splitPaddle = true;
      };
    case '+1 Laser':
      currentLasers += 1;
      break;
    case 'Joe Mode':
      tracking = true;
      break;
    default:
      break;
  }
}

function disableEffect(effectType) {
  switch (effectType) {
    case 'Superball':
      superball = false;
      break;
    case 'Big Paddle':
      if (hard) { currentPaddleWidth /= paddleWidthChange; }
      else { currentPaddleWidth = normalPaddle; }
      break;
    case 'Slow Ball':
      if (hard) { currentBallSpeed *= ballSpeedChange; }
      else { currentBallSpeed = normalBallSpeed; }
      break;
    case 'Fast Paddle':
      if (hard) { currentPaddleSpeed /= paddleSpeedChange; }
      else {currentPaddleSpeed = normalPaddleSpeed; }
      break;
    case 'Small Paddle':
      if (hard) { currentPaddleWidth *= paddleWidthChange; }
      else { currentPaddleWidth = normalPaddle; }
      break;
    case 'Fast Ball':
      if (hard) { currentBallSpeed /= ballSpeedChange; }
      else { currentBallSpeed = normalBallSpeed; }
      break;
    case 'Slow Paddle':
      if (hard) { currentPaddleSpeed *= paddleSpeedChange; }
      else { currentPaddleSpeed = normalPaddleSpeed; }
      break;
    case 'Reverse Paddle':
      if (currentPaddleSpeed < 0) {
        currentPaddleSpeed *= -1;
      }
      break;
    case 'Split Paddle':
      if (!hard && splitPaddle) {
        splitPaddle = false;
        currentPaddleWidth /= 2;
      }
      break;
    case 'Joe Mode':
      tracking = false;
    default:
      break;
  }
}

function disableEffects() {
  superball = false;
  splitPaddle = false;
  tracking = false;
  currentPaddleWidth = normalPaddle;
  currentBallSpeed = normalBallSpeed;
  currentPaddleSpeed = normalPaddleSpeed;
  currentEffects = [];
}

function collisionDetection() {
  for (var c=0; c<brickColumnCount; c++) {
    for (var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.health >= 1) {
        for (var ballIndex = 0; ballIndex < balls.length; ballIndex++) {
          var ball = balls[ballIndex];
          if (ball.x > b.x-ballRadius && ball.x < b.x+brickWidth+ballRadius && ball.y > b.y-ballRadius && ball.y < b.y+brickHeight+ballRadius) {
            breakBlock(ballIndex, c, r, !superball);     
          }
        }
        for (var laserIndex = 0; laserIndex < lasers.length; laserIndex++) {
          var laser = lasers[laserIndex];
          if (laser.x > b.x && laser.x < b.x+brickWidth+laserWidth && laser.y > b.y && laser.y < b.y+brickHeight+(laserLength/2)) {
            breakBlock(laserIndex, c, r, false, "laser");
          }
        }
      }
    }
  }

  for (var ballIndex = 0; ballIndex < balls.length; ballIndex++) {
    var ball = balls[ballIndex];
    if (!splitPaddle) {
      if (ball.x > paddleX-ballRadius && ball.x < paddleX+currentPaddleWidth+ballRadius && ball.y > paddleY-ballRadius && ball.y < paddleY+paddleHeight+ballRadius) {
        if (ball.dy > 0) {
          ball.dy = -ball.dy;
        }
      }
    } else {
      if (((ball.x > paddleX-ballRadius && ball.x < paddleX+(currentPaddleWidth/3)+ballRadius) || (ball.x > paddleX+(currentPaddleWidth*2/3)-ballRadius && ball.x < paddleX+(currentPaddleWidth)+ballRadius)) && (ball.y > paddleY-ballRadius && ball.y < paddleY+paddleHeight)) {
        if (ball.dy > 0) {
          ball.dy = -ball.dy;
        }
      }
    }
  }

  for (var powerupIndex = 0; powerupIndex < powerups.length; powerupIndex++) {
    var powerup = powerups[powerupIndex];
    if (!splitPaddle) {
      if (powerup.x > paddleX-ballRadius && powerup.x < paddleX+currentPaddleWidth+powerupRadius && powerup.y > paddleY-powerupRadius && powerup.y < paddleY+paddleHeight+powerupRadius) {
        enableEffect(powerup.effect);
        powerups.splice(powerupIndex, 1);
      }
    } else {
      if (((powerup.x > paddleX-powerupRadius && powerup.x < paddleX+(currentPaddleWidth/3)+powerupRadius) || (powerup.x > paddleX+(currentPaddleWidth*2/3)-powerupRadius && powerup.x < paddleX+(currentPaddleWidth)+powerupRadius)) && (powerup.y > paddleY-powerupRadius && powerup.y < paddleY+paddleHeight)) {
        enableEffect(powerup.effect);
        powerups.splice(powerupIndex, 1);
      }
    }
  }
}

function drawBG() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#EEEEEE";
  ctx.fill();
  ctx.closePath();
}

function drawBalls() {
  for (var ball = 0; ball < balls.length; ball++) {
    drawBall(balls[ball].x, balls[ball].y);
  }
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawLasers() {
  for (var laser = 0; laser < lasers.length; laser++) {
    drawLaser(lasers[laser].x, lasers[laser].y);
  }
}

function drawLaser(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, laserWidth, laserLength);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPowerups() {
  for (var powerup = 0; powerup < powerups.length; powerup++) {
    drawPowerup(powerups[powerup].x, powerups[powerup].y, powerups[powerup].effect);
  }
}

function drawPowerup(x, y, effect) {
  ctx.beginPath();
  ctx.arc(x, y, powerupRadius, 0, Math.PI*2);
  var good = effects[effect].good || (splitPaddle && effect == 'Split Paddle') || (currentPaddleSpeed < 0 && effect == 'Reverse Paddle');
  var goodText = good ? "+" : "-";
  //if (!hard) {
    ctx.fillStyle = good ? "#00FF00" : "#FF0000";
  //} else {
  //  ctx.fillStyle = "#0095DD";
  //}
  ctx.fill();
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  //if (!hard) {
    ctx.fillText(goodText, x, y);
  //} else {
  //  ctx.fillText("?", x, y);
  //}
  ctx.closePath();
}

function drawPaddle() {
  if (!splitPaddle) {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, currentPaddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, currentPaddleWidth/3, paddleHeight);
    ctx.rect(paddleX+currentPaddleWidth*2/3, paddleY, currentPaddleWidth/3, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
}

function drawBricks() {
  for (var c=0; c<brickColumnCount; c++) {
    for (var r=0; r<brickRowCount; r++) {
      if (bricks[c][r].health >= 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        var brick = bricks[c][r];
        brick.x = brickX;
        brick.y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = brick.color;
        ctx.fill();
        ctx.closePath();
        ctx.font = "16px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign= "center";
        ctx.textBaseline = "middle";
        var text = brick.effect;
        ctx.fillText(text + "", brick.x+(brickWidth/2), brick.y+(brickHeight/2));
      }
    }
  }
}

function drawScore() {
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, canvas.width/2, 30);
}

function drawDetails() {
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "#0095DD";
  var hardModeText = hard ? "HARD" : "NORMAL";
  var laserText = " - Lasers: " + currentLasers;
  var debugText = "";
  ctx.fillText(hardModeText + laserText + debugText, 20, 30);

  ctx.font = "24px Arial";
  ctx.textAlign = "right";
  ctx.fillStyle = "#0095DD";
  var scoreText = "High Score: "+localStorage.getItem('highScore')+" ("+localStorage.getItem('highScorer')+")";
  ctx.fillText(scoreText, canvas.width, 30);
}

var screenShakeDissapationMult = 0.95;
var minScreenShakeMovement = 0.1;
var currentScreenShake = 0;
var screenShakeX = 0;
var screenShakeY = 0;

function addScreenShake(strength) {
  currentScreenShake = strength;
}

function screenShake() {
  if (currentScreenShake < minScreenShakeMovement) {
    screenShakeX = 0;
    screenShakeY = 0;
    return;
  }
    
  currentScreenShake *= screenShakeDissapationMult;
  screenShakeX = Math.sin(currentScreenShake) * currentScreenShake;
  screenShakeY = Math.cos(currentScreenShake) * currentScreenShake;

}

function draw() {
  if (pause) {
    return;
  }
  
  screenShake();

  canvas.style.left = screenShakeX;
  canvas.style.top = screenShakeY;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBG();
  
  ctx.globalCompositeOperation = 'source-over';
  
  drawBricks();
  drawBalls();
  drawLasers();
  drawPowerups();
  drawPaddle();
  drawScore();
  drawDetails();
  collisionDetection();

  if (currentPaddleSpeed < 0) {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.globalCompositeOperation = 'difference';
    ctx.fill();
    ctx.closePath();
  }

  for (var b = 0; b < currentEffects.length; b++) {
    var effect = currentEffects[b];
    if (effect.time < 0) {
      disableEffect(effect.type);
      currentEffects.splice(b, 1);
    } else if (effect.time >= 0) {
      effect.time -= 0.01;
    }
  }
  
  var lowestBall = 0;
  var lowestBallHeight = 0;

  for (var l = 0; l < lasers.length; l++) {
    var laser = lasers[l];
    laser.x += laser.dx*laserSpeed;
    laser.y += laser.dy*laserSpeed;

    if (laser.y < 0-laserLength) {
      lasers.splice(l, 1);
    }
  }

  var lowestPowerup = 0;
  var lowestPowerupHeight = 0;
  for (var p = 0; p < powerups.length; p++) {
    var powerup = powerups[p];
    
    if (hard && !effects[powerup.effect].good) {
      if (powerup.x < paddleX) {
        powerup.x += 1*powerupTrackingSpeed;
      } else if (powerup.x > paddleX) {
        powerup.x += -1*powerupTrackingSpeed;
      }
    }
    
    powerup.y += powerup.dy*powerupSpeed;

    if (powerup.y > lowestPowerupHeight && effects[powerup.effect].good) {
      lowestPowerupHeight = powerup.y;
      lowestPowerup = p;
    }

    if (powerup.y > canvas.height+powerupRadius) {
      powerups.splice(p, 1);
    }
  }

  for (var b = 0 ; b < balls.length; b++) {
    var ball = balls[b];
    if (ball.x > canvas.width-ballRadius && ball.dx > 0) {
      ball.dx = -ball.dx;
    }
    else if (ball.x < ballRadius && ball.dx < 0) {
      ball.dx = -ball.dx;
    }
    
    if (ball.y < ballRadius && ball.dy < 0) {
      ball.dy = -ball.dy;
      canHit = true;
    }

    else if (ball.y > canvas.height-ballRadius) {
      //if (ball.x > paddleX && ball.x < paddleX + currentPaddleWidth) {
      //  ball.dy = -ball.dy;
      //}
      //else {
        balls.splice(b, 1);
        if (balls.length <= 0) {
          restartGame();
        }
        ball.dy = -ball.dy;
      //}
    }

    ball.x += ball.dx*currentBallSpeed;
    ball.y += ball.dy*currentBallSpeed;

    if (ball.y > lowestBallHeight) {
      lowestBallHeight = ball.y;
      lowestBall = b;
    }
  }
  
  if (cheat || tracking) {
    var trackingOffset = splitPaddle ? currentPaddleWidth/3 : 0;
    if (lowestBallHeight > lowestPowerupHeight) {
      paddleX = balls[lowestBall].x-(currentPaddleWidth/2) + trackingOffset;
    } else if (lowestPowerupHeight > lowestBallHeight) {
      paddleX = powerups[lowestPowerup].x-(currentPaddleWidth/2) + trackingOffset;
    }
  }

  if (currentPaddleSpeed > 0) {
    if (!cheat && !tracking && rightPressed && paddleX < canvas.width-currentPaddleWidth) {
      paddleX += currentPaddleSpeed;
    } else if (!cheat && !tracking && leftPressed && paddleX > 0) {
      paddleX -= currentPaddleSpeed;
    }
  } else {
    if (!cheat && !tracking && rightPressed && paddleX > 0) {
      paddleX += currentPaddleSpeed;
    } else if (!cheat && !tracking && leftPressed && paddleX < canvas.width-currentPaddleWidth) {
      paddleX -= currentPaddleSpeed;
    }
  }
}

//showSaveName();
var interval = setInterval(draw, 10);
restartGame();






