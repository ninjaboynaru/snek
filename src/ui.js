import { Loader, Sprite } from 'pixi.js';
import world from './world/world';
import config from './config';
import Vector2 from './vector2';
import { EVENT, store } from './store';

const menuBackgroundPath = 'graphics/ui/menu_background.png';
const startButtonPath = 'graphics/ui/start_btn/start_btn.png';
const startButtonPressedPath = 'graphics/ui/start_btn/start_btn_pressed.png';
const regenButtonPath = 'graphics/ui/regen_btn/regen_btn.png';
const regenButtonPressedPath = 'graphics/ui/regen_btn/regen_btn_pressed.png';

function UIElement({ texture, pressedTexture } = {}) {
	const sprite = Sprite.from(texture);
	const heightToWidthRatio = texture.height / texture.width;
	let onPressCallback;

	sprite.anchor.set(0.5);
	world.registerUIElement(sprite);

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

	function pointerDown() {
		sprite.texture = pressedTexture;
		if (typeof onPressCallback === 'function') {
			onPressCallback();
		}
	}

	function pointerUp() {
		sprite.texture = texture;
	}

	this.onPress = function(callback) {
		sprite.interactive = true;
		sprite.buttonMode = true;
		onPressCallback = callback;

		sprite.on('pointerdown', pointerDown);
		sprite.on('pointerup', pointerUp);
	};
}

export default new function ui() {
	const startMenu = { startBtn: null, regenBtn: null };
	const loader = new Loader();

	function buildStartMenu(_, resources) {
		const startBtn = new UIElement({ texture: resources[startButtonPath].texture, pressedTexture: resources[startButtonPressedPath].texture });
		const regenBtn = new UIElement({ texture: resources[regenButtonPath].texture, pressedTexture: resources[regenButtonPressedPath].texture });

		startBtn.setWidth(0.2);
		regenBtn.setWidth(0.2);

		startBtn.setPosition(new Vector2({ x: 0.5, y: 0.5 }));
		regenBtn.setPosition(new Vector2({ x: 0.5, y: 0.55 }));

		startBtn.onPress(() => {
			startBtn.hide();
			regenBtn.hide();
			store.fire(EVENT.START);
		});

		regenBtn.onPress(() => {
			store.fire(EVENT.REGEN);
		});

		startMenu.startBtn = startBtn;
		startMenu.regenBtn = regenBtn;
	}

	this.init = function init() {
		loader.add([
			menuBackgroundPath,
			startButtonPath,
			startButtonPressedPath,
			regenButtonPath,
			regenButtonPressedPath
		]).load(buildStartMenu);
	};
}();
