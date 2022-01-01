const webpack = require('webpack')
const path = require("path")
const vueSrc = './src'
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
var publicPath = '/'
const compressionTest = '/\.(js|css|html|ico)(\?.*)?$/i'
var optimization = {}

var plugins = [new webpack.ProvidePlugin({
            $: "jquery",  
            jQuery: "jquery" 
			})]

if(process.env.NODE_ENV === 'production'){
	plugins.push( new CompressionPlugin({
        algorithm: "gzip",
        compressionOptions: {
            numiterations: 15
        },
        minRatio: 0.80,          
    }))
		
	optimization = {
		minimize: true,
		minimizer: [new TerserPlugin({  terserOptions: {compress: true}})],
	}		
		
	publicPath = ''
}	

module.exports = {
	
    configureWebpack: {
		plugins,		
		resolve: {
			alias: {
				"@": path.resolve(__dirname, vueSrc)
			},
			extensions: ['.js', '.vue', '.json']
		},		
		optimization,
    }, 	

	publicPath,

	devServer: {
		port: 8080,
	},
	
};


