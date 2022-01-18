import { checkbox, checkboxLabelWrapper } from '@dods-ui/components/_form/Checkbox/Checkbox.styles';
import { icon } from '@dods-ui/components/Notification/Notification.styles';
import elevation from '@dods-ui/globals/elevation';
import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

type FacetProps = {
  disabled: boolean;
  darkMode?: boolean;
};

export const facet = styled.div<FacetProps>`
  display: flex;
  margin-bottom: 8px;
  width: 100%;

  label {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }
`;

export const facetClearBtn = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  text-decoration: none;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => (props.disabled ? color.base.grey : color.theme.blueMid)};
  cursor: ${(props) => (props.disabled ? 'auto' : 'pointer')};
  width: 48px;
  svg {
    width: 11.06px;
    height: 12px;
    color: ${(props) => (props.disabled ? color.base.grey : color.theme.blueMid)};
  }
`;

export const facetToggle = styled.a`
  margin-right: 12px;
  display: flex;
  align-items: center;
  svg {
    font-weight: bold;
    width: 12px;
  }
`;

export const facetLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${color.base.white};
  border: 1px solid ${color.base.greyLight};
  border-radius: ${spacing(2)};
  box-shadow: ${elevation.dropShadowBoxComponent};
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
`;

export const facetHeader = styled.div`
  border-bottom: 1px solid ${color.base.greyLight};
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-direction: row;
  text-decoration: none;
  width: 100%;
  padding: 16px 24px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const facetCollapsiblePanel = styled.div`
  min-height: 80px;
  padding: 24px;
  transition: min-height 3000ms linear;
  .facet-checkbox {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  ${checkbox} {
    margin-bottom: 8px;
  }
  ${checkboxLabelWrapper} {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const facetViewMoreBtn = styled.button`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  border: 0;
  padding: 5px 0 0 0;
  background-color: transparent;
  cursor: pointer;
  color: ${color.theme.blueMid};
  font-weight: bold;
  font-family: 'Open Sans Bold', sans-serif;
  letter-spacing: 1px;
  align-items: center;
  width: 90px;
  ${icon} {
    width: 9px;
    margin-right: 10px;
  }
`;
