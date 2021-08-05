import styled from 'styled-components';
import color from '../../../globals/color';
import spacing from '../../../globals/spacing';
import { wrapper as Columns } from '../Columns/Columns.styles';

export const wrapper = styled.div`
  position: relative;
  display: block;
  width: 100%;

  &.welcome {
    background: linear-gradient(
      180deg,
      ${color.base.white} 0%,
      ${color.base.white} 38%,
      ${color.shadow.grey} 38%,
      ${color.shadow.grey} 100%
    );

    ${Columns} {
      > *:first-child {
        margin-bottom: ${spacing(20)};
      }

      > *:last-child {
        padding-top: ${spacing(15)};
      }
    }
  }

  @media (min-width: 600px) {
    &.welcome {
      background: linear-gradient(
        90deg,
        ${color.base.white} 0%,
        ${color.base.white} 50%,
        ${color.shadow.grey} 50%,
        ${color.shadow.grey} 100%
      );

      ${Columns} {
        > *:first-child {
          margin-bottom: 0;
        }

        > *:last-child {
          padding-top: 0;
        }
      }
    }
  }
`;

export const panel = styled.div`
  position: relative;
  z-index: 2;
  padding: ${spacing(3)} ${spacing(3)};
  max-width: 1024px;
  margin: 0 auto;

  &.padded {
    padding: ${spacing(16)} ${spacing(3)};
  }
`;

export const leaves = styled.div`
  position: absolute;
  z-index: 1;
  top: 38%;
  left: 0;
  width: 100%;
  max-height: 62%;
  overflow: hidden;

  #desktop {
    display: none;
  }
  #mobile {
    display: block;
  }

  svg {
    width: 100%;
  }

  @media (min-width: 600px) {
    top: ${spacing(6)};
    width: 50%;
    left: calc(50% - 90px);
    max-height: calc(100% - ${spacing(6)});

    #desktop {
      display: block;
    }
    #mobile {
      display: none;
    }
  }
`;
