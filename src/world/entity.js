import { Sprite } from 'pixi.js';
import config from '../config';
import Vector2 from '../vector2';
import world from './world';

export default function Entity({ sprite, position, blockSize, spriteImgPath, anchor, tag, meta = {} }) {
	const entityInfo = {
		sprite,
		position,
		blockSize,
		pixePosition: null,
		pixelSize: null
	};

	this.tag = tag;
	this.meta = meta;

	if (!sprite && spriteImgPath) {
		entityInfo.sprite = Sprite.from(spriteImgPath);
	}

	entityInfo.pixelSize = new Vector2({
		x: config.pixelBlockSize.x * blockSize.x,
		y: config.pixelBlockSize.y * blockSize.y
	});

	entityInfo.pixelPosition = new Vector2({
		x: position.x * config.pixelBlockSize.x,
		y: position.y * config.pixelBlockSize.y
	});

	if (anchor) {
		entityInfo.sprite.anchor.set(anchor);
	}

	entityInfo.sprite.width = entityInfo.pixelSize.x;
	entityInfo.sprite.height = entityInfo.pixelSize.y;
	entityInfo.sprite.position.set(entityInfo.pixelPosition.x, entityInfo.pixelPosition.y);

	this.getPosition = function getPosition() {
		return entityInfo.position.copy();
	};

	this.getRotation = function getRotation() {
		return entityInfo.sprite.angle;
	};

	this.rotate = function rotate(angle) {
		entityInfo.sprite.angle = angle;
	};

	this.moveTo = function moveTo(targetPosition) {
		entityInfo.position = targetPosition.copy();
		entityInfo.pixelPosition = targetPosition.copy().multiply(config.pixelBlockSize);
		entityInfo.sprite.position.set(entityInfo.pixelPosition.x, entityInfo.pixelPosition.y);
	};

	this.moveDirection = function move(direction) {
		const targetPosition = entityInfo.position.copy().add(Vector2.fromDirection(direction));
		this.moveTo(targetPosition);
	};

	this.prepDelete = function prepDelete() {
		world.removeEntity(this, entityInfo.sprite);
	};

	world.registerEntity(this, entityInfo.sprite);
}
