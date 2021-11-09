import DIRECTIONS from './directions';

function randomInt(minArg, maxArg) {
	const min = Math.ceil(minArg);
	const max = Math.floor(maxArg);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChance(chance) {
	const randValue = randomInt(0, 100);

	if (randValue <= chance) {
		return true;
	}

	return false;
}

function directionToVector(direction) {
	const vec = { x: 0, y: 0 };

	if (direction === DIRECTIONS.LEFT) {
		vec.x = -1;
	}
	else if (direction === DIRECTIONS.RIGHT) {
		vec.x = 1;
	}
	else if (direction === DIRECTIONS.UP) {
		vec.y = -1;
	}
	else if (direction === DIRECTIONS.DOWN) {
		vec.y = 1;
	}

	return vec;
}

function getNextTileIndex(direction, currentTile) {
	const directionVector = { x: 0, y: 0 };

	if (direction === DIRECTIONS.LEFT) {
		directionVector.x = -1;
	}
	else if (direction === DIRECTIONS.RIGHT) {
		directionVector.x = 1;
	}
	else if (direction === DIRECTIONS.UP) {
		directionVector.y = -1;
	}
	else if (direction === DIRECTIONS.DOWN) {
		directionVector.y = 1;
	}

	return { x: currentTile.xIndex + directionVector.x, y: currentTile.yIndex + directionVector.y };
}

function stableGraphicResize(graphic, { x, y }) {
	const aspectRatio = graphic.width / graphic.height;

	if (x) {
		graphic.width = x;
		graphic.height = x / aspectRatio;
	}
	else if (y) {
		graphic.width = y * aspectRatio;
		graphic.height = y;
	}
}

function unstableGrphaicResize(graphic, { x, y }) {
	if (x) {
		graphic.width = x;
	}

	if (y) {
		graphic.height = y;
	}
}

export { randomInt, randomChance, directionToVector, getNextTileIndex, stableGraphicResize, unstableGrphaicResize };
