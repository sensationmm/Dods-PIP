export const parameters = {
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
        width: 'calc(100vw - 4rem)',
        height: 'calc(100vh - 4rem)',
        padding: '1rem',
        background: 'white',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Story />
    </div>
  ),
];
