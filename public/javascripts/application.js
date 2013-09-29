Crafty.init(400, 400);
Crafty.background('rgb(127,127,127)');

var loc = {
  x: null,
  y: null,
  team: null
}

// Emit new player join
socket.emit('join');

var player = Crafty.e("Paddle, 2D, DOM, Color, Fourway")
  .color('rgb(255,0,0)')
  .attr({ x: 100, y: 100, w: 100, h: 100 })
  .fourway(4)
  .bind('Move', function(e) {
    loc.x = this._x;
    loc.y = this._y;
  });

// This is where we report our location to the server
var update = setInterval(function() {
  socket.emit('location', loc);
}, 100);

// A team change has occured
socket.on('team', function(new_team) {
  loc.team = new_team;
});

// Tick from server with game data
socket.on('update', function(game) {
  console.log(game);
});
