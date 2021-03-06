var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	entry: {
		index: './build.js'
	},
    devtool:false,
	output: {
		path: __dirname + '/public/javascripts/',
		filename: 'build.min.js'
	},
	module: {
		loaders: [{
			test: /\.js?$/,
			loaders: ['jsx', 'babel?presets[]=react,presets[]=es2015'],
			exclude: /node_modules/
		},
		{
			test:/\.scss$/,
			loader:ExtractTextPlugin.extract('style','css!postcss!sass')
		},{
			test:/\.(png|jpg|gif)$/,
			loader:'file-loader?name=../images/[name].[ext]'
		}]
	},
	// eslint:{
	// 	configFile:'./.eslintrc.json'
	// },
	postcss:function(){
		return [require('autoprefixer'),require('precss')];
	},
	plugins:[
		new ExtractTextPlugin('../stylesheets/all.css'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
}