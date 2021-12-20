export default new function store() {
	const gameStartListeners = [];
	const mapRegenListeners = [];

	this.onGameStart = function(callback) {
		if (typeof callback !== 'function') {
			return;
		}

		gameStartListeners.push(callback);
	};

	this.onMapRegen = function(callback) {
		if (typeof callback !== 'function') {
			return;
		}

		mapRegenListeners.push(callback);
	};

	this.startGame = function() {
		for (const callback of gameStartListeners) {
			callback();
		}
	};

	this.regenMap = function() {
		for (const callback of mapRegenListeners) {
			callback();
		}
	};
}();
