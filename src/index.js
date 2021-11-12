import world from './world/world';
import spawnTiles from './spawnTiles';
import player from './player';
import collectables from './collectables';

document.addEventListener('DOMContentLoaded', async() => {
	world.init();
	await spawnTiles();
	player.init();
	collectables.spawnCoins();
});
