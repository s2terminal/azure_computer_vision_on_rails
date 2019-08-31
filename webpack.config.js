const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, 'app', 'assets', 'javascripts')],
        loader: 'babel-loader',
        options: {
          plugins: ['syntax-dynamic-import'],
          presets: [
            [
              '@babel/preset-env',
              { modules: false }
            ]
          ]
        },
        test: /\.js$/
      },
      {
        include: [path.resolve(__dirname, 'app', 'assets', 'javascripts')],
        loader: 'ts-loader',
        test: /\.tsx?$/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },

  entry: './app/assets/javascripts/application.ts',

  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'public', 'packs')
  },

  mode: 'development',
  devtool: '#inline-source-map',

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },
      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' webpack 1 ?
    },
    extensions: [".ts", ".tsx", ".js"]
  },

  plugins: [
    new ManifestPlugin({
      fileName: 'manifest.json',
      publicPath: '/packs/',
      writeToFileEmit: true,
    }),
  ]
};
