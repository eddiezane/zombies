Crafty.init(500, 500);
Crafty.background('rgb(127, 127, 127)');

var player = Crafty.e("Paddle, 2D, DOM, Color, Multiway")
    .color('rgb(255, 0, 0)')
    .attr({x:20, y:100, w:100, h:100})
    .multiway(4, { RIGHT_ARROW: 0, UP_ARROW: -90, DOWN_ARROW: 90, LEFT_ARROW: 180 });


