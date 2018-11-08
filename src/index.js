window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
require('phaser-plugin-isometric/dist/phaser-plugin-isometric.js');

const GameModel = require('./models/Game');
const TileSprite = require('./sprites/TileSprite');
const CONSTRUCTION_TYPES = require('./constants/ConstructionTypes');

/* Assets */
const ASSETS = require('./AssetsManager');

const { Phaser } = window;

document.querySelector('body').innerHTML = '';

const game = new Phaser.Game('100', '100', Phaser.AUTO, 'test', null, false, false);

const BasicGame = () => {};

BasicGame.Boot = () => {};

let tilesGroup;
let cursorPos;
let cursors;

const MAP_SIZE = 12;
const TILE_SIZE = 38;
const TILE_DISPLAY_WIDTH = 64;
const TILE_DISPLAY_HEIGHT = 37;
const CAMERA_VELOCITY = 10;
let CENTER = {
    X: 0,
    Y: 0,
};

BasicGame.Boot.prototype = {

    preload() {
        const urlParams = new URLSearchParams(window.location.search);
        const seedFromUrl = urlParams.get('seed');
        this.seed = Number.parseInt(seedFromUrl, 10) || Math.floor(Math.random() * 1000000);
        this.gameModel = new GameModel(MAP_SIZE, this.seed);

        // Load assets
        game.load.image('tile', ASSETS.TILE);
        game.load.image('grass_1', ASSETS.GRASS_1);
        game.load.image('grass_2', ASSETS.GRASS_2);
        game.load.image('grass_3', ASSETS.GRASS_3);
        game.load.image('basic_turret', ASSETS.BASIC_TURRET);
        game.load.image('bullet', ASSETS.BULLET);

        game.time.advancedTiming = true;
        game.stage.backgroundColor = 0x000000;
        game.renderer.renderSession.roundPixels = true;

        // Enable plugins
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        game.iso.anchor.setTo(0.5, 0.2);
    },
    create() {
        this.gameModel.generateMap();

        tilesGroup = game.add.group();

        const canvas = document.querySelector('canvas');

        game.world.setBounds(
            0,
            0,
            Math.max(
                (MAP_SIZE + 6) * TILE_DISPLAY_WIDTH,
                Number.parseInt(canvas.style.width, 10),
            ),
            Math.max(
                (MAP_SIZE + 4) * TILE_DISPLAY_HEIGHT,
                Number.parseInt(canvas.style.height, 10),
            ),
        );

        CENTER = game.iso.unproject(new Phaser.Plugin.Isometric.Point3(
            game.world.bounds.width / 2,
            game.world.bounds.height / 2,
            0,
        ));

        // Focus the center of the map
        game.camera.focusOnXY(game.world.bounds.width / 2, game.world.bounds.height / 2);

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();
        cursors = game.input.keyboard.createCursorKeys();
    },
    update() {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means
        // you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery.
        // By default, the z position is 0 if not set.
        game.iso.unproject(game.input.activePointer.position, cursorPos);
        // Loop through all tiles and test to see if the 3D position from above
        // intersects with the automatically generated IsoSprite tile bounds.
        for (let x = 0; x < this.mapTiles.length; x += 1) {
            for (let y = 0; y < this.mapTiles.length; y += 1) {
                const currentTile = this.mapTiles[x][y];
                const inBounds = currentTile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                if (!currentTile.isSelected && inBounds) {
                    currentTile.setSelected(true);
                } else if (currentTile.isSelected && !inBounds) {
                    currentTile.setSelected(false);
                }
                currentTile.updateContent(game);
            }
        }

        if (cursors.up.isDown) {
            game.camera.y -= 1 * CAMERA_VELOCITY;
        } else if (cursors.down.isDown) {
            game.camera.y += 1 * CAMERA_VELOCITY;
        }

        if (cursors.left.isDown) {
            game.camera.x -= 1 * CAMERA_VELOCITY;
        } else if (cursors.right.isDown) {
            game.camera.x += 1 * CAMERA_VELOCITY;
        }
    },
    render() {
        game.debug.text(game.time.fps || '--', 8, 16, '#ffffff');
        game.debug.text(`x: ${Number.parseInt(game.input.mousePointer.x, 10)} y: ${Number.parseInt(game.input.mousePointer.y, 10)}`, 8, 32, '#ffffff');
        game.debug.text(`#${this.seed}`, 8, 48, '#ffffff');
        game.debug.cameraInfo(game.camera, 8, 64);
    },
    spawnTiles() {
        this.mapTiles = [];
        for (let x = 0; x < this.gameModel.map.length; x += 1) {
            this.mapTiles[x] = [];
            for (let y = 0; y < this.gameModel.map.length; y += 1) {
                const tileSprite = new TileSprite(
                    game,
                    CENTER.x + (x - this.gameModel.mapSize / 2) * TILE_SIZE,
                    CENTER.y + (y - this.gameModel.mapSize / 2) * TILE_SIZE,
                    x,
                    y,
                    this.gameModel.map[x][y],
                );
                tileSprite.setOnClick(this.onTileClick.bind(this, x, y));
                game.add.existing(tileSprite);
                tilesGroup.add(tileSprite);
                this.mapTiles[x][y] = tileSprite;
            }
        }
    },
    onTileClick(x, y) {
        if (this.gameModel.map[x][y].constructionType === CONSTRUCTION_TYPES.NONE) {
            this.gameModel.map[x][y].setConstructionType(CONSTRUCTION_TYPES.BASIC_TURRET);
        } else {
            this.gameModel.map[x][y].setConstructionType(CONSTRUCTION_TYPES.NONE);
        }
        this.mapTiles[x][y].setTile(this.gameModel.map[x][y]);
    },
};

game.state.add('Boot', BasicGame.Boot);

game.state.start('Boot');
