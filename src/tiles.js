import { Loader, Texture, Rectangle, Sprite } from 'pixi.js';
import world from './world/world';
import Entity from './world/entity';
import Vector2 from './vector2';
import { randomIntInclusive, randomChance } from './util';
import structures from './structures';
import config from './config';
import TAG from './tag';

export default new function tiles() {
	const tilemapPath = 'graphics/tiles_packed_reduced.png';
	const tilesPerRow = 12;
	const realTilePixelSize = 200;
	const defaultTileID = 7;
	const tileEntities = [];
	let tilemap;

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

	function createTile(position, tileID, isStructure) {
		tileEntities.push(new Entity({
			sprite: createTileSprite(tileID),
			position: position,
			blockSize: new Vector2({ x: 1, y: 1 }),
			tag: TAG.TILE,
			meta: { isStructure }
		}));
	}

	function structureAtPosition(position) {
		for (const tile of tileEntities) {
			if (tile.getPosition().equals(position) && tile.meta.isStructure === true) {
				return true;
			}
		}

		return false;
	}

	function foreachStructureIndex(structure, fn) {
		for (let rowIndex = 0; rowIndex < structure.length; rowIndex++) {
			const structureRow = structure[rowIndex];
			for (let columnIndex = 0; columnIndex < structureRow.length; columnIndex++) {
				const stopLoop = fn(rowIndex, columnIndex, structureRow[columnIndex]);

				if (stopLoop === true) {
					return;
				}
			}
		}
	}

	function structureFitsAtPosition(position, structure) {
		let fits = true;
		foreachStructureIndex(structure, (rowIndex, columnIndex) => {
			const offsetPosition = new Vector2({ x: columnIndex, y: rowIndex }).add(position);

			if (world.positionInBounds(offsetPosition) === false) {
				fits = false;
				return true;
			}

			if (structureAtPosition(offsetPosition)) {
				fits = false;
				return true;
			}
		});

		return fits;
	}

	function spawnStructure(position, structure) {
		foreachStructureIndex(structure, (rowIndex, columnIndex, tileID) => {
			const offsetPosition = new Vector2({ x: columnIndex, y: rowIndex }).add(position);
			createTile(offsetPosition, tileID, true);
		});
	}

	function spawnTiles() {
		for (let y = 0; y < world.worldSize.y; y++) {
			for (let x = 0; x < world.worldSize.x; x++) {
				const position = new Vector2({ x, y });

				if (randomChance(config.structureSpawnChance)) {
					const structureToSpawn = structures[randomIntInclusive(0, structures.length - 1)];

					if (structureFitsAtPosition(position, structureToSpawn)) {
						spawnStructure(position, structureToSpawn);
						continue;
					}
				}

				if (structureAtPosition(position) === false) {
					createTile(position, defaultTileID, false);
				}
			}
		}
	}

	this.init = async function init() {
		return new Promise((resolve) => {
			const loader = Loader.shared;
			loader.add('tilemap', tilemapPath);
			loader.load((_, resources) => {
				tilemap = resources.tilemap.texture;
				spawnTiles();
				resolve();
			});
		});
	};
}();
