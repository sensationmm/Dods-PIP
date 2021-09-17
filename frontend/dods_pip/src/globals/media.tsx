import { generateMedia } from 'styled-media-query';

export const breakpoints = {
  sm: 360,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920,
};

const media = generateMedia({
  sm: `${breakpoints.sm}px`,
  md: `${breakpoints.md}px`,
  lg: `${breakpoints.lg}px`,
  xl: `${breakpoints.xl}px`,
  xxl: `${breakpoints.xxl}px`,
});

export default media;
