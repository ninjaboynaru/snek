const EVENT = {
	START: 'START',
	REGEN: 'REGEN',
	GAME_OVER: 'GAME_OVER',
	SCORE: 'SCORE'
};

const store = new function() {
	const listeners = [];

	this.on = function on(event, callback) {
		if (typeof callback !== 'function') {
			return;
		}

		listeners.push({ event, callback });
	};

	this.fire = function fire(event, msg) {
		for (const listener of listeners) {
			if (listener.event === event) {
				listener.callback(msg);
			}
		}
	};
}();

export { EVENT, store };
