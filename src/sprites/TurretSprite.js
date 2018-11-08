const Phaser = require('phaser-ce/build/custom/phaser-split');
require('phaser-plugin-isometric/dist/phaser-plugin-isometric.js');

const TILE_TYPES = require('../constants/TileTypes');
const CONSTRUCTION_TYPES = require('../constants/ConstructionTypes');

module.exports = class TurretSprite extends Phaser.Plugin.Isometric.IsoSprite {
    constructor(game, x, y, mapX, mapY, tile) {
        super(game, x, y, 0, 'basic_turret');
        this.mapX = mapX;
        this.mapY = mapY;
        this.tile = tile;
        this.isDirty = true;
        this.smoothed = true;
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.anchor.set(0.5, 0.2);
    }

    updateContent() {
        //debugger;
        this.bullets = this.game.add.emitter(this.position.x, this.position.y, 1);
        this.bullets.width = 1;
        this.bullets.makeParticles('bullet');
        this.bullets.setXSpeed(30, -30);
        this.bullets.setYSpeed(200, 180);
        //this.bullets.setRotation(50,-50);
        this.bullets.setAlpha(1, 1, 1);
        this.bullets.setScale(0.8, 0.8, 0.8, 0.8, 2000, Phaser.Easing.Quintic.Out);
        this.bullets.start(false, 1000, 100);
    }

    // setTile(tile) {
    //     this.tile = tile;
    //     this.isDirty = true;
    // }

    setOnClick(onClick) {
        this.events.onInputDown.removeAll();
        this.events.onInputDown.add(onClick);
    }
};
