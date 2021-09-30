import * as pixi from 'pixi.js';
import gameConfig from './gameConfig';
import DIRECTIONS from './directions';
import { getNextTileIndex, randomInt } from './util';

const board = new function() {
	let app;
	const boardInfo = { xTilesCount: -1, yTilesCount: -1 };
	const tiles = [];
	const snake = [];
	const fruits = [];

	function createTile(xIndex, yIndex) {
		const yCoord = yIndex * gameConfig.tileSize;
		const xCoord = xIndex * gameConfig.tileSize;
		const graphic = new pixi.Graphics();

		graphic.lineStyle(gameConfig.tileBorderSize, gameConfig.tileBorderColor);
		graphic.beginFill(gameConfig.tileColor);
		graphic.drawRect(xCoord, yCoord, gameConfig.tileSize, gameConfig.tileSize);
		graphic.endFill();

		return {
			xCoord,
			yCoord,
			xIndex,
			yIndex,
			graphic
		};
	}

	function getTile(xIndex, yIndex) {
		return tiles[yIndex][xIndex];
	}

	function createSnakePart(tileX, tileY, isHead = false) {
		let partColor = gameConfig.snakeColor;
		if (isHead === true) {
			partColor = gameConfig.snakeHeadColor;
		}

		const graphic = new pixi.Graphics();
		const tile = getTile(tileX, tileY);
		const snakeCoords = { x: -1, y: -1 };
		const tileCenterCoords = {
			x: tile.xCoord + (gameConfig.tileSize / 2),
			y: tile.yCoord + (gameConfig.tileSize / 2)
		};

		snakeCoords.x = Math.floor(tileCenterCoords.x - (gameConfig.snakeSize / 2));
		snakeCoords.y = Math.floor(tileCenterCoords.y - (gameConfig.snakeSize / 2));

		graphic.beginFill(partColor);
		graphic.drawRect(snakeCoords.x, snakeCoords.y, gameConfig.snakeSize, gameConfig.snakeSize);
		graphic.endFill();

		return {
			tile,
			xCoord: snakeCoords.x,
			yCoord: snakeCoords.y,
			isHead: isHead,
			graphic
		};
	}

	function createFruit(tileX, tileY) {
		const graphic = new pixi.Graphics();
		const tile = getTile(tileX, tileY);
		const fruitCoords = { x: -1, y: -1 };
		const tileCenterCoords = {
			x: tile.xCoord + (gameConfig.tileSize / 2),
			y: tile.yCoord + (gameConfig.tileSize / 2)
		};

		fruitCoords.x = Math.floor(tileCenterCoords.x - (gameConfig.fruitSize / 2));
		fruitCoords.y = Math.floor(tileCenterCoords.y - (gameConfig.fruitSize / 2));

		graphic.beginFill(gameConfig.fruitColor);
		graphic.drawRoundedRect(fruitCoords.x, fruitCoords.y, gameConfig.fruitSize, gameConfig.fruitSize, gameConfig.fruitRadius);
		graphic.endFill();

		return {
			tile,
			xCoord: tileCenterCoords.x,
			yCoord: tileCenterCoords.y,
			graphic
		};
	}

	function setupBoardInfo() {
		boardInfo.xTilesCount = Math.floor(gameConfig.viewWidth / gameConfig.tileSize);
		boardInfo.yTilesCount = Math.floor(gameConfig.viewHeight / gameConfig.tileSize);
	}

	function setupTiles() {
		for (let y = 0; y < boardInfo.yTilesCount; y++) {
			const row = [];

			for (let x = 0; x < boardInfo.xTilesCount; x++) {
				const tile = createTile(x, y);
				app.stage.addChild(tile.graphic);
				row.push(tile);
			}

			tiles.push(row);
		}
	}

	function setupSnake() {
		const middleTile = {
			x: Math.floor(boardInfo.xTilesCount / 2),
			y: Math.floor(boardInfo.yTilesCount / 2)
		};

		for (let i = 0; i < gameConfig.snakeStartLength; i++) {
			const snakePart = createSnakePart(middleTile.x + i, middleTile.y, i === 0);
			app.stage.addChild(snakePart.graphic);
			snake.push(snakePart);
		}
	}

	function tileHasSnake(tileX, tileY) {
		for (const snakePart of snake) {
			if (snakePart.tile.xIndex === tileX && snakePart.tile.yIndex === tileY) {
				return true;
			}
		}

		return false;
	}

	function getFruitOnTile(tileX, tileY) {
		for (const fruit of fruits) {
			if (fruit.tile.xIndex === tileX && fruit.tile.yIndex === tileY) {
				return fruit;
			}
		}

		return null;
	}

	this.init = function init(pixiApp) {
		app = pixiApp;
		setupBoardInfo();
		setupTiles();
		setupSnake();
	};

	this.moveSnake = function moveSnake({ x = 0, y = 0 }) {
		let previousSnakePart;

		for (let i = 0; i < snake.length; i++) {
			const oldSnakePart = snake[i];
			let newSnakePart;

			if (!previousSnakePart) {
				newSnakePart = createSnakePart(oldSnakePart.tile.xIndex + x, oldSnakePart.tile.yIndex + y, oldSnakePart.isHead);
			}
			else {
				newSnakePart = createSnakePart(previousSnakePart.tile.xIndex, previousSnakePart.tile.yIndex, false);
			}

			oldSnakePart.graphic.clear();
			app.stage.removeChild(oldSnakePart.graphic);
			app.stage.addChild(newSnakePart.graphic);
			snake[i] = newSnakePart;
			previousSnakePart = oldSnakePart;
		}
	};

	this.growSnake = function growSnake() {
		const tailTile = snake[snake.length - 1].tile;
		const tailTilePlus = snake[snake.length - 2].tile;

		const tileIndexDifference = {
			x: tailTile.xIndex - tailTilePlus.xIndex,
			y: tailTile.yIndex - tailTilePlus.yIndex
		};

		const newSnakePart = createSnakePart(tailTile.xIndex + tileIndexDifference.x, tailTile.yIndex + tileIndexDifference.y);
		app.stage.addChild(newSnakePart.graphic);
		snake.push(newSnakePart);
	};

	this.getSnakeDirection = function getSnakeDirection() {
		const headTile = snake[0].tile;
		const neckTile = snake[1].tile;

		const onSameRow = headTile.yIndex === neckTile.yIndex;
		const onSameColumn = headTile.xIndex === neckTile.xIndex;

		if (onSameRow === true) {
			if (headTile.xIndex < neckTile.xIndex) {
				return DIRECTIONS.LEFT;
			}
			if (headTile.xIndex > neckTile.xIndex) {
				return DIRECTIONS.RIGHT;
			}
		}
		else if (onSameColumn === true) {
			if (headTile.yIndex < neckTile.yIndex) {
				return DIRECTIONS.UP;
			}
			if (headTile.yIndex > neckTile.yIndex) {
				return DIRECTIONS.DOWN;
			}
		}
	};

	this.snakeWillHitWall = function snakeWillHiteWall(direction) {
		const headTile = snake[0].tile;
		const nextTileIndex = getNextTileIndex(direction, headTile);

		if (nextTileIndex.x <= -1 || nextTileIndex.y <= -1) {
			return true;
		}
		if (nextTileIndex.x >= boardInfo.xTilesCount || nextTileIndex.y >= boardInfo.yTilesCount) {
			return true;
		}

		return false;
	};

	this.snakeWillHitSnake = function snakeWillHitSnake(direction) {
		const headTile = snake[0].tile;
		const nextTileIndex = getNextTileIndex(direction, headTile);

		return tileHasSnake(nextTileIndex.x, nextTileIndex.y);
	};

	this.getSnakeNextFruit = function getSnakeNextFruit(direction) {
		const headTile = snake[0].tile;
		const nextTileIndex = getNextTileIndex(direction, headTile);
		return getFruitOnTile(nextTileIndex.x, nextTileIndex.y);
	};

	this.spawnRandomFruit = function spawnRandomFruit() {
		while (true) {
			const xIndex = randomInt(0, boardInfo.xTilesCount - 1);
			const yIndex = randomInt(0, boardInfo.yTilesCount - 1);
			const tileOccupied = getFruitOnTile(xIndex, yIndex) || tileHasSnake(xIndex, yIndex);

			if (tileOccupied === true) {
				continue;
			}

			const fruit = createFruit(xIndex, yIndex);
			fruits.push(fruit);
			app.stage.addChild(fruit.graphic);
			break;
		}
	};

	this.removeFruit = function removeFruit(fruit) {
		const fruitIndex = fruits.indexOf(fruit);
		fruits.splice(fruitIndex, 1);

		app.stage.removeChild(fruit.graphic);
	};

	this.getFruitCount = function getFruitCount() {
		return fruits.length;
	};
}();

export default board;
