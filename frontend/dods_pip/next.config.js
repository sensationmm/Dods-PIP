module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [require.resolve('svg-react-loader')],
    });

    return config;
  },
};
