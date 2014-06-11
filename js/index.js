
var w = 700;
var h = 700;

tools.mixin(tools, this);
var stage = new Stage(w, h);
var out = stage.out;

var LEFT = 1;
var TOP = 2;
var RIGHT = 4;
var BOTTOM = 8;


var sizes = [10, 20, 25, 50];

function generate()
{
  out.clearRect(0, 0, w, h);
var size = sizes[Math.floor(Math.random() * sizes.length)];

var nx = size;
var ny = size;
var n = nx * ny;
var tw = w / nx;
var th = h / ny;
var tiles = [];
var lineSize = (0.1 + Math.random() * 0.8) * tw;
var borderSize = Math.max(lineSize * 1.1, lineSize + 2);
var lw = lineSize;
var radius = Math.random() * 0.5 * tw;
if(Math.random() < 0.2)radius *= -1;

var connection = Math.random() < 0.5 ? 1 : 0;

var tilesPatterns = [
  pattern0,
  pattern1,
  r(1, pattern1),
  pattern2,
  r(2, pattern1),
  pattern3,
  r(1, pattern2),
  pattern4,
  r(3, pattern1),
  r(3, pattern2),
  r(1, pattern3),
  r(3, pattern4),
  r(2, pattern2),
  r(2, pattern4),
  r(1, pattern4),
  pattern5
];

function setBorderStyle()
{
  out.fillStyle = "white";
  lw = borderSize;
}

function setPathStyle()
{
  out.fillStyle = "black";
  lw = lineSize;
}


setPathStyle();

for(var i = 0; i < n; i++)
{
  var posX = i % nx;
  var posY = Math.floor(i / ny);
  var l = posX > 0 ? (tiles[i - 1] & RIGHT) : 0;
  var t = i > 0 ? (tiles[i - nx] & BOTTOM) : 0;
  var r = posX < nx - 1 ? (Math.random() < 0.5 ? 1 : connection) : 0;
  var b = posY < ny - 1 ? (Math.random() < 0.5 ? 1 : connection) : 0;
  if(l) l = LEFT;
  if(t) t = TOP;
  if(r) r = RIGHT;
  if(b) b = BOTTOM;
  tiles[i] = b | r | t | l;
  //if(!tiles[i])tiles[i] = Math.random() < 0.5 ? RIGHT : BOTTOM;
  drawTile(posX, posY, tiles[i]);
}

function drawTile(posX, posY, value)
{
  out.save();
  out.translate(posX * tw, posY * th);
  tilesPatterns[value]();
  out.restore();
}


function r(n, p)
{
  return function()
  {
    for(var i = 0; i < n; i++)
      rotate();
    p();
  }
}

function pattern0(){}
function pattern1()
{
  out.fillRect(0, 0.5 * (th - lw), 0.5 * tw + 1, lw);
  out.beginPath();
  out.moveTo(0.5 * tw, 0.5 * (th - lw));
  out.arc(0.5 * tw, 0.5 * th, 0.5 * lw, -0.5 * Math.PI, 0.5 * Math.PI);
  out.fill();
}

function pattern2()
{
  out.fillRect(0, 0.5 * (th - lw), 0.5 * tw - radius + 1, lw);
  out.fillRect(0.5 * (tw - lw), 0, lw, 0.5 * th - radius + 1);
  out.beginPath();
  out.moveTo(0.5 * tw - radius, 0.5 * (th - lw));
  var r = Math.max(radius - 0.5 * lw, 0);
  out.arc(0.5 * tw - radius, 0.5 * th - radius, r, 0.5 * Math.PI, 0, true);
  out.lineTo(0.5 * (tw + lw), 0.5 * th - radius);
  var r = Math.max(radius + 0.5 * lw, 0);
  out.arc(0.5 * tw - radius, 0.5 * th - radius, r, 0, 0.5 * Math.PI);
  out.fill();
}

function pattern3()
{
  out.fillRect(0, 0.5 * (th - lw), tw, lw);
}

function pattern4()
{
  if(Math.random() < 0.5) symmetry();
  if(Math.random() < 0.5)pattern4A();
  else pattern4B();
}

function pattern4A()
{
  pattern2();
  pattern3();
}

function pattern4B()
{
  pattern2();
  rotate();
  pattern2();
}

function pattern5()
{
  var n = Math.floor(Math.random() * 4); 
  for(var i = 0; i < n; i++)rotate();
  switch(Math.floor(Math.random() * 4))
  {
    case 0:pattern5A();break;
    case 1:pattern5B();break;
    case 2:pattern5C();break;
    case 3:pattern5D();break;
    default:break;
  }
}

function pattern5A()
{
  pattern2();
  rotate();
  rotate();
  setBorderStyle();
  pattern2();
  setPathStyle();
  pattern2();
}


function pattern5B()
{
  pattern2();
  rotate();
  pattern2();
  rotate();
  pattern2();
  rotate();
  pattern2();
}

function pattern5C()
{
  pattern3();
  rotate();
  setBorderStyle();
  pattern3();
  setPathStyle();
  pattern3();
}

function pattern5D()
{
  pattern3();
  pattern2();
  rotate();
  rotate();
  rotate();
  pattern2();
}

function rotate()
{
  out.translate(tw, 0);
  out.rotate(0.5 * Math.PI);
}
function symmetry()
{
  out.translate(tw, 0);
  out.scale(-1, 1);
}

}
generate();

var mouse = new Mouse(stage.canvas);
mouse.onUp.add(generate, this);