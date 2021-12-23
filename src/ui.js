import { Loader, Sprite } from 'pixi.js';
import world from './world/world';
import config from './config';
import Vector2 from './vector2';
import { EVENT, store } from './store';

const menuBackgroundPath = 'graphics/ui/menu_background.png';
const startButtonPath = 'graphics/ui/start_btn/start_btn.png';
const startButtonPressedPath = 'graphics/ui/start_btn/start_btn_pressed.png';
const restartButtonPath = 'graphics/ui/restart_btn/restart_btn.png';
const restartButtonPressedPath = 'graphics/ui/restart_btn/restart_btn_pressed.png';
const regenButtonPath = 'graphics/ui/regen_btn/regen_btn.png';
const regenButtonPressedPath = 'graphics/ui/regen_btn/regen_btn_pressed.png';

function UIElement({ texture, pressedTexture, hoverTexture } = {}) {
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

	this.getSprite = function getSprite() {
		return sprite;
	};

	this.show = function show() {
		sprite.visible = true;
	};

	this.hide = function hide() {
		sprite.visible = false;
	};

	this.setPosition = function setPosition(position) {
		const absolutePosition = new Vector2({
			x: config.pixelWorldSize.x * position.x,
			y: config.pixelWorldSize.y * position.y
		});

		sprite.position.set(absolutePosition.x, absolutePosition.y);
	};

	this.setWidth = function setWidth(width) {
		const absoluteWidth = config.pixelWorldSize.x * width;
		const absoluteHeight = absoluteWidth * heightToWidthRatio;

		sprite.width = absoluteWidth;
		sprite.height = absoluteHeight;
	};

	this.addChild = function addChild(uiElement) {
		const childSprite = uiElement.getSprite();
		if (childSprite.parent) {
			childSprite.parent.removeChild(childSprite);
		}

		sprite.addChild(childSprite);
	};

	this.onPress = function(callback) {
		if (typeof callback !== 'function') {
			return;
		}
		onPressCallback = callback;
	};
}

export default new function ui() {
	const loader = new Loader();

	function buildStartMenu(_, resources) {
		const startBtn = new UIElement({ texture: resources[startButtonPath].texture, hoverTexture: resources[startButtonPressedPath].texture });
		const restartBtn = new UIElement({ texture: resources[restartButtonPath].texture, hoverTexture: resources[restartButtonPressedPath].texture });
		const regenBtn = new UIElement({ texture: resources[regenButtonPath].texture, hoverTexture: resources[regenButtonPressedPath].texture });

		startBtn.setWidth(0.2);
		restartBtn.setWidth(0.2);
		regenBtn.setWidth(0.2);

		startBtn.setPosition(new Vector2({ x: 0.5, y: 0.5 }));
		restartBtn.setPosition(new Vector2({ x: 0.5, y: 0.5 }));
		regenBtn.setPosition(new Vector2({ x: 0.5, y: 0.55 }));

		restartBtn.hide();

		startBtn.onPress(() => {
			startBtn.hide();
			regenBtn.hide();
			store.fire(EVENT.START);
		});

		restartBtn.onPress(() => {
			restartBtn.hide();
			regenBtn.hide();
			store.fire(EVENT.START);
		});

		regenBtn.onPress(() => {
			store.fire(EVENT.REGEN);
		});

		store.on(EVENT.GAME_OVER, () => {
			restartBtn.show();
			regenBtn.show();
		});
	}

	this.init = function init() {
		loader.add([
			menuBackgroundPath,
			startButtonPath,
			startButtonPressedPath,
			restartButtonPath,
			restartButtonPressedPath,
			regenButtonPath,
			regenButtonPressedPath
		]).load(buildStartMenu);
	};
}();
