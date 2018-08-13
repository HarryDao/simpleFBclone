const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: ['babel-polyfill', './app/index.js'],
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /.(png|jp(e*)g|gif|mp4)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: 'app/index.html'
        }),
        new CleanWebpackPlugin('dist'),
        new UglifyJsPlugin({
            sourceMap: false,
        }),
        new Webpack.LoaderOptionsPlugin({
            minimize: true,
        }), 
    ],
}