const webpack = require('webpack');
const path = require('path');

const DEV = path.resolve(__dirname, '../lib');
const OUTPUT = path.resolve(__dirname, '../out');

module.exports = env => ({
  context: DEV,
  entry: {
    index: './index.jsx',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].bundle.js',
    path: OUTPUT,
  },
  module: {
    loaders: [{
      include: [DEV],
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
  ],
  target: 'electron',
});

