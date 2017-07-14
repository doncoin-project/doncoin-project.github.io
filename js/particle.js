var particle = function(cfg,ctx)
//var choices = ['#22b24c', '#cdcccc', '#343433'];
//var choiceResult = '#22b24c';
//print(choiceResult);
//function choose(choices) {
//  var index = Math.floor(Math.random() * choices.length);
//  //return choices[index];
//  choiceResult = '#22b24c';
//}

//var choiceResult = choose(choices);

{
  this.ctx = ctx;

  this.x = cfg.x || 0;
  this.y = cfg.y || 0;

  this.vx = cfg.vx || 1;
  this.vy  = cfg.vy || 1;

  this.radius = cfg.radius || 8;
  this.color = cfg.color || '#22b24c';
};



particle.prototype.draw = function()
{
  this.ctx.fillStyle = this.color;
  this.ctx.beginPath();
  this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);    
  this.ctx.fill();
};
