import { Sprite } from 'pixi.js';
import config from '../config';
import Vector2 from '../vector2';
import world from './world';
import { calculateEntityPixelPosition } from '../util';

export default function Entity({ sprite, position, blockSize, spriteImgPath, tag, meta = {} }) {
	const anchor = 0.5;
	const entityInfo = {
		sprite,
		position,
		blockSize,
		pixelSize: null,
		pixePosition: null
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

	entityInfo.sprite.anchor.set(anchor);
	entityInfo.sprite.width = entityInfo.pixelSize.x;
	entityInfo.sprite.height = entityInfo.pixelSize.y;
	entityInfo.pixelPosition = calculateEntityPixelPosition(entityInfo.position, entityInfo.pixelSize, anchor);
	entityInfo.sprite.position.set(entityInfo.pixelPosition.x, entityInfo.pixelPosition.y);

	world.registerEntity(this, entityInfo.sprite);

	this.prepDelete = function prepDelete() {
		world.removeEntity(this, entityInfo.sprite);
	};

	this.getPosition = function getPosition() {
		return entityInfo.position.copy();
	};

	this.getPixelPosition = function getPixelPosition() {
		return entityInfo.pixelPosition.copy();
	};

	this.getRotation = function getRotation() {
		return entityInfo.sprite.angle;
	};

	this.rotate = function rotate(angle) {
		entityInfo.sprite.angle = angle;
	};

	this.moveTo = function moveTo(targetPosition) {
		entityInfo.position = targetPosition.copy();
		entityInfo.pixelPosition = calculateEntityPixelPosition(entityInfo.position, entityInfo.pixelSize, anchor);
		entityInfo.sprite.position.set(entityInfo.pixelPosition.x, entityInfo.pixelPosition.y);
	};

	this.moveDirection = function move(direction) {
		const targetPosition = entityInfo.position.copy().add(Vector2.fromDirection(direction));
		this.moveTo(targetPosition);
	};
}
