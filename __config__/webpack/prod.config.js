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
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          format: {
            comments: /(\s*#if)|(\s*#end)/i,
          },
        },
        extractComments: (astNode, comment) => {
          // 处理#ifdef注释
          if (/#if/.test(comment.value.trim())) {
            const comments = astNode.start.comments_before.slice(
              1,
              astNode.start.comments_before.length - 1
            );

            let data = "";
            comments.forEach((t) => (data += "\r\n" + t.value));
            comment.value += "\r\n" + data;
          }

          return false;
        },
      }),
    ],
  },
  plugins: [...shared.plugins],
  output: shared.output,
  experiments: shared.experiments,
};
