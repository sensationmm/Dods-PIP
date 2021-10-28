import { generateMedia } from 'styled-media-query';

export const dimensions = {
  xsm: 360,
  sm: 540,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920,
};

export const breakpoints = {
  mobileOrTablet: `(max-width: ${dimensions.md}px)`,
};

const media = generateMedia({
  xsm: `${dimensions.xsm}px`,
  sm: `${dimensions.sm}px`,
  md: `${dimensions.md}px`,
  lg: `${dimensions.lg}px`,
  xl: `${dimensions.xl}px`,
  xxl: `${dimensions.xxl}px`,
});

export default media;
