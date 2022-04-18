module.exports = {
	devServer: {
		proxy: {
			"apiPath": {
				target: "http://192.168.0.143:8080",
				changeOrigin: true,
				pathRewrite: {
					"^/apiPath": "/",
				}
			},
		}
	}
};
