const path = require('path');


module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: '/node_modules',
				loader: 'eslint-loader',
				enforce: 'pre',
				options: {
					failOnError: true,
					fix: true
				}
			}
		]
	}
}