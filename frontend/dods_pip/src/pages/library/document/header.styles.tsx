import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

export const header = styled.header`
  display: flex;
  justify-content: space-between;
`;

export const actionsSection = styled.section`
  width: 350px;
  text-align: right;
`;

export const heading = styled.h1`
  color: ${color.theme.blue};
  font-family: 'Libre Baskerville';
  font-size: 48px;
  font-weight: 400;
  line-height: 56px;
  margin-top: ${spacing(6)};
  margin-bottom: ${spacing(8)};
`;

export const infoRow = styled.div`
  color: ${color.base.greyDark};
  font-size: 16px;
  margin-bottom: 55px;
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
  display: inline-block;
  vertical-align: middle;
`;

export const editLink = styled.a`
  color: ${color.base.white};
  background: ${color.theme.blueMid};
  display: inline-flex;
  align-items: center;
  gap: ${spacing(3)};
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  padding: 0 ${spacing(4)};
  height: 40px;
`;
