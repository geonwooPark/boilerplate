const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name]_[chunkhash:8].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ico|svg|mov|mp4|)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024,
          },
        },
        generator: {
          filename: "images/[name]_[contenthash:8][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: "fonts/[name]_[contenthash:8][ext]",
        },
      },
    ],
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: "./public/favicon/favicon.png",
      manifest: "./public/manifest.json",
    }),
    new HtmlWebpackPlugin({
      minify: true,
      template: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
    new CleanWebpackPlugin(),
  ],
};
