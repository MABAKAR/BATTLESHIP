/*jslint browser this */
/*global _, shipFactory, player, utils */

(function(global) {
    "use strict";

    var sheep = { dom: { parentNode: { removeChild: function() {} } } };

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        isHuman: true,
        setGame: function(game) {
            this.game = game;
        },
        init: function() {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function(col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            this.game.fire(this, col, line, _.bind(function(hasSucced) {
                var nosucced = false;
                if (this.tries[line][col] !== 0) {
                    var ci = this.game.phaseOrder.indexOf(this.game.currentPhase);
                    nosucced = true;
                    this.game.currentPhase = this.game.phaseOrder[ci - 1];
                    utils.info("T'as joue deux fois sur la case");
                } else {
                    this.tries[line][col] = hasSucced;
                }

            }, this));


        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function(col, line, callback) {
            var succeed = false;
            if (this.grid[line][col] !== 0) {
                succeed = true;
                let shipId = this.grid[line][col];
                this.grid[line][col] = 0;
                if(this.isHuman){ // on vérifie que le joueur est un humain, car un robot n'a pas de besoin d'une indication visuelle si un bateau a coulé
                    this.isSunk(shipId, col, line); // permet de savoir si le bateau touché a coulé
                }
                
            }

            callback.call(undefined, succeed);

        },
        isSunk: function(shipId, col, line){
            // on commence par analyser la ligne du bateau touché
            for(let x = 0; x < 10; x++){
                if(this.grid[line][x] === shipId){
                    // on retourne false car le bateau n'est pas coulé
                    return false;
                }
            }
            //on analyse la colonne du bateau touché
            for(let y = 0; y < 10; y++){
                if(this.grid[y][col] === shipId){
                    // on retourne false car le bateau n'est pas coulé
                    return false;
                }
            }
            // le bateau a coulé, on ajoute la classe css au bateau coulé
            this.fleet.forEach(element => {
                if (element.id === shipId) {
                    let name = element.name.toLowerCase();
                    document.querySelector('.fleet .' + name).classList.add('sunk');
                }
            });
        },
        setActiveShipPosition: function(x, y, isVerticale, ship = false) {
            if (ship === false) {
                ship = this.fleet[this.activeShip];
            }
            var i = 0;
            //pour calculer la mediane du curseur 
            var ship_median = Math.floor(ship.getLife() / 2) + 1;
            if (isVerticale) {
                ship.getLife() % 2 === 0 ? y = y - ship_median + 2 : y = y - ship_median + 1;
                //algo pour placer en verticale
                var algo_success_y = y >= 0 && y + ship.getLife() - 1 < 10 ? true : false;
            } else {
                x = x - ship_median + 1;
                //algo pour placer en horizontale
                var algo_success_x = x >= 0 && x + ship.getLife() - 1 < 10 ? true : false;
            }
            if (!isVerticale) {
                if (algo_success_x) {
                    while (i < ship.getLife()) {
                        if (this.grid[y][x + i] !== 0) {
                            return false;
                        }
                        i += 1;
                    }
                    i = 0;

                    while (i < ship.getLife()) {
                        this.grid[y][x + i] = ship.getId();
                        i += 1;
                    }

                    return true;
                }
            } else if (algo_success_y) {
                while (i < ship.getLife()) {
                    if (this.grid[y + i][x] !== 0) {
                        return false;
                    }
                    i += 1;
                }
                i = 0;

                while (i < ship.getLife()) {
                    this.grid[y + i][x] = ship.getId();
                    i += 1;
                }

                return true;
            }
            return false;
        },
        clearPreview: function() {
            this.fleet.forEach(function(ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        resetShipPlacement: function() {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function() {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function(grid) {
            this.tries.forEach(function(row, rid) {
                row.forEach(function(val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');

                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                    }
                });
            });
        },
        renderHit: function(grid) {
            this.tries.forEach(function(row, rid) {
                row.forEach(function(val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');

                    if (val === true) {
                        node.style.backgroundColor = 'red';
                    }
                });
            });
        },
        renderShips: function(grid) {}
    };

    global.player = player;

}(this));