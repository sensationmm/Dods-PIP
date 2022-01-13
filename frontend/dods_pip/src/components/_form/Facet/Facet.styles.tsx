import styled from 'styled-components';

import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import spacing from '../../../globals/spacing';
import { hexAToRGBA } from '../../../utils/color';
import elevation from "@dods-ui/globals/elevation";

type FacetProps = {
  disabled: boolean;
};

export const facet = styled.div<FacetProps>`
  display: flex;
  
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

export const facetToggleWrap = styled.div`
`;

export const facetToggle = styled.a`
  margin-right: 12px;
  display: flex;
  align-items: center;
  svg {
    color: ${color.base.greyDark};
    font-weight: bold;
    width: 12px;
  }
`;

export const facetLayout = styled.div`
  display: flex;
  flex-direction: column;
  background: ${color.base.white};
  border: 1px solid ${color.base.greyLight};
  border-radius: ${spacing(2)};
  box-shadow: ${elevation.dropShadowBoxComponent};
  box-sizing: border-box;
  width: 350px;
`;

type FacetToggleProps = {
  // darkMode?: boolean;
};

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
`;

export const facetViewMoreBtn = styled.button`
  display: flex;
  justify-content: space-between;
  width: 82px;
  font-size: 12px;
  border: 0;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  color: ${color.theme.blue};
  font-weight: bold;
`;
