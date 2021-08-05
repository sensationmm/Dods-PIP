module.exports = {
  stories: ['*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-controls', '@storybook/addon-links', '@storybook/addon-essentials'],

  webpackFinal: async (config, { configType }) => {
    // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));
    fileLoaderRule.exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.svg$/,
      enforce: 'pre',
      loader: require.resolve('svg-react-loader'),
    });

    return config;
  },
};
