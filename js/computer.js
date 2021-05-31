/*jslint browser this */
/*global _, player */

(function(global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        isHuman: false,
        play: function() {
            var self = this;
            let y = Math.floor(Math.random() * 10);
            let x = Math.floor(Math.random() * 10);
            setTimeout(function() {
                while(self.tries[y][x] !== 0) {
                    y = Math.floor(Math.random() * 10);
                    x = Math.floor(Math.random() * 10); 
                }
                self.game.fire(this, x, y, function(hasSucced) {
                    self.tries[y][x] = hasSucced;
                });
            }, 2000);
        },

        areShipsOk: function(callback) {
            var j;

            this.fleet.forEach(function(ship, i) {

                var is_verticale = Math.round(Math.random()) === 1 ? true : false;
                let x;
                let y;
                var ship_median = Math.floor(ship.getLife() / 2) + 1;
                if (is_verticale) {
                    y = Math.floor(Math.random() * (10 - ship.getLife())) + ship_median;
                    ship.getLife() % 2 === 0 ? y = y - 2 : y--;
                    x = Math.floor(Math.random() * 10);
                } else {
                    x = Math.floor(Math.random() * (10 - ship.getLife())) + ship_median - 1;
                    y = Math.floor(Math.random() * 10);
                }

                while (!this.setActiveShipPosition(x, y, is_verticale, ship)) {
                    is_verticale = Math.round(Math.random()) === 1 ? true : false;
                    if (is_verticale) {
                        y = Math.floor(Math.random() * (10 - ship.getLife())) + ship_median;
                        ship.getLife() % 2 === 0 ? y = y - 2 : y--;
                        x = Math.floor(Math.random() * 10);
                    } else {
                        x = Math.floor(Math.random() * (10 - ship.getLife())) + ship_median - 1;
                        y = Math.floor(Math.random() * 10);
                    }
                }

            }, this);
            setTimeout(function() {
                callback();
            }, 500);
        }
    });

    global.computer = computer;

}(this));