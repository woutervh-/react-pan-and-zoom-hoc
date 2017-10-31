import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: './examples/main.js',
    output: {
        filename: './dist/bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'react-pan-and-zoom-hoc examples'
        }),
    ]
};
