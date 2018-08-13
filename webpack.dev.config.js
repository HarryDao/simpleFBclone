const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', './app/index.js'],
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/'
    },
    devtool: 'inline-source-map',
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
        })
    ],
    devServer: {
        host: 'localhost',
        port: 8080,
        historyApiFallback: true
    }
}