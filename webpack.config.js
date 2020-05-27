/*
 * @Author: your name
 * @Date: 2020-05-25 09:47:22
 * @LastEditTime: 2020-05-25 15:00:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ssa-watermark/webpack.config.js
 */ 
const path  = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output:{
        path: path.join(__dirname,'dist'),
        filename: 'bundle.js',
        libraryTarget: 'umd',
    },
    devtool:'source-map',
    module:{
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    devServer:{
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        host: '127.0.0.1',
        port: 8001,
        open: true
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html'
        }),
        new CleanWebpackPlugin(),
    ]
}