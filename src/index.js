window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
require('phaser-plugin-isometric/dist/phaser-plugin-isometric.js');

/* Assets */
const ASSETS = require('./AssetsManager');

const { Phaser } = window;

document.querySelector('body').innerHTML = '';

const game = new Phaser.Game('100', '100', Phaser.AUTO, 'test', null, true, false);

const BasicGame = () => {};

BasicGame.Boot = () => {};

let isoGroup;
let cursorPos;
let grassGroup;
let cursors;

const MAP_SIZE = 32;
const TILE_SIZE = 38;
const TILE_DISPLAY_WIDTH = 64;
const TILE_DISPLAY_HEIGHT = 37;
const CAMERA_VELOCITY = 10;
let CENTER = {
    X: 0,
    Y: 0,
};
const GAME_MAP = [];

BasicGame.Boot.prototype = {

    preload() {
        // Load assets
        game.load.image('tile', ASSETS.TILE);
        game.load.image('grass_1', ASSETS.GRASS_1);
        game.load.image('grass_2', ASSETS.GRASS_2);
        game.load.image('grass_3', ASSETS.GRASS_3);

        game.time.advancedTiming = true;

        // Enable plugins
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        game.iso.anchor.setTo(0.5, 0.2);
    },
    create() {
        // Create a group for our tiles.
        isoGroup = game.add.group();
        grassGroup = game.add.group();
        const canvas = document.querySelector('canvas');

        game.world.setBounds(
            0,
            0,
            Math.max(MAP_SIZE * TILE_DISPLAY_WIDTH, Number.parseInt(canvas.style.width, 10)),
            Math.max(MAP_SIZE * TILE_DISPLAY_HEIGHT, Number.parseInt(canvas.style.height, 10)),
        );
        console.log('game bounds', game.world.bounds);
        CENTER = game.iso.unproject(new Phaser.Plugin.Isometric.Point3(
            game.world.bounds.width / 2,
            game.world.bounds.height / 2,
            0,
        ));
        console.log('CENTER', CENTER);
        game.camera.x = CENTER.x;
        game.camera.y = CENTER.y;

        for (let x = 0; x < MAP_SIZE; x += 1) {
            GAME_MAP[x] = [];
            for (let y = 0; y < MAP_SIZE; y += 1) {
                GAME_MAP[x][y] = 0;
            }
        }
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
        isoGroup.forEach((_tile) => {
            const tile = _tile;
            const inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            if (!tile.selected && inBounds) { // If it does, do a little animation and tint change.
                tile.selected = true;
                tile.tint = 0x999999;
                game.add.tween(tile).to({ isoZ: 4 }, 150, Phaser.Easing.Quadratic.InOut, true);
            } else if (tile.selected && !inBounds) { // If not, revert back to how it was.
                tile.selected = false;
                tile.tint = 0xffffff;
                game.add.tween(tile).to({ isoZ: 0 }, 150, Phaser.Easing.Quadratic.InOut, true);
            }
        });

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
        game.debug.text(game.time.fps || '--', 8, 16, '#000000');
        game.debug.text(`x: ${Number.parseInt(game.input.mousePointer.x, 10)} y: ${Number.parseInt(game.input.mousePointer.y, 10)}`, 8, 32, '#000000');
        game.debug.cameraInfo(game.camera, 8, 64);
    },
    spawnTiles() {
        console.log('tile', CENTER.x + 0 * TILE_SIZE, CENTER.y + 0 * TILE_SIZE);
        let tile;

        // Generate basic tiles
        for (let x = -(MAP_SIZE / 2); x < MAP_SIZE / 2; x += 1) {
            for (let y = -(MAP_SIZE / 2); y < MAP_SIZE / 2; y += 1) {
                tile = game.add.isoSprite(
                    CENTER.x + x * TILE_SIZE,
                    CENTER.y + y * TILE_SIZE,
                    0,
                    'tile',
                    0,
                    isoGroup,
                );
                tile.anchor.set(0.5, 0.2);
            }
        }

        // Generate grass
        // let grassTile;
        // for (let x = -(MAP_SIZE / 2); x < MAP_SIZE / 2; x += 1) {
        //     for (let y = -(MAP_SIZE / 2); y < MAP_SIZE / 2; y += 1) {
        //         const rnd = Math.round(Math.random() * 20);

        //         if ([1, 2, 3].indexOf(rnd) > -1) {
        //             grassTile = game.add.isoSprite(
        //                 CENTER.X + x * TILE_SIZE,
        //                 CENTER.Y + y * TILE_SIZE,
        //                 0,
        //                 `grass_${rnd}`,
        //                 0,
        //                 grassGroup,
        //             );
        //             grassTile.anchor.set(0.5, 0.2);
        //         }
        //     }
        // }
    },
};

game.state.add('Boot', BasicGame.Boot);

game.state.start('Boot');
