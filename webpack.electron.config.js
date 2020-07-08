const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  entry: ['babel-polyfill', './rodeo-de/main.js'],
  target: 'electron-main',
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //   },
      // },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader',
        },
      },
      {
        test: /\.node$/,
        use: {
          loader: "file-loader"
        }
      },
      {
        test: /\.dat$/,
        use: {
          loader: "file-loader"
        }
      }
      // {
      //   test: /\.(ts|tsx)$/,
      //   include: path.resolve(__dirname, 'src'),
      //   use: [
      //     {
      //       loader: 'awesome-typescript-loader',
      //       options: {
      //         useBabel: true,
      //         useCache: true,
      //       },
      //     },
      //   ],
      //   exclude: /node_modules/,
      // },
      // {
      //   test: /\.node$/,
      //   loader: 'awesome-node-loader',
      //   options: {
      //     name: '[name].[ext]',
      //   },
      // }
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
};