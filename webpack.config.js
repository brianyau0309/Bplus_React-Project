const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, 'src/App.jsx'),
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.jsx$/,
                use: [{ loader: 'babel-loader',
                        options: { presets: ['@babel/preset-react'] }
                }]
        }]
    },
    devtool: 'source-map'
}
