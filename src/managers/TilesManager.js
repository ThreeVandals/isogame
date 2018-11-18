const TileSprite = require('../sprites/TileSprite');
const CONSTRUCTION_TYPES = require('../constants/ConstructionTypes');

class TilesManager {
    constructor(game, gameModel, config) {
        this.game = game;
        this.gameModel = gameModel;
        this.config = config;
        this.tilesMap = [];
        this.tilesGroup = this.game.add.group();
    }

    spawnTiles() {
        this.mapTiles = [];
        for (let x = 0; x < this.gameModel.map.length; x += 1) {
            this.mapTiles[x] = [];
            for (let y = 0; y < this.gameModel.map.length; y += 1) {
                const tileSprite = new TileSprite(
                    this.game,
                    this.config.CENTER.x + (x - this.gameModel.mapSize / 2) * this.config.TILE_SIZE,
                    this.config.CENTER.y + (y - this.gameModel.mapSize / 2) * this.config.TILE_SIZE,
                    x,
                    y,
                    this.gameModel.map[x][y],
                );
                tileSprite.setOnClick(this.onTileClick.bind(this, x, y));
                this.game.add.existing(tileSprite);
                this.tilesGroup.add(tileSprite);
                this.mapTiles[x][y] = tileSprite;
            }
        }
    }

    onTileClick(x, y) {
        if (this.gameModel.map[x][y].constructionType === CONSTRUCTION_TYPES.NONE) {
            this.gameModel.map[x][y].setConstructionType(CONSTRUCTION_TYPES.BASIC_TURRET);
        } else {
            this.gameModel.map[x][y].setConstructionType(CONSTRUCTION_TYPES.NONE);
        }
        this.mapTiles[x][y].setTile(this.gameModel.map[x][y]);
    }

    update(cursorPos) {
        // Loop through all tiles and test to see if the 3D position from above
        // intersects with the automatically generated IsoSprite tile bounds.
        for (let x = 0; x < this.mapTiles.length; x += 1) {
            for (let y = 0; y < this.mapTiles.length; y += 1) {
                const currentTile = this.mapTiles[x][y];
                const inBounds = currentTile.isoBounds.containsXY(
                    cursorPos.x,
                    cursorPos.y,
                );
                if (!currentTile.isSelected && inBounds) {
                    currentTile.setSelected(true);
                } else if (currentTile.isSelected && !inBounds) {
                    currentTile.setSelected(false);
                }
                currentTile.updateContent(this.game);
            }
        }
    }
}

module.exports = TilesManager;
