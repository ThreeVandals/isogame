const TILE_TYPES = require('../constants/TileTypes');
const CONSTRUCTION_TYPES = require('../constants/ConstructionTypes');

module.exports = class Turret {
    constructor(type = CONSTRUCTION_TYPES.BASIC_TURRET, health = 10, firingRate = 10) {
        this.type       = type;
        this.health     = health;
        this.firingRate = firingRate;
    }
};
