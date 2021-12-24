import Vector2 from '../vector2';
import { EVENT, store } from '../store';
import uiTextures from './uiTextures';
import UISprite from './uiSprite';
import UIText from './uiText';

export default new function ui() {
	const elements = {
		mainHeader: null,
		gameOverHeader: null,
		startBtn: null,
		restartBtn: null,
		regenBtn: null,
		scoreText: null
	};

	function buildUI() {
		elements.mainHeader = new UISprite({ texture: uiTextures.get('mainHeader') });
		elements.gameOverHeader = new UISprite({ texture: uiTextures.get('gameOverHeader') });
		elements.startBtn = new UISprite({ texture: uiTextures.get('startButton'), hoverTexture: uiTextures.get('startButtonPressed') });
		elements.restartBtn = new UISprite({ texture: uiTextures.get('restartButton'), hoverTexture: uiTextures.get('restartButtonPressed') });
		elements.regenBtn = new UISprite({ texture: uiTextures.get('regenButton'), hoverTexture: uiTextures.get('regenButtonPressed') });
		elements.scoreText = new UIText();
	}

	function configureUI() {
		elements.startBtn.setWidth(0.2);
		elements.restartBtn.setWidth(0.2);
		elements.regenBtn.setWidth(0.2);
		elements.scoreText.setAnchor(new Vector2({ x: 1, y: 0 }));

		elements.mainHeader.setPosition(new Vector2({ x: 0.5, y: 0.43 }));
		elements.gameOverHeader.setPosition(new Vector2({ x: 0.5, y: 0.4 }));
		elements.startBtn.setPosition(new Vector2({ x: 0.5, y: 0.5 }));
		elements.restartBtn.setPosition(new Vector2({ x: 0.5, y: 0.5 }));
		elements.regenBtn.setPosition(new Vector2({ x: 0.5, y: 0.55 }));
		elements.scoreText.setPosition(new Vector2({ x: 1, y: 0 }));

		elements.scoreText.setStyle({
			fontSize: 14,
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
	}

	function configureUIInteraction() {
		elements.restartBtn.hide();
		elements.gameOverHeader.hide();

		elements.startBtn.onPress(() => {
			elements.mainHeader.hide();
			elements.startBtn.hide();
			elements.regenBtn.hide();
			store.fire(EVENT.START);
		});

		elements.restartBtn.onPress(() => {
			elements.gameOverHeader.hide();
			elements.restartBtn.hide();
			elements.regenBtn.hide();
			store.fire(EVENT.START);
		});

		elements.regenBtn.onPress(() => {
			store.fire(EVENT.REGEN);
		});

		store.on(EVENT.START, () => {
			elements.scoreText.setContent('Score: 0');
		});

		store.on(EVENT.SCORE, ({ score }) => {
			elements.scoreText.setContent(`Score: ${score}`);
		});

		store.on(EVENT.GAME_OVER, () => {
			elements.gameOverHeader.show();
			elements.restartBtn.show();
			elements.regenBtn.show();
		});
	}

	this.init = async function init() {
		await uiTextures.load();
		buildUI();
		configureUI();
		configureUIInteraction();
	};
}();
