import styled from 'styled-components';

import color from '../../globals/color';
import media from '../../globals/media';
import spacing from '../../globals/spacing';
import { panel as Panel } from '../_layout/Panel/Panel.styles';
import { Icon } from '../Icon/Icon.styles';

export const container = styled.div`
  position: relative;
  z-index: 3;

  ${Panel} {
    ${media.lessThan('md')`
      padding-top: ${spacing(10)};
      padding-bottom: ${spacing(10)};
    `}
  }
`;

export const wrapper = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column-reverse;

  > div:last-of-type {
    margin-bottom: ${spacing(8)};
  }

  ${media.greaterThan('md')`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > div:last-of-type {
      margin-bottom: 0;
    }
  `}

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;

    li {
      margin-right: ${spacing(4)};
    }
  }

  a {
    color: ${color.base.white};
    font-family: 'Open Sans';

    &:hover {
      text-decoration: none;
    }
  }
`;

export const contact = styled.div`
  display: flex;
  align-items: center;

  ${Icon} {
    margin-right: ${spacing(4)};

    ${media.lessThan('md')`
      display: none;
    `}
  }
`;

export const footerSub = styled.div`
  ${Panel} {
    padding-top: ${spacing(6)};
    padding-bottom: ${spacing(6)};
  }

  ${wrapper} {
    flex-direction: column;

    > div:last-child {
      margin-bottom: 0;
    }

    > ul:first-child {
      margin-bottom: ${spacing(8)};
    }

    ${media.greaterThan('md')`
      flex-direction: row;

      > ul, > div {
        margin-bottom: 0 !important;
      }
    `}
  }
`;

export const branding = styled.div`
  display: flex;
  position: relative;
`;

export const logo = styled.div`
  color: white;
  width: 80px;
  height: 50px;

  margin-right: ${spacing(8)};

  &:after {
    position: absolute;
    top: 0;
    left: calc(80px + ${spacing(4)});
    width: 1px;
    height: 100%;
    content: '';
    background: ${color.base.white};
  }
`;
