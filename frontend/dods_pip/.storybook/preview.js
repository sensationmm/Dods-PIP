import GlobalFonts from '../src/globals/fonts';

export const parameters = {
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#fff',
      },
      {
        name: 'DODs dark background',
        value: '#122035',
      },
    ],
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
};

export const decorators = [
  (Story) => (
    <div
      style={{
        position: 'relative',
        width: 'calc(100vw - 2rem)',
        minHeight: 'calc(100vh - 2rem)',
        padding: '1rem',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll',
      }}
    >
      <GlobalFonts />
      <Story />
    </div>
  ),
];
