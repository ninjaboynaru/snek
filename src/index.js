import world from './world/world';
import ui from './ui';
import tiles from './tiles';
import player from './player';
import collectables from './collectables';
import store from './store';

document.addEventListener('DOMContentLoaded', async() => {
	world.init();
	ui.init();
	await tiles.init();

	store.onGameStart(async() => {
		player.init();
		collectables.spawnCoins();
	});

	store.onMapRegen(() => {
		tiles.regen();
	});
});
