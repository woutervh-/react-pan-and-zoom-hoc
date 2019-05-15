const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './examples/main.js',
    output: {
        filename: './dist/bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'react-pan-and-zoom-hoc examples'
        })
    ]
};
