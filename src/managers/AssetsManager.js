const ASSET_PATHS = {};

ASSET_PATHS.TILE = require('../assets/testTile.png');
ASSET_PATHS.GRASS_1 = require('../assets/ground_tile_grass1.png');
ASSET_PATHS.GRASS_2 = require('../assets/ground_tile_grass2.png');
ASSET_PATHS.GRASS_3 = require('../assets/ground_tile_grass3.png');
ASSET_PATHS.BASIC_TURRET = require('../assets/blue_ball.png');
ASSET_PATHS.BULLET = require('../assets/red_ball.png');

class AssetsManager {
    constructor(game) {
        this.game = game;
    }

    preloadAssets() {
        Object.keys(ASSET_PATHS).forEach((assetName) => {
            this.game.load.image(assetName, ASSET_PATHS[assetName]);
        });
    }
}

module.exports = AssetsManager;
