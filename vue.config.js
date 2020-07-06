module.exports = {
  assetsDir: 'static',
  outputDir: 'dist',
  devServer: {
    proxy: {
      '^/*': {
        target: 'http://127.0.0.1:8000/json',
      },
    },
  },
};
