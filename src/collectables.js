import config from './config';
import Vector2 from './vector2';
import Entity from './world/entity';
import world from './world/world';
import TAG from './tag';

const coinImgPath = 'graphics/gold_coin.png';

function randomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function getEmptyPosition() {
	let attempts = 0;
	while (attempts < config.coinSpawn.maxSpawnAttempts) {
		attempts += 1;
		const randomPosition = new Vector2({
			x: randomIntInclusive(0, world.worldSize.x - 1),
			y: randomIntInclusive(0, world.worldSize.y - 1)
		});

		const entityAtPos = world.getEntityAtPostion(randomPosition);
		if (entityAtPos && entityAtPos.tag === TAG.PLAYER) {
			continue;
		}

		return randomPosition;
	}

	return null;
}

export default new function collectables() {
	const coins = [];

	this.spawnCoins = function spawnCoins() {
		if (coins.length >= config.coinSpawn.maxInWorld) {
			return;
		}

		const availableSpawns = Math.min(config.coinSpawn.maxSpawnCount, config.coinSpawn.maxInWorld - coins.length);

		const toSpawn = randomIntInclusive(1, availableSpawns);
		for (let i = 0; i < toSpawn; i++) {
			const emptyPosition = getEmptyPosition();

			if (emptyPosition === null) {
				throw new Error('Unable to find empty block to spawn coins');
			}

			coins.push(new Entity({
				position: emptyPosition,
				blockSize: new Vector2({ x: 1, y: 1 }),
				spriteImgPath: coinImgPath,
				anchor: 0.5,
				tag: TAG.COIN
			}));
		}
	};
}();
