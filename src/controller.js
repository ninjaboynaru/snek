import board from './board';
import DIRECTIONS from './directions';

const controller = new function() {
	function getKeyEventDirection(event) {
		if (event.key === 'w' || event.key === 'ArrowUp') {
			return DIRECTIONS.UP;
		}
		if (event.key === 's' || event.key === 'ArrowDown') {
			return DIRECTIONS.DOWN;
		}
		if (event.key === 'a' || event.key === 'ArrowLeft') {
			return DIRECTIONS.LEFT;
		}
		if (event.key === 'd' || event.key === 'ArrowRight') {
			return DIRECTIONS.RIGHT;
		}
	}

	function onKeyDown(event) {
		const snakeDirection = board.getSnakeDirection();
		const keyDirection = getKeyEventDirection(event);
		const willHitWall = board.snakeWillHitWall(keyDirection);
		const willHitSnake = board.snakeWillHitSnake(keyDirection);
		const willHitFruit = board.snakeWillHitFruit(keyDirection);

		if (willHitWall === true || willHitSnake === true) {
			return;
		}

		if (keyDirection === DIRECTIONS.UP && snakeDirection !== DIRECTIONS.DOWN) {
			board.moveSnake({ y: -1 });
		}
		else if (keyDirection === DIRECTIONS.DOWN && snakeDirection !== DIRECTIONS.UP) {
			board.moveSnake({ y: 1 });
		}
		else if (keyDirection === DIRECTIONS.LEFT && snakeDirection !== DIRECTIONS.RIGHT) {
			board.moveSnake({ x: -1 });
		}
		else if (keyDirection === DIRECTIONS.RIGHT && snakeDirection !== DIRECTIONS.LEFT) {
			board.moveSnake({ x: 1 });
		}

		if (willHitFruit === true) {
			board.growSnake();
		}
	}

	this.init = function init() {
		document.addEventListener('keydown', onKeyDown);
	};
}();

export default controller;
