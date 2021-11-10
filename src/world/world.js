import { Application } from 'pixi.js';
import config from '../config';
import Vector2 from '../vector2';

export default new function world() {
	let app;
	this.worldSize = new Vector2({
		x: Math.floor(config.pixelWorldSize.x / config.pixelBlockSize.x),
		y: Math.floor(config.pixelWorldSize.y / config.pixelBlockSize.y)
	});

	this.init = function entity() {
		app = new Application({
			width: config.pixelWorldSize.x,
			height: config.pixelWorldSize.y,
			backgroundColor: config.worldBackgroundColor,
			antialias: true
		});

		document.getElementById(config.appContainerElementID).appendChild(app.view);
	};

	this.positionInBounds = function positionInBounds(position) {
		if (position.x <= 0 || position.x >= this.worldSize.x) {
			return false;
		}

		if (position.y <= 0 || position.y >= this.worldSize.y) {
			return false;
		}

		return true;
	};

	this.renderDisplayObject = function renderDisplayObject(pixiDisplayObject) {
		app.stage.addChild(pixiDisplayObject);
	};

	this.removeDisplayObject = function removeDisplayObject(pixiDisplayObject) {
		app.stage.removeChild(pixiDisplayObject);
	};
}();
