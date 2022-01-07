module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    ['styled-components', { ssr: true }],
  ],
  presets: ['@babel/preset-env', '@babel/preset-react', 'next/babel'],
};
