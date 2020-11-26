const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const util = require("./util");
const tsConfig = require("../../tsconfig.json");

module.exports = {
  entry: {
    main: util.getEntryMain(),
  },
  output: {
    filename: "uni-http.js",
    path: util.getOutputPath(tsConfig),
    library: "uniHttp",
    libraryTarget: "umd",
    globalObject: "this",
  },
  rules: [
    {
      test: /\.tsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "ts-loader",
      },
    },
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  // 优化: https://webpack.js.org/configuration/optimization/
  optimization: {},

  // 插件: https://webpack.js.org/configuration/plugins/#plugins
  plugins: [new CleanWebpackPlugin()],

  // 实验性支持: https://webpack.js.org/configuration/experiments/
  experiments: {
    topLevelAwait: true,
  },
};
