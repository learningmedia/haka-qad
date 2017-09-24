const webpack = require('webpack');
const { readFileSync } = require('fs');
const babelSettings = JSON.parse(readFileSync('.babelrc'));

const buildOptimized = process.env.BUILD_ENV === 'optimized';

module.exports = {
  entry: {
    haka: ['./app/haka']
  },
  resolve: {
    extensions: ['.js', '.html']
  },
  plugins: [
    buildOptimized ? new webpack.optimize.UglifyJsPlugin({ sourceMap: true }) : null
  ].filter(x => x),
  output: {
    library: 'Haka',
    libraryTarget: 'umd',
    path: __dirname + '/public',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.(html|js)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: babelSettings
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'svelte-loader'
    }]
  },
  devtool: buildOptimized ? 'source-map' : 'inline-source-map',
  devServer: {
    contentBase: './app'
  }
};
