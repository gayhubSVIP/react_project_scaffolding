var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');

var AUTOPREFIXER_BROWSERS = [
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 35',
    'Firefox >= 31',
    'Explorer >= 9',
    'iOS >= 7',
    'Opera >= 12',
    'Safari >= 7.1'
];

var NODE_ENV = process.env.NODE_ENV;
var IS_BUILD = (NODE_ENV === 'production' || NODE_ENV === 'test');
var filename = 'assets/[name].js?' + (IS_BUILD ? '[chunkHash:8]' : '[hash:8]');

module.exports = {
    entry: {
        vendor: ['react', 'react-dom', 'react-router', 'mobx', 'mobx-react'],
        app: ['./src/index']
    },
    output: {
        publicPath: '',
        filename: filename,
        chunkFilename: filename,
        path: path.resolve(__dirname, './dist')
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                enforce: 'pre'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'react-hot-loader!babel-loader'
            },
            {
                test: /\.css$/,
                loader: (IS_BUILD ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader!postcss-loader'
                    }) : 'style-loader!css-loader!postcss-loader')
            },
            {
                test: /\.scss$/,
                loader: (IS_BUILD ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader!postcss-loader!sass-loader'
                    }) : 'style-loader!css-loader!postcss-loader!sass-loader')
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader?limit=8192&name=assets/[name].[ext]?[hash:8]'
            }
        ]
    },
    devtool: IS_BUILD ? false : 'cheap-module-eval-source-map',
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChuncks: Infinity
        }),
        new ExtractTextPlugin("assets/[name].css?[contentHash:8]"),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/views/index.html',
            inject: true,
            hash: false
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer({ browsers: AUTOPREFIXER_BROWSERS })]
            }
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        })
      ].concat(IS_BUILD ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ] : [
            new CopyWebpackPlugin([
                { from: './src/static', to: './' },
                { from: './src/json', to: './json' }
            ])
        ]),
    resolve: {
        extensions: ['*', '.js', '.jsx']
    }
};
