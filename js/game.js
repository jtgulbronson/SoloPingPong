// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();
window.cancelRequestAnimFrame = (function () {
  return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout;
})();
//Do Not Touch Above Code
//console.log('Holla');
// Step one .. jtg .. Create game canvas and track mouse position
var gameCanvas = document.getElementById("canvas");
//Store HTML5 canvas tag into JS variable
var ctx = gameCanvas.getContext("2d"); //Create context 2d
var W = window.innerWidth;
var H = window.innerHeight;
var mouseObj = {};
gameCanvas.width = W;
gameCanvas.height = H;
//Step 02 ... jtg ... Clear page canvas by covering in Black
function paintCanvas() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);
}
paintCanvas();

function trackPosition(evt) {
  mouseObj.x = evt.pageX;
  mouseObj.y = evt.pageY;
  //  console.log("Cursor x is : " + mouseObj.x + " Cursor y is : " + mouseObj.y)
}
gameCanvas.addEventListener("mousemove", trackPosition, true);
//Step 03 ... jtg ... Place ball on Canvas
var ball = {}; //Ball Obj
ball = {
  x: 50
  , y: 50
  , r: 5
  , c: "#ffffff"
  , vx: 4
  , vy: 8
  , draw: function () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
  }
}
ball.draw();
//Step 04 ... jtg ... Create a Start Button
var startBtn = {}; //Start button Obj
startBtn = {
  w: 100
  , h: 50
  , x: W / 2 - 50
  , y: H / 2 - 25
  , draw: function () {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = "2";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.font = "18px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Start", W / 2, H / 2);
  }
}
startBtn.draw();
//Step 05 ... jtg ... Place score and points on Canvas
var points = 0; //Game points
function paintScore() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Arial, Helvetica, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + points, 20, 20)
}
paintScore();
//Step 06 ... jtg ... Place paddles (top and bottom) on canvas
function paddlePosition(TB) {
  this.w = 150;
  this.h = 5;
  this.x = W / 2 - this.w / 2;
  //  if (TB == "top") {
  //    this.y = 0;
  //  }
  //  else {
  //    this.y = H - this.h;
  //  }
  // shortened if then below
  this.y = (TB == "top") ? 0 : H - this.h;
}
var paddlesArray = []; //Paddles Array
paddlesArray.push(new paddlePosition("top"));
paddlesArray.push(new paddlePosition("bottom"));
//console.log("top paddle y is: " + paddlesArray[0].y);
//console.log("bottom paddle y is: " + paddlesArray[1].y);
function paintPaddles() {
  for (var lp = 0; lp < paddlesArray.length; lp++) {
    p = paddlesArray[lp];
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }
}
paintPaddles();
// Step 07 ... jtg ... Detect click on screen
gameCanvas.addEventListener("mousedown", btnClick, true);

function btnClick(evt) {
  var mx = evt.pageX;
  var my = evt.pageY;
  //User clicks on actual Start Button
  if (mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
    if (my >= startBtn.y && my <= startBtn.y + startBtn.h) {
      //      console.log("Start button clicked");
      //Delet the start button
      startBtn = {};
      //Start Game animation loop
      animloop();
    }
  }
}
// Function for running animation loop
var init; // Initialize game animation
function animloop() {
  init = requestAnimFrame(animloop);
  refreshCanvasFun();
}
// Step 08 ... jtg ... Draw everything on Canvas repeatedly
function refreshCanvasFun() {
  paintCanvas();
  paintScore();
  paintPaddles();
  ball.draw();
  update();
}

function update() {
  //move paddles, track mouse
  for (var lp = 0; lp < paddlesArray.length; lp++) {
    p = paddlesArray[lp];
    p.x = mouseObj.x - p.w / 2;
  }
  //move ball
  ball.x += ball.vx;
  ball.y += ball.vy;
  //check ball and paddle collision
  check4collision();
}
// Step 08.05 ... jtg ... Collision
function check4collision() {
  var pTop = paddlesArray[0];
  var pBot = paddlesArray[1];
  if (collides(ball, pTop)) {
    collideAction(ball, pTop);
  }
  else if (collides(ball, pBot)) {
    collideAction(ball, pBot);
  }
  else {
    //collide with side walls of the browser or end of game
    if (ball.y + ball.r > H) {
      //game ends (goes off bottom)
    }
    else if (ball.y < 0) {
      //game ends (goes off top)
    }
    if (ball.x + ball.r > W) {
      //hits right side of browser
      ball.vx = -ball.vx;
      ball.x = W - ball.r;
    }
    else if (ball.x - ball.r < 0) {
      //hits left side of browser
      ball.vx = -ball.vx;
      ball.x = ball.r;
    }
  }
}
var paddleHit; //Which paddle was hit. 0 = top; 1 = bottom;
function collides(b, p) {
  if (b.x + b.r >= p.x && b.x - b.r <= p.x + p.w) {
    if (b.y >= (p.y - p.h) && p.y > 0) {
      paddleHit = 0;
      return true;
    }
    else if (b.y <= p.h && p.y === 0) {
      paddleHit = 1;
      return true;
    }
    else {
      return false;
    }
  }
}
var collSnd = document.getElementById("collide");

function collideAction(b, p) {
  collSnd.play();
  //reverse velocity on y-axis
  ball.vy = -ball.vy;
  // increase score by 1
  points++;
}
//rotate canvas 90deg
ctx.rotate(Math.PI / 180);