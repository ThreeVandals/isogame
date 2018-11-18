window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
require('phaser-plugin-isometric/dist/phaser-plugin-isometric.js');

const GameModel = require('../models/GameModel');

/* Assets */
const AssetsManager = require('./AssetsManager');
const TilesManager = require('./TilesManager');

const { Phaser } = window;

const GameManager = class {
    constructor(game, config) {
        this.game = game;
        this.config = config;
    }

    preload() {
        const urlParams = new URLSearchParams(window.location.search);
        const seedFromUrl = urlParams.get('seed');
        this.seed = Number.parseInt(seedFromUrl, 10) || Math.floor(Math.random() * 1000000);
        this.gameModel = new GameModel(this.config.MAP_SIZE, this.seed);
        this.gameModel.generateMap();
        this.tileManager = new TilesManager(this.game, this.gameModel, this.config);
        this.assetsManager = new AssetsManager(this.game);
        this.assetsManager.preloadAssets();

        // Enable plugins
        this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

        this.game.time.advancedTiming = true;
        this.game.stage.backgroundColor = 0x000000;
        this.game.renderer.renderSession.roundPixels = true;

        this.game.iso.anchor.setTo(0.5, 0.2);
    }

    create() {
        const canvas = document.querySelector('canvas');

        this.game.world.setBounds(
            0,
            0,
            Math.max(
                (this.config.MAP_SIZE + 6) * this.config.TILE_DISPLAY_WIDTH,
                Number.parseInt(canvas.style.width, 10),
            ),
            Math.max(
                (this.config.MAP_SIZE + 4) * this.config.TILE_DISPLAY_HEIGHT,
                Number.parseInt(canvas.style.height, 10),
            ),
        );

        this.config.CENTER = this.game.iso.unproject(new Phaser.Plugin.Isometric.Point3(
            this.game.world.bounds.width / 2,
            this.game.world.bounds.height / 2,
            0,
        ));

        // Focus the center of the map
        this.game.camera.focusOnXY(
            this.game.world.bounds.width / 2,
            this.game.world.bounds.height / 2,
        );

        // Let's make a load of tiles on a grid.
        this.tileManager.spawnTiles();

        // Provide a 3D position for the cursor
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update() {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means
        // you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery.
        // By default, the z position is 0 if not set.
        this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos);
        this.tileManager.update(this.cursorPos);

        if (this.cursors.up.isDown) {
            this.game.camera.y -= 1 * this.config.CAMERA_VELOCITY;
        } else if (this.cursors.down.isDown) {
            this.game.camera.y += 1 * this.config.CAMERA_VELOCITY;
        }

        if (this.cursors.left.isDown) {
            this.game.camera.x -= 1 * this.config.CAMERA_VELOCITY;
        } else if (this.cursors.right.isDown) {
            this.game.camera.x += 1 * this.config.CAMERA_VELOCITY;
        }
    }

    render() {
        this.game.debug.text(this.game.time.fps || '--', 8, 16, '#ffffff');
        this.game.debug.text(`x: ${Number.parseInt(this.game.input.mousePointer.x, 10)} y: ${Number.parseInt(this.game.input.mousePointer.y, 10)}`, 8, 32, '#ffffff');
        this.game.debug.text(`#${this.seed}`, 8, 48, '#ffffff');
        this.game.debug.cameraInfo(this.game.camera, 8, 64);
    }

    start() {
        this.game.state.add('Boot', this);
        this.game.state.start('Boot');
    }
};

module.exports = GameManager;
