import { Text, TextStyle } from 'pixi.js';
import world from '../world/world';
import { positionWorldPercent } from '../util';

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

export default UIText;
