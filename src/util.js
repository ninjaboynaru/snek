function randomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomChance(chance) {
	return randomIntInclusive(1, 100) <= chance;
}

export { randomIntInclusive, randomChance };
