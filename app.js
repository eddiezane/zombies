/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var routes = require('./routes');
var user = require('./routes/user');

var game = {
  players : {},
  bullets : {}
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
  socket.on('join', function() {
    socket.emit('id', socket.id);
    socket.emit('team', socket.id);
  });

  socket.on('location', function(data) {
    game.players[socket.id] = { x: data.x, y: data.y, team : data.team };
  });

  socket.on('disconnect', function () {
    delete game.players[socket.id];
    console.log(socket.id);
  });

  socket.on('hit', function(data) {
    // TODO: Verify hit. Takes in something
  });

});

setInterval(function() {
  io.sockets.emit('update', game);
  console.log(game.players);
}, 10);
