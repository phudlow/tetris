const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const args = require('minimist')(process.argv.slice(2));
const devMode = args.mode === 'development';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const common = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: devMode ? '[name].js' : '[name].[contenthash].js'
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, use: 'babel-loader' }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ],
    watchOptions: {
        ignored: ['node_modules']
    }
};

const development = {
    // devtool: 'inline-source-map', // replace with 'eval-source-map', if build times become too long
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist'
    },
    // plugins: [ new webpack.HotModuleReplacementPlugin() ]
};

const production = {};

module.exports = merge(common, devMode ? development : production);
