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

Crafty.c('Projectile', {
    init: function() {
        this.options = {
            maxParticles: 1,
            size: 18,
            sizeRandom: 0,
            speed: 3,
            speedRandom: 0,
            // Lifespan in frames
            lifeSpan: 29,
            lifeSpanRandom: 0,
            // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
            angle: 90,
            angleRandom: 0,
            startColour: [255, 131, 0, 1],
            startColourRandom: [0, 0, 0, 0],
            endColour: [245, 35, 0, 0],
            endColourRandom: [0, 0, 0, 0],
            // Only applies when fastMode is off, specifies how sharp the gradients are drawn
            sharpness: 20,
            sharpnessRandom: 0,
            // Random spread from origin
            spread: 0,
            // How many frames should this last
            duration: 30,
            // Will draw squares instead of circle gradients
            fastMode: false,
            gravity: { x: 0, y: 0.0 },
            // sensible values are 0-3
            jitter: 0
        };
        this.requires('Actor, Particles').particles(options);
    }
});

Crafty.c('Player', {
    init: function() {
        this.requires('Actor, Color, Collision')
        .color('rgb(20, 75, 40)')
        .stopOnsolids()
        .bind('KeyDown', this.shotFired);
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

    shotFired: function (e) {
        if (e.key != Crafty.keys.SPACE) return;

        var options = {
            maxParticles: 1,
            size: 18,
            sizeRandom: 0,
            speed: 3,
            speedRandom: 0,
            // Lifespan in frames
            lifeSpan: 29,
            lifeSpanRandom: 0,
            // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
            angle: this._rotation,
            angleRandom: 0,
            startColour: [255, 131, 0, 1],
            startColourRandom: [0, 0, 0, 0],
            endColour: [245, 35, 0, 0],
            endColourRandom: [0, 0, 0, 0],
            // Only applies when fastMode is off, specifies how sharp the gradients are drawn
            sharpness: 20,
            sharpnessRandom: 0,
            // Random spread from origin
            spread: 0,
            // How many frames should this last
            duration: 30,
            // Will draw squares instead of circle gradients
            fastMode: false,
            gravity: { x: 0, y: 0.0 },
            // sensible values are 0-3
            jitter: 0
        };
        Crafty.e("2D,Canvas,Particles, Grid").particles(options).at(this.at().x, this.at().y);
    },

});

Crafty.c('You', {
    init: function() {
        this.requires('Player, Fourway')
            .fourway(4);
    },
});


Crafty.c('Village', {
    init: function() {
        this.requires('Actor, Color')
            .color('rgb(170, 125, 40)');
    },

    collect: function() {
        this.destroy();
        Crafty.trigger('VillageVisited', this);
    }
});
