const path = require('path');
const slsw = require('serverless-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',//slsw.lib.webpack.isLocal ? 'eval-cheap-module-source-map' : 'source-map',
  resolve: {
    extensions: ['.mjs', '.json', '.ts', '.yml','.handlebars'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
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
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
            path.resolve(__dirname, 'images'),
            path.resolve(__dirname, 'scripts'),
            path.resolve(__dirname, 'coverage')
          ]
        ],
        options: {
          transpileOnly: false,
          experimentalWatchApi: false,
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/openApi.yml", to: 'src/openApi.yml' },
        { from: "src/handlers/processImmediateAlert/template.handlebars", to: 'src/handlers/processImmediateAlert/template.handlebars' },
        { from: "src/handlers/processAlert/template.handlebars", to: 'src/handlers/processAlert/template.handlebars' }
      ],
    })
  ],
  node:{
    __dirname:true
  }
};
