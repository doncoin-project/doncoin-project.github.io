
var particleSystem = function(cfg)
//var strokeColorPlaceholder = '#343433';

{
  this.initCFG(cfg);

  this.canvas = document.getElementById(this.canvas_id);
  this.ctx = this.canvas.getContext("2d");

  this.canvas.width = this.width;
  this.canvas.height = this.height;

  this.initMessage();



  // create the particles, add base 2 number, higher = less particles
  for(var i=0;i<this.area.length;i+=4096)
  {
//     RANDOM COLOR
var arr = ['#22b24c', '#cdcccc', '#343433'];
var rand = Math.random();
rand *= arr.length; //(5)
rand = Math.floor(rand);
//console.log("test" + arr[rand]);

var radiusRandSizeArray = [40, 35, 30, 25];
var randRadius= Math.random();
randRadius *= radiusRandSizeArray.length;
randRadius = Math.floor(randRadius);

var radiusHolder = 25;
if(arr[rand] == '#343433') {
	radiusHolder = radiusRandSizeArray[randRadius];
} else {
	radiusHolder = 25;
}

  
    this.particles.push(new particle({
      x: this.area[i][0],
      y: this.area[i][1],
      vx: Math.floor((Math.random() * 2) -1),
      vy: Math.floor((Math.random() * 2) -1),
      radius: radiusHolder,
      color: arr[rand],
    },this.ctx));
  }
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
  // this is the unicode hex of a heart
  this.str = "2764";
  this.fontStr = "400pt Helvetica Arial, sans-serif";

  this.ctx.beginPath();
  this.ctx.font = this.fontStr;
  this.ctx.textAlign = "center";
  this.ctx.fillStyle = "#ffffff";
  //this.ctx.fillText(String.fromCharCode(parseInt(this.str, 16)),this.width/2 ,this.height - 50);
  this.ctx.fillRect(20,20,this.canvas.width,this.canvas.height);
  this.ctx.closePath();

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

    //RANDOM COLOR
var arr = ["34,178,76", "52,52,51", "205,204,204"];
var rand = Math.random();
rand *= arr.length;
rand = Math.floor(rand);
//console.log("test" + arr[rand]);

var strokeColorP1 = "34,178,76"
var strokeColorP2 = "34,178,76"

// if(arr[rand] = "34,178,76")
// {
// }

// if(rand == 0) {
// 	strokeColor = "34,178,76";
// 	//console.log("we have 0");
// } else if(rand == 1) {
// 	strokeColor = "52,52,51";
// 	//console.log("we have 222222222222");
// } else if(rand == 2) {
// 	strokeColor = "205,204,204";
// 	//console.log("we have 33333333333");
// }



if(p1.color == '#22b24c') {
	strokeColorP1 = "34,178,76";
	//console.log("we have 0");
} else if(p1.color == '#cdcccc') {
	strokeColorP1 = "205,204,204";
	//console.log("we have 222222222222");
} else if(p1.color == '#343433') {
	strokeColorP1 = "52,52,51";
	//console.log("we have 33333333333");
}

if(p2.color == '#22b24c') {
	strokeColorP2 = "34,178,76";
	//console.log("we have 0");
} else if(p2.color == '#cdcccc') {
	strokeColorP2 = "205,204,204";
	//console.log("we have 222222222222");
} else if(p2.color == '#343433') {
	strokeColorP2 = "52,52,51";
	//console.log("we have 33333333333");
}


// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');
// 
// var gradient = ctx.createLinearGradient(0, 0, 200, 0);
// gradient.addColorStop(0, 'green');
// gradient.addColorStop(1, 'white');
// ctx.fillStyle = gradient;
// ctx.fillRect(10, 10, 200, 100);

  // Draw the line between particles, opacity based on distance
  
  this.ctx.beginPath();
  //this.ctx.strokeStyle = "rgba("+ strokeColor +","+(1 - (Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2)) / this.min_dist))+")";
  //this.ctx.strokeStyle = "rgba("+ strokeColor +","+(1 - (Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2)) / this.min_dist))+")";
  
  
  //**working
  var gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
  gradient.addColorStop(0, "rgba("+ strokeColorP1 +","+(1 - (Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2)) / this.min_dist))+")");
  gradient.addColorStop(1, "rgba("+ strokeColorP2 +","+(1 - (Math.sqrt(this.getDistX(p1,p2) + this.getDistY(p1,p2)) / this.min_dist))+")");
  //gradient.addColorStop(1, p2.color);
//   this.ctx.strokeStyle = gradient;
//   this.ctx.moveTo(p1.x, p1.y);
//   this.ctx.lineTo(p2.x, p2.y);
//   this.ctx.lineWidth = 2
//   this.ctx.stroke();
//   this.ctx.closePath();
  //**end Working

//copy
//   this.ctx.beginPath();
//   this.ctx.strokeStyle = "#FF0000";
//   this.ctx.moveTo(p1.x, p1.y);
//   this.ctx.lineTo((p1.x + ((p2.y-p1.y))), (p1.y - ((p2.x-p1.x))));
//   this.ctx.lineWidth = 2
//   this.ctx.stroke();
//   this.ctx.closePath();

// Draw perpendicular lines
//s = scale
// var s = 1 / Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
// x-s*(y1-y), y+s*(x1-x)

var sP1 = (p1.radius/1.5) / Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
var sP2 = (p2.radius/1.5) / Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));

//p1 perpendicular to the perpendicular
  this.ctx.beginPath();
  this.ctx.strokeStyle = "blue";
//    				//this.ctx.moveTo(p1.x, p1.y);
// 				//   this.ctx.lineTo((p1.x + ((p2.y-p1.y))), (p1.y - ((p2.x-p1.x))));
  //this.ctx.moveTo(p1.x-sP1*(p2.y-p1.y), p1.y+sP1*(p2.x-p1.x));
  //this.ctx.lineTo(p1.x-sP1*(p2.y-p1.y) + (p1.y - (p1.y+sP1*(p2.x-p1.x))), p1.y+sP1*(p2.x-p1.x) - (p1.x - p1.x-sP1*(p2.y-p1.y)));
  //stack overflow: (x,y)->(x+(y1-y),y-(x1-x)) and (x-(y1-y),y+(x1-x))
  this.ctx.moveTo(p1.x, p1.y);
  this.ctx.lineTo(p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y),p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x));
  this.ctx.lineWidth = 7;
  this.ctx.stroke();
  this.ctx.closePath();
  
//   			p1 perpendicular to the perpendicular to the perpendicular
    this.ctx.beginPath();
  this.ctx.strokeStyle = "yellow";
  this.ctx.moveTo((p1.x+sP1*(p2.y-p1.y))+(p1.y-(p1.y-sP1*(p2.x-p1.x))),(p1.y-sP1*(p2.x-p1.x))-(p1.x-(p1.x+sP1*(p2.y-p1.y))));
  //this.ctx.lineTo(10,10);
  this.ctx.lineTo(p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y),p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x));
  //this.ctx.lineTo(p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y))-(p1.y-(p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x))),(p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x))+(((p1.x+sP1*(p2.y-p1.y))+(p1.y-(p1.y-sP1*(p2.x-p1.x))))-(p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y))));
//   			this.ctx.lineTo((p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y)) + (p1.y - p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x)), p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x) - (p1.x - (p1.y-sP1*(p2.x-p1.x))-p1.y));
//   			(x,y)->(x+(y1-y),y-(x1-x))
//   this.ctx.moveTo(p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y),p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x));
//   			this.ctx.lineTo(p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y)+(p1.y-p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x)), p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x)-(p1.x-(p1.y-sP1*(p2.x-p1.x))-p1.y)));
//   this.ctx.lineTo(x+(y1-y),y-(x1-x));
//   			this.ctx.lineTo(100, p1.y);

  //this.ctx.lineTo((p1.x+sP1*(p2.y-p1.y))-(p1.y-(p1.y-sP1*(p2.x-p1.x))),(p1.y-sP1*(p2.x-p1.x))+(p1.x-(p1.x+sP1*(p2.y-p1.y))));
  this.ctx.lineWidth = 1;
  this.ctx.stroke();
  this.ctx.closePath();
  
  //p2 perpendicular to the perpendicular to the perpendicular
  this.ctx.beginPath();
  this.ctx.strokeStyle = "orange";
  this.ctx.lineWidth = 3;
  this.ctx.moveTo(p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y),p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x));
  this.ctx.lineTo((p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y))+(p1.y-p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x)),(p1.y+(p1.x+sP1*(p2.y-p1.y)-p1.x))-(p1.x-p1.x-((p1.y-sP1*(p2.x-p1.x))-p1.y)));
    this.ctx.stroke();
  this.ctx.closePath();
  
				//P1 perpendiculars
  this.ctx.beginPath();
  this.ctx.strokeStyle = "#FF0000";
//    				//this.ctx.moveTo(p1.x, p1.y);
// 				//   this.ctx.lineTo((p1.x + ((p2.y-p1.y))), (p1.y - ((p2.x-p1.x))));
  this.ctx.moveTo(p1.x+sP1*(p2.y-p1.y), p1.y-sP1*(p2.x-p1.x));
  this.ctx.lineTo(p1.x, p1.y);
//   				//this.ctx.lineTo((p1.x - ((((Math.sqrt(p2.y)*p2.y))-((Math.sqrt(p1.y)*p1.y))))), ((Math.sqrt(p1.y)*p1.y)) + ((((Math.sqrt(p2.x)*p2.x))-((Math.sqrt(p1.x)*p1.x)))));
//   				//fishing line
//   				//working: this.ctx.lineTo((p1.x - ((p2.y)-(p1.y))), ((p1.y) + ((p2.x)-(p1.x))));
  //this.ctx.lineTo((p1.x+sP1*(p2.y-p1.y))+(p1.y-(p1.y-sP1*(p2.x-p1.x))),(p1.y-sP1*(p2.x-p1.x))-(p1.x-(p1.x+sP1*(p2.y-p1.y))));
  //this.ctx.lineTo(p1.x+sP1*(p2.y-p1.y)+(p1.y-p1.y-sP1*(p2.x-p1.x)),p1.y-sP1*(p2.x-p1.x)-(p1.x-p1.x+sP1*(p2.y-p1.y)));
  this.ctx.lineWidth = 1;
  this.ctx.stroke();
  this.ctx.closePath();
  
  				//P2 perpendiculars
  this.ctx.beginPath();
  this.ctx.strokeStyle = "green";
//    				//this.ctx.moveTo(p1.x, p1.y);
// 				//   this.ctx.lineTo((p1.x + ((p2.y-p1.y))), (p1.y - ((p2.x-p1.x))));
  this.ctx.moveTo(p2.x+sP2*(p1.y-p2.y), p2.y-sP2*(p1.x-p2.x));
  this.ctx.lineTo(p2.x, p2.y);
//   				//this.ctx.lineTo((p1.x - ((((Math.sqrt(p2.y)*p2.y))-((Math.sqrt(p1.y)*p1.y))))), ((Math.sqrt(p1.y)*p1.y)) + ((((Math.sqrt(p2.x)*p2.x))-((Math.sqrt(p1.x)*p1.x)))));
//   				//fishing line
//   				//working: this.ctx.lineTo((p1.x - ((p2.y)-(p1.y))), ((p1.y) + ((p2.x)-(p1.x))));
  this.ctx.lineTo(p2.x-sP2*(p1.y-p2.y), p2.y+sP2*(p1.x-p2.x));
  this.ctx.lineWidth = 1;
  this.ctx.stroke();
  this.ctx.closePath();
  
  				// bezierCurveTo
  this.ctx.beginPath();
  this.ctx.strokeStyle = gradient;
  this.ctx.fillStyle = gradient;
  this.ctx.moveTo(p1.x+sP1*(p2.y-p1.y), p1.y-sP1*(p2.x-p1.x));
  this.ctx.lineTo(p1.x, p1.y);
  this.ctx.lineTo(p1.x-sP1*(p2.y-p1.y), p1.y+sP1*(p2.x-p1.x));
  this.ctx.bezierCurveTo(p1.x, p1.y,p2.x, p2.y,p2.x+sP2*(p1.y-p2.y), p2.y-sP2*(p1.x-p2.x));
  this.ctx.lineTo(p2.x, p2.y);
  this.ctx.lineTo(p2.x-sP2*(p1.y-p2.y), p2.y+sP2*(p1.x-p2.x));
  this.ctx.bezierCurveTo(p2.x, p2.y,p1.x, p1.y,p1.x+sP1*(p2.y-p1.y), p1.y-sP1*(p2.x-p1.x));
  this.ctx.lineWidth = 5;
  //this.ctx.stroke();
  				this.ctx.fill();
  this.ctx.closePath();
};






particleSystem.prototype.start = function(e)
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

particleSystem.prototype.draw = function() 
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
