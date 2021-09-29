const path = require('path');

module.exports = {
	env: {
		'browser': true,
	},
	extends: [
		'airbnb-base',
		path.resolve(__dirname, 'linting/.eslintrc-chox.js'),
		path.resolve(__dirname, 'linting/.eslintrc-import.js'),
	],
}
