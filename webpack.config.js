const webpack = require('webpack');
const path = require("path");

module.exports = {
  entry: "./public/js/src/main.js",
  mode: 'development',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/js/build"),
  },
  resolve: {
    fallback: {
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/'),
      domain: require.resolve('domain-browser'),
      stream: require.resolve('stream-browserify'),
      'process/browser': require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]
};
