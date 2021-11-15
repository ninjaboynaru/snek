import world from './world/world';
import tiles from './tiles';
import player from './player';
import collectables from './collectables';

document.addEventListener('DOMContentLoaded', async() => {
	world.init();
	await tiles.init();
	player.init();
	collectables.spawnCoins();
});
