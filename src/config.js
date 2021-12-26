import Vector2 from './vector2';

export default {
	appContainerElementID: 'game-container',
	pixelWorldSize: new Vector2({ x: 500, y: 500 }),
	pixelBlockSize: new Vector2({ x: 25, y: 25 }),
	worldBackgroundColor: 0x000000,

	playerStartLength: 6,
	playerMoveUpdateRate: 80,

	coinSpawn: {
		maxSpawnCount: 4,
		maxInWorld: 8,
		maxSpawnAttempts: 100
	},

	structureSpawnChance: 4
};
