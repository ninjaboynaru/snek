import config from './config';
import Vector2 from './vector2';
import world from './world/world';
import Entity from './world/entity';
import DIRECTION from './direction';
import TAG from './tag';

const headImg = 'graphics/player_head.png';
const tailImg = 'graphics/player_tail.png';

function rotationFromDirection(direction) {
	switch (direction) {
		case DIRECTION.UP:
			return 0;
		case DIRECTION.DOWN:
			return 180;
		case DIRECTION.RIGHT:
			return 90;
		case DIRECTION.LEFT:
			return 270;
		default:
			return null;
	}
}

export default new function player() {
	const body = [];
	let moveDirection = DIRECTION.UP;

	function moveUpdate() {
		let previousPartPosition;
		let previousPartRotation;

		for (let i = 0; i < body.length; i++) {
			const isHead = i === 0;
			const bodyPart = body[i];
			const positionBeforeMove = bodyPart.getPosition();
			const rotationBeforeMove = bodyPart.getRotation();

			if (isHead) {
				const targetPosition = bodyPart.getPosition().add(Vector2.fromDirection(moveDirection));
				if (world.positionInBounds(targetPosition) === false) {
					return;
				}

				bodyPart.moveDirection(moveDirection);
				bodyPart.rotate(rotationFromDirection(moveDirection));
			}
			else {
				bodyPart.moveTo(previousPartPosition);
				bodyPart.rotate(previousPartRotation);
			}

			previousPartPosition = positionBeforeMove;
			previousPartRotation = rotationBeforeMove;
		}
	}

	function keyUpdate(event) {
		if (moveDirection !== DIRECTION.DOWN && (event.key === 'w' || event.key === 'ArrowUp')) {
			moveDirection = DIRECTION.UP;
		}
		if (moveDirection !== DIRECTION.UP && (event.key === 's' || event.key === 'ArrowDown')) {
			moveDirection = DIRECTION.DOWN;
		}
		if (moveDirection !== DIRECTION.RIGHT && (event.key === 'a' || event.key === 'ArrowLeft')) {
			moveDirection = DIRECTION.LEFT;
		}
		if (moveDirection !== DIRECTION.LEFT && (event.key === 'd' || event.key === 'ArrowRight')) {
			moveDirection = DIRECTION.RIGHT;
		}
	}

	this.init = function init() {
		const centerBlock = world.worldSize.copy().divide(2);
		const offsetVector = Vector2.fromDirection(moveDirection).invert();
		const bodyRotation = rotationFromDirection(moveDirection);

		for (let i = 0; i < config.playerStartLength; i++) {
			let spriteImgPath = tailImg;

			if (i === 0) {
				spriteImgPath = headImg;
			}

			const position = new Vector2({
				x: centerBlock.x + (i * offsetVector.x),
				y: centerBlock.y + (i * offsetVector.y)
			});

			const bodyPart = new Entity({ spriteImgPath, position, anchor: 0.5, blockSize: new Vector2({ x: 1, y: 1 }), tag: TAG.PLAYER });
			bodyPart.rotate(bodyRotation);
			body.push(bodyPart);
		}

		document.addEventListener('keydown', keyUpdate);
		window.setInterval(moveUpdate, config.playerMoveUpdateRate);
	};
}();
