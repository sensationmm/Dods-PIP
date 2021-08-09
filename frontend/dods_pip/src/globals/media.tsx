export const breakpoints = {
  sm: 360,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920,
};

const mediaQueries = (key: keyof typeof breakpoints) => {
  return (style: any) => `@media (min-width: ${breakpoints[key]}px) { ${style} }`;
};

export default mediaQueries;
