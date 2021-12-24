import config from './config';
import Vector2 from './vector2';
import world from './world/world';
import Entity from './world/entity';
import DIRECTION from './direction';
import TAG from './tag';
import { EVENT, store } from './store';
import collectables from './collectables';
import audio from './audio';

const headImg = 'graphics/player_head.png';
const tailImg = 'graphics/player_tail.png';
const coinCollectAudio = 'sounds/coin_collect.wav';
const gameOverAudio = 'sounds/game_over.wav';

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
	let canMove = false;
	let score = 0;

	function endGame() {
		if (process.DEV_MODE === true) {
			return;
		}

		audio.play(gameOverAudio);
		canMove = false;
		score = 0;
		store.fire(EVENT.GAME_OVER);
	}

	function growPlayer() {
		const playerTailEnd = body[body.length - 1];
		const tailEndRotation = playerTailEnd.getRotation();
		const newBodyPartPosition = playerTailEnd.getPosition().add(Vector2.fromAngle(tailEndRotation).invert());
		const newBodyPart = new Entity({ spriteImgPath: tailImg, position: newBodyPartPosition, anchor: 0.5, blockSize: new Vector2({ x: 1, y: 1 }), tag: TAG.PLAYER });

		newBodyPart.rotate(tailEndRotation);
		body.push(newBodyPart);
	}

	function onNewPosition() {
		const headPosition = body[0].getPosition();
		const coinsAtPosition = world.getEntitiesAtPosition(headPosition, [TAG.COIN]);

		if (coinsAtPosition.length > 0) {
			growPlayer();
			score += 1;
			store.fire(EVENT.SCORE, { score });

			audio.play(coinCollectAudio);
			collectables.removeCoin(coinsAtPosition[0]);
			collectables.spawnCoins();
		}
	}

	function moveUpdate() {
		if (canMove === false) {
			return;
		}

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
					endGame();
					return;
				}

				const playerPartsAtPosition = world.getEntitiesAtPosition(targetPosition, [TAG.PLAYER]);
				if (playerPartsAtPosition.length > 0) {
					endGame();
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

		onNewPosition();
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
		if (process.DEV_MODE === true && event.key === ' ') {
			moveUpdate();
		}
	}

	function clearPlayer() {
		while (body.length > 0) {
			body.pop().prepDelete();
		}
	}

	this.spawn = function spawn() {
		if (body.length !== 0) {
			clearPlayer();
		}
		else {
			document.addEventListener('keydown', keyUpdate);
			if (process.DEV_MODE === false) {
				window.setInterval(moveUpdate, config.playerMoveUpdateRate);
			}
		}

		canMove = true;
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

			const bodyPart = new Entity({ spriteImgPath, position, blockSize: new Vector2({ x: 1, y: 1 }), tag: TAG.PLAYER });
			bodyPart.rotate(bodyRotation);
			body.push(bodyPart);
		}

		window.player = body[0];
		window.vec = Vector2;
	};
}();
