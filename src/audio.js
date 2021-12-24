export default new function audio() {
	this.play = function play(source) {
		new Audio(source).play();
	};
}();
