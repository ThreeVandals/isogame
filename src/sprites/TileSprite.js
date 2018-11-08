const Phaser = require('phaser-ce/build/custom/phaser-split');
require('phaser-plugin-isometric/dist/phaser-plugin-isometric.js');

const TILE_TYPES = require('../constants/TileTypes');
const CONSTRUCTION_TYPES = require('../constants/ConstructionTypes');

module.exports = class TileSprite extends Phaser.Plugin.Isometric.IsoSprite {
    constructor(game, x, y, mapX, mapY, tile) {
        super(game, x, y, 0, 'tile');
        this.mapX = mapX;
        this.mapY = mapY;
        this.tile = tile;
        this.isDirty = true;
        this.smoothed = true;
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.anchor.set(0.5, 0.2);
        this.grassSprite = null;
        this.constructionSprite = null;
        this.selected = false;
        this.refreshGrassSprite();
        this.refreshConstructionSprite();
    }

    setTile(tile) {
        this.tile = tile;
        this.isDirty = true;
    }

    setSelected(isSelected) {
        this.isSelected = isSelected;
        this.isDirty = true;
    }

    updateContent() {
        if (!this.isDirty) return;
        this.refreshConstructionSprite();
        this.refreshGrassSprite();
        if (this.isSelected) {
            this.tint = 0x999999;
            this.game.add.tween(this).to({ isoZ: 4 }, 150, Phaser.Easing.Quadratic.InOut, true);
            if (this.grassSprite) {
                this.game.add.tween(this.grassSprite).to({ isoZ: 4 }, 150, Phaser.Easing.Quadratic.InOut, true);
            }
            if (this.constructionSprite) {
                this.game.add.tween(this.constructionSprite).to({ isoZ: 4 }, 150, Phaser.Easing.Quadratic.InOut, true);
            }
        } else {
            this.tint = 0xffffff;
            this.game.add.tween(this).to({ isoZ: 0 }, 150, Phaser.Easing.Quadratic.InOut, true);
            if (this.grassSprite) {
                this.game.add.tween(this.grassSprite).to({ isoZ: 0 }, 150, Phaser.Easing.Quadratic.InOut, true);
            }
            if (this.constructionSprite) {
                this.game.add.tween(this.constructionSprite).to({ isoZ: 0 }, 150, Phaser.Easing.Quadratic.InOut, true);
            }
        }
        this.isDirty = false;
    }

    refreshGrassSprite() {
        if (this.grassSprite) {
            this.grassSprite.destroy();
            this.grassSprite = null;
        }
        if ([
            TILE_TYPES.GRASS_1,
            TILE_TYPES.GRASS_2,
            TILE_TYPES.GRASS_3,
        ].indexOf(this.tile.grassType) > -1) {
            this.grassSprite = this.game.add.isoSprite(
                this.isoX,
                this.isoY,
                0,
                `grass_${this.tile.grassType}`,
                0,
            );
            this.grassSprite.smoothed = true;
            this.grassSprite.anchor.set(0.5, 0.2);
        }
    }

    refreshConstructionSprite() {
        if (this.constructionSprite) {
            this.constructionSprite.destroy();
            this.constructionSprite = null;
        }
        if ([
            CONSTRUCTION_TYPES.BASIC_TURRET,
        ].indexOf(this.tile.constructionType) > -1) {
            this.constructionSprite = this.game.add.isoSprite(
                this.isoX,
                this.isoY,
                0,
                'basic_turret',
                0,
            );
            this.constructionSprite.smoothed = true;
            this.constructionSprite.anchor.set(0.5, 0.2);
        }
    }

    setOnClick(onClick) {
        this.events.onInputDown.removeAll();
        this.events.onInputDown.add(onClick);
    }
};
