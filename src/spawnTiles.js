import { Loader, Texture, Rectangle, Sprite } from 'pixi.js';
import world from './world/world';
import Entity from './world/entity';
import Vector2 from './vector2';
import { randomIntInclusive } from './util';
import structures from './structures';
import config from './config';
import TAG from './tag';

const tilemapPath = 'graphics/tiles_packed_reduced.png';
const tilesPerRow = 12;
const realTilePixelSize = 200;
const defaultTileID = 7;
const tiles = [];
let tilemap;

function getTilemapTexture() {
	return new Promise((resolve) => {
		const loader = Loader.shared;
		loader.add('tilemap', tilemapPath);
		loader.load((_, resources) => {
			resolve(resources.tilemap.texture);
		});
	});
}

function createTileSprite(tileID) {
	tileID -= 1; // subtract 1 because tilemap guide graphic was made wrong
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

// export default async function spawnTiles() {
// 	const tilemap = await getTilemapTexture();

// 	for (let y = 0; y < world.worldSize.y; y++) {
// 		for (let x = 0; x < world.worldSize.x; x++) {
// 			// eslint-disable-next-line no-new
// 			new Entity({
// 				sprite: createTileSprite(6, tilemap),
// 				position: new Vector2({ x, y }),
// 				blockSize: new Vector2({ x: 1, y: 1 }),
// 				tag: TAG.TILE
// 			});
// 		}
// 	}
// }

function createTile(position, tileID, isStructure) {
	tiles.push(new Entity({
		sprite: createTileSprite(tileID),
		position: position,
		blockSize: new Vector2({ x: 1, y: 1 }),
		tag: TAG.TILE,
		meta: { isStructure }
	}));
}

function getTileAtPosition(position) {
	for (const tile of tiles) {
		if (tile.getPosition().equals(position)) {
			return tile;
		}
	}

	return null;
}

function positionHasTileStructure(position) {
	const tileAtPos = getTileAtPosition(position);

	if (tileAtPos === null) {
		return false;
	}

	return tileAtPos.meta.isStructure === true;
}

function structureFitsAtPosition(position, structure) {
	for (let rowIndex = 0; rowIndex < structure.length; rowIndex++) {
		const structureRow = structure[rowIndex];
		for (let columnIndex = 0; columnIndex < structureRow.length; columnIndex++) {
			const offsetPosition = new Vector2({ x: columnIndex, y: rowIndex }).add(position);
			if (world.positionInBounds(offsetPosition) === false) {
				return false;
			}
			const tileAtOffset = getTileAtPosition(offsetPosition);
			if (tileAtOffset && tileAtOffset.meta.isStructure === true) {
				return false;
			}
		}
	}

	return true;
}

function spawnStructure(position, structure) {
	for (let rowIndex = 0; rowIndex < structure.length; rowIndex++) {
		const structureRow = structure[rowIndex];
		for (let columnIndex = 0; columnIndex < structureRow.length; columnIndex++) {
			const tileID = structureRow[columnIndex];
			const offsetPosition = new Vector2({ x: columnIndex, y: rowIndex }).add(position);
			createTile(offsetPosition, tileID, true);
		}
	}
}

export default async function spawnTiles() {
	tilemap = await getTilemapTexture();

	for (let y = 0; y < world.worldSize.y; y++) {
		for (let x = 0; x < world.worldSize.x; x++) {
			const position = new Vector2({ x, y });
			if (positionHasTileStructure(position) === true) {
				continue;
			}

			if (randomIntInclusive(1, 100) <= config.structureSpawnChance) {
				const structureToSpawn = structures[randomIntInclusive(0, structures.length - 1)];
				if (structureFitsAtPosition(position, structureToSpawn)) {
					spawnStructure(position, structureToSpawn);
					continue;
				}
			}

			createTile(position, defaultTileID, false);
		}
	}
}
