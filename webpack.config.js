const path = require('path');

module.exports = {
  entry: {
    'editorjs-bundle': './assets/src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'assets/javascripts'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}; 