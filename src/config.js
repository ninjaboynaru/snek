import Vector2 from './vector2';

export default {
	appContainerElementID: 'app-container',
	pixelWorldSize: new Vector2({ x: 600, y: 600 }),
	pixelBlockSize: new Vector2({ x: 30, y: 30 }),
	worldBackgroundColor: 0x000000,

	playerStartLength: 6,
	playerMoveUpdateRate: 120,

	coinSpawn: {
		maxSpawnCount: 3,
		maxInWorld: 6,
		maxSpawnAttempts: 100
	},

	structureSpawnChance: 5
};
