const path = require('path');

module.exports = {
    entry: './src/root.js',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { presets: ['env', 'react'] },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static'),
    },
};
