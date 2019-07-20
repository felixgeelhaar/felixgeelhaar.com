const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const modeConfig = env => require(`./config/webpack.${env}`)(env)

module.exports = ({mode, presets} = {mode: 'production', presets: []}) => {
  return webpackMerge(
    {
      mode,
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
      },
      resolve: {
        extensions: ['.js', '.jsx', '.css'],
      },
      module: {
        rules: [
          {test: /jpe?g$/, use: ['url-loader']},
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({title: 'Felix Geelhaar'}),
        new webpack.ProgressPlugin(),
      ],
    },
    modeConfig(mode),
  )
}
