import { Loader, Sprite, Text, TextStyle } from 'pixi.js';
import world from './world/world';
import config from './config';
import Vector2 from './vector2';
import { positionWorldPercent } from './util';
import { EVENT, store } from './store';

const menuBackgroundPath = 'graphics/ui/menu_background.png';
const mainHeaderPath = 'graphics/ui/main_header.png';
const gameOverHeaderPath = 'graphics/ui/game_over_header.png';
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

function UIText({ content = '' } = {}) {
	const text = new Text(content, new TextStyle({
		fontFamily: 'consolas',
		fontSize: 12,
		fontWeight: 'bold',
		fill: '#000000'
	}));

	text.resolution = 2;
	world.registerUIElement(text);

	this.setPosition = function setPosition(position) {
		const absolutePosition = positionWorldPercent(position);
		text.position.set(absolutePosition.x, absolutePosition.y);
	};

	this.setAnchor = function setAnchor(anchor) {
		text.anchor.set(anchor.x, anchor.y);
	};

	this.setStyle = function setStyle(styleObject) {
		for (const key in styleObject) {
			text.style[key] = styleObject[key];
		}
	};

	this.setContent = function setContent(textContent) {
		text.text = textContent;
	};

	this.show = function show() {
		text.visible = true;
	};

	this.hide = function hide() {
		text.visible = false;
	};

	this.prepDelete = function prepDelete() {
		world.removeUIElement(text);
	};
}

export default new function ui() {
	const loader = new Loader();

	function buildStartMenu(_, resources) {
		const mainHeader = new UIElement({ texture: resources[mainHeaderPath].texture });
		const gameOverHeader = new UIElement({ texture: resources[gameOverHeaderPath].texture });
		const startBtn = new UIElement({ texture: resources[startButtonPath].texture, hoverTexture: resources[startButtonPressedPath].texture });
		const restartBtn = new UIElement({ texture: resources[restartButtonPath].texture, hoverTexture: resources[restartButtonPressedPath].texture });
		const regenBtn = new UIElement({ texture: resources[regenButtonPath].texture, hoverTexture: resources[regenButtonPressedPath].texture });
		const scoreText = new UIText();

		startBtn.setWidth(0.2);
		restartBtn.setWidth(0.2);
		regenBtn.setWidth(0.2);
		scoreText.setAnchor(new Vector2({ x: 1, y: 0 }));

		scoreText.setStyle({
			fontSize: 24,
			fontWeight: 'bold',
			fill: '#ebcf32',
			stroke: '#000000',
			strokeThickness: 1,
			dropShadow: true,
			dropShadowColor: '#000000',
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6

		});

		mainHeader.setPosition(new Vector2({ x: 0.5, y: 0.43 }));
		gameOverHeader.setPosition(new Vector2({ x: 0.5, y: 0.4 }));
		startBtn.setPosition(new Vector2({ x: 0.5, y: 0.5 }));
		restartBtn.setPosition(new Vector2({ x: 0.5, y: 0.5 }));
		regenBtn.setPosition(new Vector2({ x: 0.5, y: 0.55 }));
		scoreText.setPosition(new Vector2({ x: 1, y: 0 }));

		restartBtn.hide();
		gameOverHeader.hide();

		startBtn.onPress(() => {
			mainHeader.hide();
			startBtn.hide();
			regenBtn.hide();
			store.fire(EVENT.START);
		});

		restartBtn.onPress(() => {
			gameOverHeader.hide();
			restartBtn.hide();
			regenBtn.hide();
			store.fire(EVENT.START);
		});

		regenBtn.onPress(() => {
			store.fire(EVENT.REGEN);
		});

		store.on(EVENT.START, () => {
			scoreText.setContent('Score: 0');
		});

		store.on(EVENT.SCORE, ({ score }) => {
			scoreText.setContent(`Score: ${score}`);
		});

		store.on(EVENT.GAME_OVER, () => {
			gameOverHeader.show();
			restartBtn.show();
			regenBtn.show();
		});
	}

	this.init = function init() {
		loader.add([
			menuBackgroundPath,
			mainHeaderPath,
			gameOverHeaderPath,
			startButtonPath,
			startButtonPressedPath,
			restartButtonPath,
			restartButtonPressedPath,
			regenButtonPath,
			regenButtonPressedPath
		]).load(buildStartMenu);
	};
}();
