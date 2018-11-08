const TILE_TYPES = require('../constants/TileTypes');
const CONSTRUCTION_TYPES = require('../constants/ConstructionTypes');

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
    }
};
