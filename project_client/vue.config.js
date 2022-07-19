module.exports = {
  css: {
    loaderOptions: {
      less: {}
    }
  },
  outputDir: "../project_server/dist",
	devServer: {
    // development server port 8000
    port: 8001,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
}