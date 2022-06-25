const webpack = require("webpack");
const path = require("path");
const config = {
  entry: ["webpack-hot-middleware/client", "./src/index_dev.js"],
  mode: "development",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "public"),
    filename: "bundled.js",
  },
  devtool: "source-map",
  stats:{
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass")
            },
          }
        ],
      },
      {
        test: /\.(woff2?|ttf|otf|eot|svg)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
      }
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

module.exports = config;
