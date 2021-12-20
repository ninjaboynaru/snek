import { Application, Container } from 'pixi.js';
import config from '../config';
import Vector2 from '../vector2';

export default new function world() {
	const entities = [];
	let app;
	const entityContainer = new Container();
	const uiContainer = new Container();

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

		app.stage.addChild(entityContainer, uiContainer);

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

	this.registerUIElement = function registerUIElement(sprite) {
		uiContainer.addChild(sprite);
	};

	this.removeUIElement = function removeUIElement(sprite) {
		uiContainer.removeChild(sprite);
	};

	this.registerEntity = function registerEntity(entity, entitySprite) {
		entityContainer.addChild(entitySprite);
		entities.push(entity);
	};

	this.removeEntity = function removeEntity(entity, entitySprite) {
		const entityIndex = entities.indexOf(entity);
		if (entityIndex === -1) {
			return;
		}

		entityContainer.removeChild(entitySprite);
		entities.splice(entityIndex, 1);
	};

	this.getEntitiesAtPosition = function getEntitiesAtPosition(position, tagFilters) {
		const entitiesAtPos = [];

		for (const entity of entities) {
			const entityPosition = entity.getPosition();
			if (entityPosition.x === position.x && entityPosition.y === position.y) {
				if (tagFilters) {
					if (tagFilters.includes(entity.tag)) {
						entitiesAtPos.push(entity);
					}
				}
				else {
					return entitiesAtPos.push(entity);
				}
			}
		}

		return entitiesAtPos;
	};
}();
