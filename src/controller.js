import board from './board';
import DIRECTIONS from './directions';
import gameConfig from './gameConfig';
import { directionToVector } from './util';

const controller = new function() {
	let keyDirection = null;

	function onKeyDown(event) {
		if (event.key === 'w' || event.key === 'ArrowUp') {
			keyDirection = DIRECTIONS.UP;
		}
		if (event.key === 's' || event.key === 'ArrowDown') {
			keyDirection = DIRECTIONS.DOWN;
		}
		if (event.key === 'a' || event.key === 'ArrowLeft') {
			keyDirection = DIRECTIONS.LEFT;
		}
		if (event.key === 'd' || event.key === 'ArrowRight') {
			keyDirection = DIRECTIONS.RIGHT;
		}
	}

	function update() {
		const snakeDirection = board.getSnakeDirection();
		let finalDirection = snakeDirection;

		if (keyDirection === DIRECTIONS.UP && snakeDirection !== DIRECTIONS.DOWN) {
			finalDirection = keyDirection;
		}
		else if (keyDirection === DIRECTIONS.DOWN && snakeDirection !== DIRECTIONS.UP) {
			finalDirection = keyDirection;
		}
		else if (keyDirection === DIRECTIONS.LEFT && snakeDirection !== DIRECTIONS.RIGHT) {
			finalDirection = keyDirection;
		}
		else if (keyDirection === DIRECTIONS.RIGHT && snakeDirection !== DIRECTIONS.LEFT) {
			finalDirection = keyDirection;
		}

		const willHitWall = board.snakeWillHitWall(finalDirection);
		const willHitSnake = board.snakeWillHitSnake(finalDirection);
		const willHitFruit = board.snakeWillHitFruit(finalDirection);

		if (willHitWall || willHitSnake) {
			return;
		}

		if (willHitFruit) {
			board.growSnake();
		}

		board.moveSnake(directionToVector(finalDirection));

		keyDirection = null;
	}

	this.init = function init() {
		document.addEventListener('keydown', onKeyDown);
		setInterval(update, gameConfig.updateRate);
	};
}();

export default controller;
