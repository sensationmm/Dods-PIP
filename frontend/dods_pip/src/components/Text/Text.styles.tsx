import styled from 'styled-components';
import mediaQueries from '../../globals/media';

export const h1 = styled.h1`
  font-family: 'Libre Baskerville';
  font-size: 64px;
  line-height: 80px;
  padding: 0;
  margin: 0;

  ${mediaQueries('md')`
    font-size: 58px;
  `}

  ${mediaQueries('xl')`
    font-size: 74px;
  `}

  ${mediaQueries('xxl')`
    font-size: 80px;
  `}
`;

export const h2 = styled.h2`
  font-family: 'Libre Baskerville';
  font-size: 34px;
  line-height: 64px;
  padding: 0;
  margin: 0;

  ${mediaQueries('md')`
    font-size: 42px;
  `}

  ${mediaQueries('lg')`
    font-size: 52px;
  `}

  ${mediaQueries('xl')`
    font-size: 64px;
  `}
`;

export const h3 = styled.h3`
  font-family: 'Libre Baskerville';
  font-size: 32px;
  line-height: 48px;
  padding: 0;
  margin: 0;

  ${mediaQueries('md')`
    font-size: 38px;
  `}

  ${mediaQueries('lg')`
    font-size: 48px;
  `}
`;

export const h4 = styled.h4`
  font-family: 'Libre Baskerville';
  font-size: 24px;
  line-height: 32px;
  padding: 0;
  margin: 0;

  ${mediaQueries('lg')`
    font-size: 32px;
  `}
`;

export const h5 = styled.h5`
  font-family: 'Libre Baskerville';
  font-size: 18px;
  line-height: 24px;
  padding: 0;
  margin: 0;

  ${mediaQueries('lg')`
    font-size: 24px;
  `}
`;

export const h6 = styled.h6`
  font-family: 'Libre Baskerville';
  font-size: 14px;
  line-height: 18px;
  padding: 0;
  margin: 0;

  ${mediaQueries('lg')`
    font-size: 18px;
  `}
`;

export const p = styled.p`
  font-family: 'Open Sans';
  padding: 0;
  margin: 0;

  &.bold {
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

export const body = styled.p``;
export const bodySmall = styled.p``;
export const bodyLarge = styled.p``;

export const label = styled.label`
  font-family: 'Open Sans Bold';
  font-size: 10px;
  line-height: 12px;
  padding: 0;
  margin: 0;
`;

export const span = styled.span`
  font-family: 'Open Sans';
  display: block;
  font-size: 12px;
  padding: 0;
  margin: 0;
`;
