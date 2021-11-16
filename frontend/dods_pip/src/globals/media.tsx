import { generateMedia } from 'styled-media-query';

export type mqViewport = 'xsm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export const viewport: Record<mqViewport, number> = {
  xsm: 360,
  sm: 540,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920,
};

export const breakpoints = {
  mobileOrTablet: `(max-width: ${viewport.md}px)`,
};

const media = generateMedia({
  xsm: `${viewport.xsm}px`,
  sm: `${viewport.sm}px`,
  md: `${viewport.md}px`,
  lg: `${viewport.lg}px`,
  xl: `${viewport.xl}px`,
  xxl: `${viewport.xxl}px`,
});

export default media;
