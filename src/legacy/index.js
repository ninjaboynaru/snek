import * as pixi from 'pixi.js';
import gameConfig from './gameConfig';
import board from './board';
import controller from './controller';

const app = new pixi.Application({
	width: gameConfig.viewWidth,
	height: gameConfig.viewHeight,
	backgroundColor: gameConfig.viewBackgroundColor,
	antialias: true
});

async function start() {
	document.getElementById('view').appendChild(app.view);
	await board.init(app);
	controller.init();
}

document.addEventListener('DOMContentLoaded', start);