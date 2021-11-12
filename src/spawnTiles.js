import { Loader, Texture, Rectangle, Sprite } from 'pixi.js';
import world from './world/world';
import Entity from './world/entity';
import Vector2 from './vector2';
import TAG from './tag';

const tilemapPath = 'graphics/tiles_packed_reduced.png';
const tilesPerRow = 12;
const realTilePixelSize = 200;

function getTilemapTexture() {
	return new Promise((resolve) => {
		const loader = Loader.shared;
		loader.add('tilemap', tilemapPath);
		loader.load((_, resources) => {
			resolve(resources.tilemap.texture);
		});
	});
}

function createTileSprite(tileID, tilemap) {
	const tileLocation = {
		column: tileID % tilesPerRow,
		row: Math.floor(tileID / tilesPerRow)
	};
	const tilePixelLocation = {
		x: tileLocation.column * realTilePixelSize,
		y: tileLocation.row * realTilePixelSize
	};

	const tileFrame = new Rectangle(tilePixelLocation.x, tilePixelLocation.y, realTilePixelSize, realTilePixelSize);
	const tileTexture = new Texture(tilemap, tileFrame);
	return new Sprite(tileTexture);
}

export default async function spawnTiles() {
	const tilemap = await getTilemapTexture();

	for (let y = 0; y < world.worldSize.y; y++) {
		for (let x = 0; x < world.worldSize.x; x++) {
			// eslint-disable-next-line no-new
			new Entity({
				sprite: createTileSprite(6, tilemap),
				position: new Vector2({ x, y }),
				blockSize: new Vector2({ x: 1, y: 1 }),
				tag: TAG.TILE
			});
		}
	}
}
