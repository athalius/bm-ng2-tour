'use strict';

let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  rules: [
    {
      test: /\.ts$/,
      use: ['awesome-typescript-loader', 'angular2-template-loader']
    },
    {
      test: /\.html$/,
      use: 'raw-loader'
    },
    {
      test: /\.css$/,
      include: path.resolve(process.cwd(), 'src', 'lib'),
      loaders: ['to-string-loader', 'css-loader']
    },
    {
      test: /\.css$/,
      exclude: [path.resolve(process.cwd(), 'src', 'demo'), path.resolve(process.cwd(), 'src', 'lib')],
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader'
      })
    },
    {
      test: /\.scss$/,
      include: path.resolve(process.cwd(), 'src', 'lib'),
      exclude: /node_modules/,
      loaders: ['raw-loader', 'sass-loader'] // sass-loader not scss-loader
    },

    {
      test: /initial\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader!sass-loader?sourceMap'
      })
    },
  ]
};
