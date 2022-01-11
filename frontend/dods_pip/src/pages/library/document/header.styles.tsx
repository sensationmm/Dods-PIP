import styled from 'styled-components';

import color from '../../../globals/color';
import media from '../../../globals/media';
import spacing from '../../../globals/spacing';

const breakpoint = 'lg';

export const header = styled.header`
  ${media.greaterThan(breakpoint)`
    display: flex;
    justify-content: space-between;
    gap: ${spacing(5)};
  `}
`;

export const mainSection = styled.section`
  flex: 1;
`;

export const actionsSection = styled.section`
  width: 350px;
  text-align: right;
`;

export const h1Container = styled.div`
  margin-top: ${spacing(6)};
  margin-bottom: ${spacing(8)};
`;

export const infoRow = styled.div`
  color: ${color.base.greyDark};
  font-size: 16px;
  margin-bottom: ${spacing(8)};

  ${media.greaterThan(breakpoint)`
    margin-bottom: ${spacing(12)};
  `}
`;

export const infoItem = styled.span`
  display: block;

  label {
    display: block;
    margin: ${spacing(4)} 0 ${spacing(2)};
  }

  ${media.greaterThan(breakpoint)`
    display: inline; 

    label {
      display: none;
    }
  `}
`;

export const infoIcon = styled.span`
  > * {
    margin: 0 ${spacing(1)} 0 0;
    display: inline;
    vertical-align: middle;
  }
`;

export const infoSpacer = styled.span`
  width: 1px;
  height: 16px;
  background: ${color.base.greyDark};
  margin: 0 ${spacing(2)};
  display: none;
  vertical-align: middle;

  ${media.greaterThan(breakpoint)`
    display: inline-block;
  `}
`;

export const editLink = styled.a`
  display: none;
  color: ${color.base.white};
  background: ${color.theme.blueMid};
  align-items: center;
  gap: ${spacing(3)};
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  padding: 0 ${spacing(4)};
  height: 40px;

  ${media.greaterThan(breakpoint)`
    display: inline-flex; 
  `}
`;
