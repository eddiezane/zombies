var range = 300;
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        });
    },

    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x/Game.map_grid.tile.width, y:this.y/Game.map_grid.tile.height};
        } else {
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }
});

Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    },
});

Crafty.c('Tree', {
    init: function() {
        this.requires('Actor, Color, solid')
        .color('rgb(20, 125, 40)');
    },
});

Crafty.c('Bush', {
    init: function() {
        this.requires('Actor, Color, solid')
        .color('rgb(20, 185, 40)');
    }
});

Crafty.c('Player', {
    init: function() {
        this.requires('Actor, Color, Collision')
        .color('rgb(20, 75, 40)')
        .stopOnsolids()
        .bind("explode", this.killed)
        .onHit('Bullet', function(o) {
            var destroy = 0;
            for (var i = 0; i < o.length; i++) {
                console.log(o[i].team +  ' hit ' + this.team + ' ' + this.id);
                if (o[i].team != this.team && o[i].team != undefined) destroy = o[i].id;
                if (o[i].team != this.id && o[i].team != undefined) {
                    o[i].obj.trigger("explode");
                }
            }
            if (destroy != 0) {
                console.log("DESTROY", destroy);
                this.trigger("explode", destroy);
            }
        });
    },

    killed: function(killerId) {
        socket.emit('hit', {victim: this.id, shooter: killerId});
        this.destroy();
    },

    stopOnsolids: function() {
        this.onHit('Solid', this.stopMovement);
        return this;
    },

    stopMovement: function() {
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
    },
});

Crafty.c('You', {
    init: function() {
        this.requires('Player, Fourway')
            .fourway(4)
            .bind('KeyDown', this.shotFired)
            .color('rgb(50, 120, 30)');
    },
    shotFired: function (e) {
        if (e.key == Crafty.keys.RIGHT_ARROW) this._rotation = 0;
        else if (e.key == Crafty.keys.LEFT_ARROW) this._rotation = 180;
        else if (e.key == Crafty.keys.UP_ARROW) this._rotation = -90;
        else if (e.key == Crafty.keys.DOWN_ARROW) this._rotation = 90;
        if (e.key != Crafty.keys.SPACE) return;
        console.log("FIRE");
        Crafty.e('Bullet, Tween').at(this.at().x, this.at().y).attr({team: this.id})
    .tween({x: this.x + Math.cos(this._rotation*Math.PI/180)*range, y: this.y + Math.sin(this._rotation*Math.PI/180)*range}, 100);
    },
});

Crafty.c('Bullet', {
    init: function() {
        this.requires('2D, Canvas, Color, Grid, Collision')
    .attr({w:6, h:6, speed:10})
    .bind("explode", function() {
        this.destroy();
    })
.color("#bf2121");
    }
});
