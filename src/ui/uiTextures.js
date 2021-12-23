import { Loader } from 'pixi.js';

export default new function uiTextures() {
	const loader = new Loader();

	loader
	.add('menuBackground', 'graphics/ui/menu_background.png')
	.add('mainHeader', 'graphics/ui/main_header.png')
	.add('gameOverHeader', 'graphics/ui/game_over_header.png')
	.add('startButton', 'graphics/ui/start_btn/start_btn.png')
	.add('startButtonPressed', 'graphics/ui/start_btn/start_btn_pressed.png')
	.add('restartButton', 'graphics/ui/restart_btn/restart_btn.png')
	.add('restartButtonPressed', 'graphics/ui/restart_btn/restart_btn_pressed.png')
	.add('regenButton', 'graphics/ui/regen_btn/regen_btn.png')
	.add('regenButtonPressed', 'graphics/ui/regen_btn/regen_btn_pressed.png');

	this.load = function load() {
		return new Promise((resolve) => {
			loader.load(() => {
				resolve();
			});
		});
	};

	this.get = function get(textureKey) {
		return loader.resources[textureKey].texture;
	};
}();
