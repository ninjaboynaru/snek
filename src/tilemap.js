import * as pixi from 'pixi.js';

const tilemapPath = 'graphics/tiles_packed_reduced.png';
const tilesPerRow = 12;
const realTileSize = 200;

const tilemap = new function() {
	let tilemapTexture;

	this.init = async function init() {
		await new Promise((resolve) => {
			const loader = pixi.Loader.shared;
			loader.add('tilemap', tilemapPath);
			loader.load((_, resources) => {
				tilemapTexture = resources.tilemap.texture;
				resolve();
			});
		});
	};

	this.createTileSprite = function createTileSprite(tileId) {
		const tileRowColumn = {
			x: tileId % tilesPerRow,
			y: Math.floor(tileId / tilesPerRow)
		};
		const tileStartLocation = {
			x: tileRowColumn.x * realTileSize,
			y: tileRowColumn.y * realTileSize
		};

		const tileFrame = new pixi.Rectangle(tileStartLocation.x, tileStartLocation.y, realTileSize, realTileSize);
		const tileTexture = new pixi.Texture(tilemapTexture, tileFrame);
		return new pixi.Sprite(tileTexture);
	};
}();

export default tilemap;
