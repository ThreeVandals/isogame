const Random = require('../helpers/Random');

const Tile = require('./Tile');

const TILE_TYPES = require('../constants/TileTypes');

module.exports = class Game {
    constructor(mapSize, seed = 0) {
        this.mapSize = mapSize;
        this.random = new Random(seed);
        this.map = [];
    }

    generateMap() {
        for (let x = 0; x < this.mapSize; x += 1) {
            this.map[x] = [];
            for (let y = 0; y < this.mapSize; y += 1) {
                const randomNumber = this.random.nextInt(0, 20);
                this.map[x][y] = new Tile();
                if (randomNumber <= 0) {
                    this.map[x][y].setGrassType(TILE_TYPES.GRASS_1);
                } else if (randomNumber <= 1) {
                    this.map[x][y].setGrassType(TILE_TYPES.GRASS_2);
                } else if (randomNumber <= 2) {
                    this.map[x][y].setGrassType(TILE_TYPES.GRASS_3);
                }
            }
        }
    }
};
