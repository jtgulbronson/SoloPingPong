// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelRequestAnimFrame = (function () {
  return window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout;
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

function paintCanvas() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);
}
paintCanvas();

//Track Mouse Position
function trackPosition(evt) {
  mouseObj.x = evt.pageX;
  mouseObj.y = evt.pageY;
  console.log("Cursor x is : " + mouseObj.x + " Cursor y is : " + mouseObj.y)
}

gameCanvas.addEventListener("mousemove", trackPosition, true);