import world from './world/world';
import ui from './ui';
import tiles from './tiles';
import player from './player';
import collectables from './collectables';
import { EVENT, store } from './store';

document.addEventListener('DOMContentLoaded', async() => {
	world.init();
	ui.init();
	await tiles.init();

	store.on(EVENT.START, async() => {
		player.spawn();
		collectables.spawnCoins();
	});

	store.on(EVENT.REGEN, () => {
		tiles.regen();
	});
});
