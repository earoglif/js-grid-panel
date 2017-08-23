require('babel-polyfill');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: __dirname + '/dist/js',
        filename: 'index.js'
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                }
            }
        ]
    },
    devServer: {
        contentBase: [path.join(__dirname, '/dist'), path.join(__dirname, '/node_modules')],
        compress: true,
        stats: "errors-only",
        open: true
    },
    target: 'node',
    node: {
        fs: "empty"
    }
}
