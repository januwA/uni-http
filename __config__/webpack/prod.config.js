process.env.NODE_ENV = "production";
const TerserJSPlugin = require("terser-webpack-plugin");
const shared = require("./shared");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: shared.entry,
  module: {
    rules: shared.rules,
  },
  resolve: shared.resolve,
  optimization: {
    minimizer: [new TerserJSPlugin({})],
  },
  plugins: [...shared.plugins],
  output: shared.output,
  experiments: shared.experiments,
};
