const TILE_TYPES = require('../constants/TileTypes');
const CONSTRUCTION_TYPES = require('../constants/ConstructionTypes');

const Turret = require('./Turret');
module.exports = class Tile {
    constructor(grassType = TILE_TYPES.DUST, consturctionType = CONSTRUCTION_TYPES.NONE) {
        this.grassType = grassType;
        this.constructionType = consturctionType;
    }

    setGrassType(grassType) {
        this.grassType = grassType;
    }

    setConstructionType(constructionType) {
        this.constructionType = constructionType;
        this.grassType = TILE_TYPES.DUST;

        if (this.constructionType !== CONSTRUCTION_TYPES.NONE){
            this.construction = new Turret(CONSTRUCTION_TYPES.BASIC_TURRET, 10, 1);
        }
    }
};
