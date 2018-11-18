window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
require('phaser-plugin-isometric/dist/phaser-plugin-isometric.js');

const GameManager = require('./managers/GameManager');

const { Phaser } = window;

// Empty HTML body when starting
document.querySelector('body').innerHTML = '';

const game = new Phaser.Game('100', '100', Phaser.AUTO, 'test', null, false, false);

window.gameManager = new GameManager(game, {
    MAP_SIZE: 12,
    TILE_SIZE: 38,
    TILE_DISPLAY_WIDTH: 64,
    TILE_DISPLAY_HEIGHT: 37,
    CAMERA_VELOCITY: 10,
    CENTER: {
        X: 0,
        Y: 0,
    },
});
window.gameManager.start();
