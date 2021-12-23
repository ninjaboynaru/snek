import config from './config';
import Vector2 from './vector2';

function randomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomChance(chance) {
	return randomIntInclusive(1, 100) <= chance;
}

function positionWorldPercent(percentPosition) {
	const absolutePosition = new Vector2({
		x: config.pixelWorldSize.x * percentPosition.x,
		y: config.pixelWorldSize.y * percentPosition.y
	});

	return absolutePosition;
}

export { randomIntInclusive, randomChance, positionWorldPercent };
