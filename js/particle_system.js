
var particleSystem = function(cfg) {

  this.initCFG(cfg);
  this.canvas = document.getElementById(this.canvas_id);
  this.ctx = this.canvas.getContext("2d");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.initMessage();
  this.initialize();
  for(var i=0;i<this.area.length;i+=4096) {
var arr = ['#cdcccc', '#343433'];
var rand = Math.random();
rand *= arr.length; //(5)
rand = Math.floor(rand);
var velocityArray = [0.5, 1, 1.5, 2];
var radiusRandSizeArray = [2, 1];
var randRadius = Math.random();
var randVelocity = Math.random();
randVelocity *= velocityArray.length;
randVelocity = Math.floor(randVelocity);
randRadius *= radiusRandSizeArray.length;
randRadius = Math.floor(randRadius);
var radiusHolder = 2;
if(arr[rand] == '#343433') {
	radiusHolder = radiusRandSizeArray[randRadius];
} else {
	radiusHolder = 2;
}
    this.particles.push(new particle({
      x: this.area[i][0],
      y: this.area[i][1],
      vx: Math.floor((Math.random() * velocityArray[randVelocity]) -velocityArray[randVelocity]),
      vy: Math.floor((Math.random() * 2) -1),
      radius: radiusHolder,
      color: arr[rand],
    },this.ctx));
  }




};



particleSystem.prototype.initialize = function() {
				// Register an event listener to
				// call the resizeCanvas() function each time 
				// the window is resized.
				window.addEventListener('resize', this.resizeCanvas, false);
				
				// Draw canvas border for the first time.
				this.resizeCanvas();
};
				
			// Display custom canvas.
			// In this case it's a blue, 5 pixel border that 
			// resizes along with the browser window.					
particleSystem.prototype.redraw = function() {
				this.ctx.strokeStyle = 'blue';
				this.ctx.lineWidth = '5';
				this.ctx.strokeRect(0, 0, this.width, this.height);
};
		
			// Runs each time the DOM window resize event fires.
			// Resets the canvas dimensions to match window,
			// then draws the new borders accordingly.
particleSystem.prototype.resizeCanvas = function() {
				this.canvas.width = this.width;
				this.canvas.height = this.height;
				this.redraw();
};	



particleSystem.prototype.initCFG = function(cfg)
{
  cfg = cfg || {};
  this.fps = cfg.fps || 30;
  this.now;
  this.dist;
  this.then = Date.now();
  this.interval = 1000/this.fps;
  this.delta;
  this.canvas_id = cfg.canvas_id || "canvas";
  this.min_dist = cfg.min_dist || 120;
  this.particles = [];
  this.width = cfg.width || window.innerWidth;
  this.height = cfg.height || window.innerHeight;
};
particleSystem.prototype.initMessage = function()
{
  this.str = "2764";
  this.fontStr = "400pt Helvetica Arial, sans-serif";
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(20,20,this.canvas.width,this.canvas.height);
  this.mask = this.ctx.getImageData(0,0,this.width,this.height);
  this.area = [];
  for (var i = 0; i < this.mask.data.length; i += 8) 
  {
    if (this.mask.data[i] == 255 && this.mask.data[i+1] == 255 && this.mask.data[i+2] == 255 && this.mask.data[i+3] == 255) 
    {
      this.area.push([this.toPosX(i,this.mask.width),this.toPosY(i,this.mask.width)]);
    }
  }
  this.repaint();
};
particleSystem.prototype.update = function()
{
  for(var i=0;i<this.particles.length;i++)
  {
    // reverse direction if moving onto a black pixel
    if(this.isBlackPixelX(this.particles[i]))
    {
      this.particles[i].vx *= -1;
    }
    if(this.isBlackPixelY(this.particles[i]))
    {
      this.particles[i].vy *= -1;
    }
    this.particles[i].x += this.particles[i].vx;
    this.particles[i].y += this.particles[i].vy;
    for(var j=0;j<this.particles.length;j++)
    {
      if(this.areClose(this.particles[i],this.particles[j]))
      {
        this.drawConnectionLine(this.particles[i],this.particles[j]);
      }
    }
  }
};
particleSystem.prototype.drawConnectionLine = function(p1, p2)
{
var arr = ["34,178,76", "52,52,51", "205,204,204"];
var rand = Math.random();
rand *= arr.length;
rand = Math.floor(rand);
var strokeColorP1 = "34,178,76"
var strokeColorP2 = "34,178,76"
if(p1.color == '#fda53d') {
	strokeColorP1 = "253,165,61";
} else if(p1.color == '#cdcccc') {
	strokeColorP1 = "205,204,204";
} else if(p1.color == '#343433') {
	strokeColorP1 = "52,52,51";
}
if(p2.color == '#fda53d') {
	strokeColorP2 = "253,165,61";
	//console.log("we have 0");
} else if(p2.color == '#cdcccc') {
	strokeColorP2 = "205,204,204";
} else if(p2.color == '#343433') {
	strokeColorP2 = "52,52,51";
}
  this.ctx.beginPath();
  var gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
  gradient.addColorStop(0, "rgba("+ strokeColorP1 +","+(1 - (Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2)) / this.min_dist))+")");
  gradient.addColorStop(1, "rgba("+ strokeColorP2 +","+(1 - (Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2)) / this.min_dist))+")");
  this.ctx.strokeStyle = gradient;
  this.ctx.moveTo(p1.x, p1.y);
  this.ctx.lineTo(p2.x, p2.y);
  this.ctx.lineWidth = 1
  this.ctx.stroke();
var sP1 = (p1.radius/1.5) / Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
var sP2 = (p2.radius/1.5) / Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
  this.ctx.closePath();
};
particleSystem.prototype.start = function(e)
{
  requestAnimFrame(delegate(this,this.start));
  this.now = Date.now();
  this.delta = this.now - this.then;
  if (this.delta > this.interval) 
  {
    this.then = this.now - (this.delta % this.interval);
    this.draw();
  }
};
particleSystem.prototype.draw = function() 
{
  this.repaint();
  for (var k = 0, m = this.particles.length; k < m; k++)
  {
    this.particles[k].draw();
  }
  this.update();
};
particleSystem.prototype.isBlackPixelY = function(p)
{
  return this.mask.data[this.posToArea(p.x , p.y + p.vy, this.mask.width)] != 255;
};

particleSystem.prototype.isBlackPixelX = function(p)
{
  return this.mask.data[this.posToArea(p.x + p.vx, p.y, this.mask.width)] != 255;
};

particleSystem.prototype.areClose = function(p1, p2)
{ 
  return Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2))  < this.min_dist;
}

particleSystem.prototype.getDistX = function(p1, p2)
{
  return Math.pow((p1.x - p2.x),2);
};

particleSystem.prototype.getDistY = function(p1, p2)
{
  return Math.pow((p1.y - p2.y),2);
};

particleSystem.prototype.posToArea = function(x,y,w) 
{
  return ((this.mask.width*y)+x)*4;
};

particleSystem.prototype.toPosX = function(i,w) 
{
  return (i % (4 * w)) / 4;
};

particleSystem.prototype.toPosY = function(i, w)
{
  return Math.floor(i / (4 * w));
};

particleSystem.prototype.repaint = function()
{
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0,0,this.width,this.height);
};

window.delegate=function(ctx,func)
{
  return function() { return func.apply(ctx,arguments); };
};
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     ||  
      function( callback ){
      window.setTimeout(callback, 1000 / 60);
      };
})();
