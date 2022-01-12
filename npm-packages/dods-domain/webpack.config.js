const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  mode: 'production',
  devtool: 'source-map',
  entry: {
    index: './index.ts'
  },
  resolve: {
    extensions: ['.mjs', '.json', '.ts', '.yml'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
    clean: true,
  },
  target: 'node',
  externals: [nodeExternals()],
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.webpack')
          ]
        ],
        options: {
          transpileOnly: false,
          experimentalWatchApi: false,
        }
      }
    ]
  },
  plugins: [],
};