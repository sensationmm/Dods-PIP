module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [require.resolve('svg-react-loader')],
    });

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });

    output: {
      hashFunction: 'xxhash64';
    }

    return config;
  },
};
