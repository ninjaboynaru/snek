const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

const mode = (process.env.ENV === 'production' ? 'production' : 'development');
const devmodePlugin = new webpack.DefinePlugin({
	'process.DEV_MODE': (process.env.DEV_MODE === 'true' ? true : false)
})

module.exports = {
	mode,
	devtool: 'eval-source-map',
	entry: path.join(__dirname, 'src/index.js'),
	plugins: [devmodePlugin],
	output: {
		path: path.join(__dirname, 'docs'),
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