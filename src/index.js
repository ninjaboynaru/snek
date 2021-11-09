import world from './world/world';
import spawnTiles from './spawnTiles';
import player from './player';

document.addEventListener('DOMContentLoaded', async() => {
	world.init();
	await spawnTiles();
	player.init();
});
