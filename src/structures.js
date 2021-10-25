import { randomInt } from './util';

const structureList = [];

structureList.push([
	[1, 2, 2, 3],
	[13, 14, 14, 15],
	[25, 26, 26, 27]
]);

structureList.push([
	[1, 2, 2, 2, 2, 3],
	[13, 14, 14, 14, 14, 15],
	[25, 26, 26, 26, 26, 27]
]);

structureList.push([
	[28]
]);

structureList.push([
	[29]
]);

structureList.push([
	[1, 2, 2, 2, 3],
	[13, 14, 14, 14, 15],
	[25, 26, 26, 5, 15],
	[6, 6, 6, 13, 15],
	[6, 6, 6, 13, 15],
	[6, 6, 6, 25, 27]

]);

structureList.push([
	[1, 2, 2, 3],
	[13, 4, 5, 15],
	[13, 16, 17, 15],
	[25, 26, 26, 27]
]);

structureList.push([
	[6, 1, 3, 6],
	[13, 14, 36, 15],
	[6, 25, 27, 6]
]);

const structures = new function() {
	this.getRandomStructure = function getRandomStructure() {
		return structureList[randomInt(0, structureList.length - 1)];
	};
}();

export default structures;
