Crafty.scene('Game', function() {
    socket.emit('join');
    var players = {};
    var player = null;
    var playerData;
    function Player(id, x, y, team) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.team = team;
        this.entity =  Crafty.e("Player").at(x, y);
    }

    socket.on('id', function(entityId) {
        player = Crafty.e('You').at(5, 5)
        .bind('Move', function(e) {
            playerData.x = this._x;
            playerData.y = this._y;
        });

        playerData = {
            id : entityId,
            x : player.at().x,
            y : player.at().y,
            team : entityId,
        };
    });
    // A team change has occured
    socket.on('team', function(new_team) {
        playerData.team = new_team;
    });
    socket.on('update', function(data) {
        console.log(data);
        var thePlayers = data.players;
        for (var playerKey in thePlayers) {
            if (playerKey == player) {
                console.log("SKIPMOTHERFUCKERBITCHASSFUCKKK");
                continue;
            }
            if (players[playerKey] == undefined) {
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
            console.log(playerData);
            socket.emit('location', playerData);
        }, 100);
        console.log();
    });
});

Crafty.scene('Victory', function() {
    Crafty.e('2D, DOM, Text')
    .attr({ x: Game.width/2, y: Game.width/2 })
    .text('End of Game!');

    this.restart_game = this.bind('KeyDown', function() {
        Crafty.scene('Game');
    });
    }, function() {
        this.unbind('KeyDown', this.restart_game);
});
