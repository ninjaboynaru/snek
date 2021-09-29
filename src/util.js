import DIRECTIONS from './directions';

function randomInt(minArg, maxArg) {
	const min = Math.ceil(minArg);
	const max = Math.floor(maxArg);
	return Math.floor(Math.random() * (max - min + 1)) + min;
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

export { randomInt, getNextTileIndex };
