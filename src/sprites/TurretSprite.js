const Phaser = require('phaser-ce/build/custom/phaser-split');
require('phaser-plugin-isometric/dist/phaser-plugin-isometric.js');

module.exports = class TurretSprite extends Phaser.Plugin.Isometric.IsoSprite {
    constructor(game, x, y, mapX, mapY, tile) {
        super(game, x, y, 0, 'BASIC_TURRET');
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
        this.bullets = this.game.add.emitter(this.position.x, this.position.y, 1);
        this.bullets.width = 1;
        this.bullets.makeParticles('BULLET');
        this.bullets.setXSpeed(30, -30);
        this.bullets.setYSpeed(200, 180);
        this.bullets.setAlpha(1, 1, 1);
        this.bullets.setScale(0.8, 0.8, 0.8, 0.8, 2000, Phaser.Easing.Quintic.Out);
        this.bullets.start(false, 1000, 100);
    }

    setOnClick(onClick) {
        this.events.onInputDown.removeAll();
        this.events.onInputDown.add(onClick);
    }
};
