Crafty.init(400, 400);
Crafty.background('rgb(127,127,127)');

var count = 0;
var loc= {
  x: null,
  y: null
}

var player = Crafty.e("Paddle, 2D, DOM, Color, Fourway")
  .color('rgb(255,0,0)')
  .attr({ x: 100, y: 100, w: 100, h: 100 })
  .fourway(4)
  .bind('Move', function(e) {
    loc.x = this._x;
    loc.y = this._y;
  });

var update = setInterval(function() {
  console.log(loc);
}, 100);
