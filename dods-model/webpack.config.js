// Generated using webpack-cli https://github.com/webpack/webpack-cli

const glob = require('glob');
const path = require("path");
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const modelsEntry = glob.sync('./src/db/models/**.ts').reduce(function (obj, el) {
  obj[`models/${path.parse(el).name}`] = el;
  return obj;
}, {});

const migrationsEntry = glob.sync('./src/db/migrations/**.ts').reduce(function (obj, el) {
  obj[`migrations/${path.parse(el).name}`] = el;
  return obj;
}, {});

const seedersEntry = glob.sync('./src/db/seeders/**.ts').reduce(function (obj, el) {
  obj[`seeders/${path.parse(el).name}`] = el;
  return obj;
}, {});

const entry = {
  "index": "./index.ts",
  "config/index": {
    import: './src/db/config/index.ts',
    library: {
      type: 'commonjs2',
      export: 'default',
    }
  },
  ...modelsEntry,
  ...migrationsEntry,
  ...seedersEntry
};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  // devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  // devtool: '(none)',
  entry,
  output: {
    libraryTarget: 'commonjs2',
    // libraryExport: 'default',
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js',
    // sourceMapFilename: 'index.js.map',
    clean: true,
  },
  target: 'node',
  externals: [nodeExternals(), 'pg', 'mysql', 'mariadb', 'sqlite3', 'tedious', 'pg-hstore'],
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "package.json" },
        { from: "package-lock.json" },
        { from: ".sequelizerc" },
        // { from: ".env" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: /(node_modules|build)/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
