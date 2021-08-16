import { createGlobalStyle } from 'styled-components';

import LibreBaskerville from '../assets/fonts/LibreBaskerville-Regular.ttf';
import OpenSansBold from '../assets/fonts/OpenSans-Bold.ttf';
import OpenSans from '../assets/fonts/OpenSans-Regular.ttf';

export default createGlobalStyle`
  @font-face {
    font-family: 'Libre Baskerville';
    src: local('Libre Baskerville'), local('LibreBaskerville'),
    url(${LibreBaskerville}) format('truetype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sans';
    src: local('Open Sans'), local('OpenSans'),
    url(${OpenSans}) format('truetype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sans Bold';
    src: local('Open Sans Bold'), local('OpenSansBold'),
    url(${OpenSansBold}) format('truetype');
    font-weight: 500;
    font-style: normal;
  }
`;
