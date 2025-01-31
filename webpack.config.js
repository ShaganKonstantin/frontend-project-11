// const HtmlWebpackPlugin = require('html-webpack-plugin');

// const path = require('path');

// module.exports = {
//   mode: process.env.NODE_ENV || 'development',
//   entry: './src/js/main.js',
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   devServer: {
//     static: path.resolve(__dirname, 'dist'),
//     port: 8080,
//     hot: true,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(scss)$/,
//         use: [
//           {
//             loader: 'style-loader',
//           },
//           {
//             loader: 'css-loader',
//           },
//           {
//             loader: 'postcss-loader',
//             options: {
//               postcssOptions: {
//                 plugins: () => [
//                   require('autoprefixer'),
//                   new HtmlWebpackPlugin({ template: 'index.html' }),
//                 ],
//               },
//             },
//           },
//           {
//             loader: 'sass-loader',
//           },
//         ],
//       },
//       { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
//     ],
//   },
// };

import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/js/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  output: {
    clean: true,
  },
};
