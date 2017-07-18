
var particleSystem2 = function(cfg) {
  
  this.initCFG(cfg);
  this.canvas = document.getElementById(this.canvas_id);
  this.ctx = this.canvas.getContext("2d");
  this.canvas.width = this.width;
  this.canvas.height = 500;
  this.initMessage();

  


particleSystem2.prototype.initCFG = function(cfg)
{
  cfg = cfg || {};

  this.fps = cfg.fps || 30;
  this.now;
  this.dist;
  this.then = Date.now();
  this.interval = 1000/this.fps;
  this.delta;
  this.canvas_id = cfg.canvas_id || "canvas2";
  this.min_dist = cfg.min_dist || 120;
  this.particles = [];
  this.width = cfg.width || window.innerWidth;
  this.height = cfg.height || window.innerHeight;
};

particleSystem2.prototype.initMessage = function()
{
  // this is the unicode hex of a heart
  this.str = "2764";
  this.fontStr = "400pt Helvetica Arial, sans-serif";

  //this.ctx.beginPath();
  //this.ctx.font = this.fontStr;
  //this.ctx.textAlign = "center";
  this.ctx.fillStyle = "#ffffff";
  //this.ctx.fillText(String.fromCharCode(parseInt(this.str, 16)),this.width/2 ,this.height - 50);
  this.ctx.fillRect(20,20,this.canvas.width,this.canvas.height);
  //this.ctx.closePath();

// var c=document.getElementById("container");
//     var ctx=c.getContext("2d");
//     var img=document.getElementById("scream");
//     ctx.drawImage(img,10,10);

  this.mask = this.ctx.getImageData(0,0,this.width,this.height);
  this.area = [];

  // save all white pixels, these will be used as the bounds for the particles
  for (var i = 0; i < this.mask.data.length; i += 8) 
  {
    if (this.mask.data[i] == 255 && this.mask.data[i+1] == 255 && this.mask.data[i+2] == 255 && this.mask.data[i+3] == 255) 
    {
      this.area.push([this.toPosX(i,this.mask.width),this.toPosY(i,this.mask.width)]);
    }
  }

  this.repaint();
};

particleSystem2.prototype.update = function()
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



particleSystem2.prototype.start = function(e)
{
  requestAnimFrame(delegate(this,this.start));

  this.now = Date.now();
  this.delta = this.now - this.then;
   
  // control the fps
  if (this.delta > this.interval) 
  {
    this.then = this.now - (this.delta % this.interval);
    this.draw();
  }
};

particleSystem2.prototype.draw = function() 
{
  // clear screen, remove for cool effect ;)
  this.repaint();

  for (var k = 0, m = this.particles.length; k < m; k++)
  {
    this.particles[k].draw();
  }

  this.update();
};

//
// Helper Methods
//

particleSystem2.prototype.isBlackPixelY = function(p)
{
  return this.mask.data[this.posToArea(p.x , p.y + p.vy, this.mask.width)] != 255;
};

particleSystem2.prototype.isBlackPixelX = function(p)
{
  return this.mask.data[this.posToArea(p.x + p.vx, p.y, this.mask.width)] != 255;
};

particleSystem2.prototype.areClose = function(p1, p2)
{ 
  return Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2))  < this.min_dist;
}

particleSystem2.prototype.getDistX = function(p1, p2)
{
  return Math.pow((p1.x - p2.x),2);
};

particleSystem2.prototype.getDistY = function(p1, p2)
{
  return Math.pow((p1.y - p2.y),2);
};

particleSystem2.prototype.posToArea = function(x,y,w) 
{
  return ((this.mask.width*y)+x)*4;
};

particleSystem2.prototype.toPosX = function(i,w) 
{
  return (i % (4 * w)) / 4;
};

particleSystem2.prototype.toPosY = function(i, w)
{
  return Math.floor(i / (4 * w));
};

particleSystem2.prototype.repaint = function()
{
  // clear the screen
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
