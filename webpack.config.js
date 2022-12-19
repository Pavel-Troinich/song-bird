const path = require('path')

module.exports = {
  entry: {
    main: path.resolve(__dirname, './song-bird/src/js/index.js'),
  },
  module: {
    rules: [
      {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './song-bird/dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
}