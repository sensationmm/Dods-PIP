import styled from 'styled-components';

import media from '../../globals/media';

export const heading = styled.span`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Libre Baskerville';
    padding: 0;
    margin: 0;
  }

  .heroExtraLarge {
    font-size: 64px;
    line-height: 64px;

    ${media.greaterThan('md')`
    font-size: 58px;    
    line-height: 58px;
  `}

    ${media.greaterThan('xl')`
    font-size: 74px;    
    line-height: 74px;
  `}

  ${media.greaterThan('xxl')`
    font-size: 80px;    
    line-height: 80px;
  `}
  }

  .heroLarge {
    font-size: 34px;
    line-height: 34px;

    ${media.greaterThan('md')`
    font-size: 42px;
    line-height: 42px;
  `}

    ${media.greaterThan('lg')`
    font-size: 52px;
    line-height: 52px;
  `}

  ${media.greaterThan('xl')`
    font-size: 64px;
    line-height: 64px;
  `}
  }

  .hero {
    font-size: 32px;
    line-height: 32px;

    ${media.greaterThan('md')`
    font-size: 38px;
    line-height: 38px;
  `}

    ${media.greaterThan('lg')`
    font-size: 48px;
    line-height: 48px;
  `}
  }

  .titleLarge {
    font-size: 24px;
    line-height: 24px;

    ${media.greaterThan('lg')`
    font-size: 32px;
    line-height: 32px;
  `}
  }

  .title {
    font-size: 18px;
    line-height: 18px;

    ${media.greaterThan('lg')`
    font-size: 24px;
    line-height: 24px;
  `}
  }

  .titleSmall {
    font-size: 14px;
    line-height: 14px;

    ${media.greaterThan('lg')`
    font-size: 18px;
    line-height: 18px;
  `}
  }
`;

export const p = styled.p`
  font-family: 'Open Sans';
  padding: 0;
  margin: 0;

  &.bold,
  bold,
  strong {
    font-family: 'Open Sans Bold';
  }

  &.body {
    font-size: 16px;
    line-height: 20px;
  }

  &.bodySmall {
    font-size: 12px;
    line-height: 16px;
  }

  &.bodyLarge {
    font-size: 18px;
    line-height: 24px;
  }
`;

export const li = styled.li`
  font-family: 'Open Sans';
  padding: 0;
  margin: 0;
  font-size: 16px;
  line-height: 20px;

  &.bold,
  bold,
  strong {
    font-family: 'Open Sans Bold';
  }

  &.liSmall {
    font-size: 12px;
    line-height: 16px;
  }

  &.liLarge {
    font-size: 18px;
    line-height: 24px;
  }
`;

export const h1 = styled.h1``;
export const h2 = styled.h2``;
export const h3 = styled.h3``;
export const h4 = styled.h4``;
export const h5 = styled.h5``;
export const h6 = styled.h6``;
export const body = styled.p``;
export const bodySmall = styled.p``;
export const bodyLarge = styled.p``;
export const liSmall = styled.li``;
export const liLarge = styled.li``;

export const label = styled.label`
  font-family: 'Open Sans';
  font-size: 16px;
  line-height: 16px;
  padding: 0;
  margin: 0;

  &.labelSmall {
    font-size: 12px;
    letter-spacing: 1px;
    line-height: auto;
  }

  &.bold,
  bold,
  strong {
    font-family: 'Open Sans Bold';
  }
`;

export const span = styled.span`
  font-family: 'Open Sans';
  display: block;
  font-size: 12px;
  padding: 0;
  margin: 0;

  &.bold,
  bold,
  strong {
    font-family: 'Open Sans Bold';
  }

  &.headerTitle {
    font-family: 'Libre Baskerville';
    font-size: 24px;
  }
`;
