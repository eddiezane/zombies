Game = {

    map_grid: {
        width: 54,
        height: 36,
        tile: {
            width: 10,
            height: 10
        }
    },

    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    height: function () {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(249, 223, 125)');

        Crafty.scene('Game');
    }
};
