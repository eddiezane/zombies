// Emit new player join
socket.emit('join');

Crafty.init(400, 400);
Crafty.background('rgb(127,127,127)');

var player;
var playerData;
var players = {};

function Player(id, x, y, team) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.team = team;
  this.entity =  Crafty.e("Paddle, 2D, DOM, Color")
    .color('rgb(255,0,0)')
    .attr({ x: x, y: y, w: 100, h: 100 });
}

socket.on('id', function(entityId) {

  player =  Crafty.e("Paddle, 2D, DOM, Color, Fourway")
  .color('rgb(255,0,0)')
  .attr({ x: 100, y: 100, w: 100, h: 100 })
  .fourway(4)
  .bind('Move', function(e) {
    playerData.x = this._x;
    playerData.y = this._y;
  });

playerData = {
  id : entityId,
x : 100,
y : 100,
team : entityId,
};


// This is where we report our location to the server
var update = setInterval(function() {
  socket.emit('location', playerData);
}, 100);

// A team change has occured
socket.on('team', function(new_team) {
  playerData.team = new_team;
});

// Tick from server with game data
socket.on('update', function(data) {
  console.log(data);
  var thePlayers = data.players;
  for (var playerKey in thePlayers) {
    if (playerKey == playerData.id) {
      console.log("SKIPMOTHERFUCKERBITCHASSFUCKKK");
      continue;
    }
    if (players[playerKey] == null) {
      console.log(playerKey);

      players[playerKey] = new Player(playerKey, thePlayers[playerKey].x,
        thePlayers[playerKey].y, thePlayers[playerKey].team);
    } else {
      players[playerKey].x = thePlayers[playerKey].x;
      players[playerKey].y = thePlayers[playerKey].y;
      players[playerKey].entity.x = thePlayers[playerKey].x;
      players[playerKey].entity.y = thePlayers[playerKey].y;
      //UPDATE PLAYER LOCATION
    }
  }
  // This is where we report our location to the server
  var update = setInterval(function() {
    socket.emit('location', playerData);
  }, 100);
  console.log();
});
