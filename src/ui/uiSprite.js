import { Sprite } from 'pixi.js';
import world from '../world/world';
import config from '../config';
import { positionWorldPercent } from '../util';

function UISprite({ texture, pressedTexture, hoverTexture } = {}) {
	const sprite = Sprite.from(texture);
	const heightToWidthRatio = texture.height / texture.width;
	let onPressCallback;

	sprite.anchor.set(0.5);
	world.registerUIElement(sprite);

	function pointerDown() {
		if (pressedTexture) {
			sprite.texture = pressedTexture;
		}

		if (onPressCallback) {
			onPressCallback();
		}
	}

	function pointerUp() {
		if (pressedTexture) {
			sprite.texture = texture;
		}
	}

	function pointerOver() {
		if (hoverTexture) {
			sprite.texture = hoverTexture;
		}
	}

	function pointerOut() {
		if (hoverTexture) {
			sprite.texture = texture;
		}
	}

	if (pressedTexture || hoverTexture || onPressCallback) {
		sprite.interactive = true;
		sprite.buttonMode = true;

		sprite.on('pointerdown', pointerDown);
		sprite.on('pointerup', pointerUp);
		sprite.on('pointerover', pointerOver);
		sprite.on('pointerout', pointerOut);
	}

	this.prepDelete = function prepDelete() {
		world.removeDisplayObject(sprite);
	};

	this.show = function show() {
		sprite.visible = true;
	};

	this.hide = function hide() {
		sprite.visible = false;
	};

	this.setPosition = function setPosition(position) {
		const absolutePosition = positionWorldPercent(position);
		sprite.position.set(absolutePosition.x, absolutePosition.y);
	};

	this.setWidth = function setWidth(width) {
		const absoluteWidth = config.pixelWorldSize.x * width;
		const absoluteHeight = absoluteWidth * heightToWidthRatio;

		sprite.width = absoluteWidth;
		sprite.height = absoluteHeight;
	};

	this.onPress = function(callback) {
		if (typeof callback !== 'function') {
			return;
		}
		onPressCallback = callback;
	};
}

export default UISprite;
