import { input } from '@dods-ui/components/_form/InputBase/InputBase.styles';
import { dropdownItem, select } from '@dods-ui/components/_form/Select/Select.styles';
import { panel } from '@dods-ui/components/_layout/Panel/Panel.styles';
import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import { input } from '@dods-ui/components/_form/InputBase/InputBase.styles';
import media from '@dods-ui/globals/media';
import styled from 'styled-components';

import { contentWrapper as chipsWrapper } from '../../components/Chips/Chips.styles';
import {
  childrenContainer,
  container as facetContainer,
  header as facetContainerHeader,
} from '../../components/FacetContainer/FacetContainer.styles';
import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const pageLibrary = styled.div`
  @media (max-width: 599px) {
    ${panel} {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
`;

export const filtersContent = styled.div`
  width: 350px;
  margin-left: ${spacing(8)};
  text-align: center;
`;

export const contentWrapper = styled.div`
  display: flex;
  flex-basis: 0;
  ${media.lessThan('sm')`
    flex-direction: column-reverse;
    width: 100%;
    ${filtersContent} {
      margin: 0 0 ${spacing(6)};
      width: 100%;
    }
    ${facetContainer} {
      margin-bottom: ${spacing(4)};
    }
    & > ${facetContainer} {
      & > ${facetContainerHeader} {
        border-bottom: 0;
      }
      & > ${childrenContainer} {
        padding: 0 ${spacing(4)} ${spacing(4)};
      }
    }
  `};
  ${filtersContent} {
    width: 372px;
    ${media.lessThan('sm')`
      width: 100%;
      padding: 0;
    `};
  }
  ${media.greaterThan('sm')`
    & > ${facetContainer} {
      background: transparent;
      width: auto;
      box-shadow: none;
      border: 0;
      & > ${facetContainerHeader} {
        display: none;
      }
      & > ${childrenContainer} {
        padding: 0;
      }
    }
  `};
`;

export const resultsContent = styled.section`
  flex: 1;
`;

export const filtersTag = styled.div`
  display: flex;
  justify-content: center;

  div {
    margin: 5px 0;
  }
`;

export const fade = styled.div`
  position: absolute;
  bottom: 0;

  display: block;

  width: 100%;
  height: 50px;

  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.9) 100%
  );
`;

export const contentSource = styled.div`
  display: flex;
  align-items: center;
  color: ${color.theme.blue};
  padding-bottom: ${spacing(4)};
`;

export const searchResult = styled.div`
  width: 100%;
  padding-bottom: 16px;

  ${chipsWrapper} {
    font-weight: normal;
    overflow: hidden;
  }

  ${contentSource} {
    padding-bottom: 0;
  }
`;

export const searchResultHeader = styled.div`
  display: flex;
`;

export const searchResultHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: stretch;
  h2 {
    margin: 0 0 5px;
    color: ${color.theme.blue};
    font-weight: 700;
    font-family: 'Open Sans Bold', sans-serif;
    font-style: normal;
    font-size: 18px;
    line-height: 24px;
    display: flex;
    align-items: center;
  }
`;

export const contentPreview = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  padding: 16px 4px 0;
  * {
    font-family: 'Open Sans', sans-serif !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 12px !important;
    line-height: 16px !important;
    display: inline !important;
    margin-right: 6px !important;
    margin-left: 0 !important;
  }
`;

export const contentSourceText = styled.div`
  margin-left: ${spacing(2)};
  color: ${color.theme.blue};
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
`;

export const boxContent = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const bottomRow = styled.div`
  padding-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  color: ${color.theme.blue};
  a {
    position: absolute;
    bottom: ${spacing(6)};
    right ${spacing(6)};
  }
  @media (max-width: 599px) {
    flex-direction: column;
  }
`;

export const tagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  color: ${color.theme.blue};
  max-width: 446px;
  width: 75%;
  height: 32px;
  overflow: hidden;
  align-items: center;
  @media (max-width: 599px) {
    max-width: 70%;
  }

  div {
    margin: 1px;
  }
`;

export const date = styled.p`
  color: ${color.base.greyDark};
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  margin: 6px 0 auto auto;
  padding-left: 16px;
  display: flex;
  align-self: flex-end;
`;

export const topRow = styled.div`
  color: ${color.theme.blue};
  width: 100%;
  display: flex;
  .mobileOnly {
    display: none;
  }
  @media (max-width: 599px) {
    flex-direction: column;
    ${date} {
      display: none;
    }
    .mobileOnly {
      display: flex;
      align-self: flex-start;
      margin: ${spacing(1)} 0 ${spacing(2)};
      padding: 0;
    }
  }
  span {
    width: 100%;
    display: flex;
    div {
      width: 100%;
    }
  }
`;

export const imageContainer = styled.span`
  width: 75px !important;
  height: 55px;
  margin-top: 20px;

  img {
    border-radius: 10px;
  }
`;

export const librarySearchWrapper = styled.div`
  display: flex;
  padding-bottom: ${spacing(4)};
  border-bottom: 1px solid ${color.base.greyLight};
  ${input} {
    width: 629px;
    ${media.lessThan('sm')`
      width: 100%;
    `};
  }
  section {
    width: 908px;
    ${media.lessThan('sm')`
      width: 100%;
    `};
  }
  aside {
    width: 350px;
    display: flex;
    justify-content: flex-end;
    padding-top: ${spacing(6)};
    ${media.lessThan('sm')`
      display: none;
    `};
  }
`;

export const readMore = styled.div`
  display: flex;
  margin: auto 0 auto auto;
  @media (max-width: 599px) {
    margin: ${spacing(4)} 0 0 ${spacing(2)};
  }
  div {
    display: flex;
    align-items: center;
    width: 93px;
    justify-content: space-between;
  }
  span {
    font-family: 'Open Sans Bold', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 13px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 1px;
    color: ${color.theme.blue};
    text-decoration: none;
  }
`;

export const pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: ${spacing(3)};
  line-height: ${spacing(4)};
  color: ${color.base.grey};

  .pageCount {
    margin-left: ${spacing(4)};
  }

  b {
    color: ${color.theme.blueMid};
  }

  ${select} {
    width: auto;
    margin-left: ${spacing(3)};

    ${input} {
      display: block;
      font-family: 'Open Sans Bold', sans-serif;
      font-weight: normal;
      width: ${spacing(20)};
      border-radius: 4px;
      font-size: 12px;
    }

    ${dropdownItem} {
      font-size: 12px;
    }

    ${Icon} {
      width: 12px;
    }
    svg {
      width: 12px;
    }
  }
`;

export const totalRecords = styled.span`
  margin-left: ${spacing(7)};
`;

export const perPageSelect = styled.div`
  display: flex;
  align-items: center;
  ${select} {
    #itemPerPage {
      width: 75px;
      padding-right: ${spacing(8)};
    }
  }
`;

export const paginationControls = styled.div`
  display: flex;
  align-items: center;
  .pageArrow {
    margin-right: ${spacing(7)};
  }
  ${select} {
    margin: 0 ${spacing(2)};
  }
  b {
    margin: 0 ${spacing(7)} 0 ${spacing(2)};
  }
`;
