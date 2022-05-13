module.exports = {
	publicPath: './',
	assetsDir: 'static-PC',
	indexPath: 'index.html', 
	outputDir: 'dist',
	devServer: {
		proxy: {
			"apiPath": {
				//target: "http://192.168.0.143:8080",
				target: "https://csg.cipfs.cn",
				changeOrigin: true,
				pathRewrite: {
					"^/apiPath": "/",
				}
			},
		}
	}
};
