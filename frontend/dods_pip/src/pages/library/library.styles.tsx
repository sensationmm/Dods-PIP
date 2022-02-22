import { input } from '@dods-ui/components/_form/InputBase/InputBase.styles';
import { dropdownItem, select } from '@dods-ui/components/_form/Select/Select.styles';
import { panel } from '@dods-ui/components/_layout/Panel/Panel.styles';
import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import { IconContentSource } from '@dods-ui/components/IconContentSource/IconContentSource.styles';
import { heading } from '@dods-ui/components/Text/Text.styles';
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
  ${media.lessThan('sm')`
    ${panel} {
      padding-left: ${spacing(4)};
      padding-right: ${spacing(4)};
    }
  `}
`;

export const filtersContent = styled.div`
  margin-left: ${spacing(5)};
`;

export const contentWrapper = styled.div`
  display: flex;
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
    ${media.lessThan('sm')`
      width: 100%;
      padding: 0;
    `};
  }
  ${media.greaterThan('sm')`
    & > ${facetContainer} {
      background: transparent;
      width: 350px;
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
    margin: ${spacing(1)} 0;
  }
`;

export const contentSource = styled.div`
  display: flex;
  align-items: center;
  color: ${color.theme.blue};
  padding-bottom: ${spacing(4)};
`;

export const searchResult = styled.div`
  width: 100%;
  padding-bottom: ${spacing(4)};

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
    margin: 0 0 ${spacing(1)};
    color: ${color.theme.blue};
    font-weight: 700;
    font-family: 'Open Sans Bold', sans-serif;
    font-style: normal;
    font-size: 18px;
    line-height: ${spacing(6)};
    display: flex;
    align-items: center;
  }
`;

export const contentPreview = styled.div`
  position: relative;
  min-height: 16px;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: ${spacing(4)};
  padding: ${spacing(4)} ${spacing(1)} 0;
  * {
    font-family: 'Open Sans', sans-serif !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 12px !important;
    line-height: ${spacing(4)} !important;
    display: inline !important;
    margin-right: ${spacing(1)} !important;
    margin-left: 0 !important;
  }
  // these are needed for multi-line ellipsis
  &:before {
    content: '...';
    position: absolute;
    bottom: 0;
    right: ${spacing(3)};
    background: white;
  }
  &:after {
    content: '';
    position: absolute;
    right: ${spacing(3)}; /* note: not using bottom */
    width: 1rem;
    height: 1rem;
    background: white;
  }
`;

export const contentSourceText = styled.div`
  margin-left: ${spacing(2)};
  color: ${color.theme.blue};
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: ${spacing(4)};
`;

export const boxContent = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const bottomRow = styled.div`
  padding-top: ${spacing(4)};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  color: ${color.theme.blue};
  @media (max-width: 599px) {
    flex-direction: column;
  }
`;

export const tagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing(1)};
  color: ${color.theme.blue};
  max-width: 446px;
  width: 75%;
  height: ${spacing(8)};
  overflow: hidden;
  align-items: center;
  @media (max-width: 599px) {
    max-width: 70%;
  }

  div {
    margin: 1px;
  }
  .extraChipsCount {
    color: ${color.base.greyDark};
    font-size: 12px;
    font-family: 'Open Sans', sans-serif;
  }
`;

export const tag = styled.span`
  line-height: 32px;
  padding: 0 ${spacing(4)};
  color: ${color.theme.blue};
  background: ${color.base.white};
  border: 1px solid ${color.base.greyLight};
  border-radius: 60px;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;

  &.selectedTag {
    background: ${color.shadow.blue};
    font-weight: bold;
  }
`;

export const date = styled.p`
  color: ${color.base.greyDark};
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: ${spacing(4)};
  white-space: nowrap;
  margin: ${spacing(1)} 0 auto auto;
  padding-left: ${spacing(4)};
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
  max-width: ${spacing(10)};
  margin-right: ${spacing(4)};
  ${IconContentSource} {
    width: ${spacing(10)};
    height: ${spacing(10)};
  }
`;

export const librarySearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing(4)};
  border-bottom: 1px solid ${color.base.greyLight};
  section {
    width: 629px;
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

export const titleLink = styled.a`
  font-family: 'Open Sans Bold', sans-serif;
  text-align: center;
  color: ${color.theme.blue};
  text-decoration: none;
`;

export const readMore = styled.a`
  display: flex;
  font-family: 'Open Sans Bold', sans-serif;
  font-weight: bold;
  font-size: 12px;
  align-items: center;
  text-align: center;
  letter-spacing: 1px;
  color: ${color.theme.blue};
  text-decoration: none;
  gap: ${spacing(2)};
  ${media.lessThan('sm')`
      margin: ${spacing(5)} 0 0 ${spacing(2)};
    `};
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
    /* margin-left: ${spacing(4)}; */
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
  ${media.lessThan('md')`
    ${perPageSelect}, .itemTotal {
      display: none;
    }
  `}
`;

export const totalRecords = styled.span`
  margin-left: ${spacing(7)};
`;

export const paginationControls = styled.div`
  display: flex;
  align-items: center;
  ${media.lessThan('md')`
    width: 100%;
    justify-content: space-between;
  `}
  .paginalControlsInner {
    display: flex;
    align-items: center;
  }
  .prevPageArrow {
    margin-right: ${spacing(7)};
  }
  .prevPageArrow,
  .nextPageArrow {
    background: transparent;
    border: 0;
    cursor: pointer;
    &:disabled {
      pointer-events: none;
      svg {
        color: ${color.base.greyMid};
      }
    }
  }
  ${select} {
    margin: 0 ${spacing(2)};
  }
  b {
    margin: 0 ${spacing(7)} 0 ${spacing(2)};
  }
`;

export const noResults = styled.div`
  margin: 0 auto auto;
  flex: 4;
  display: flex;
  // using the border method below because standard css dashed border doesn't match Figma design
  // https://kovart.github.io/dashed-border-generator/
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C7C7C7' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  padding: ${spacing(17)};
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${Icon} {
    margin-left: 0;
    min-width: 30px;
    min-height: 32px;
  }
  div {
    margin-left: ${spacing(6)};
    max-width: 100%;
    overflow: hidden;
  }
  ${heading} {
    font-size: ${spacing(8)};
    line-height: ${spacing(10)};
    margin: 0;
    color: ${color.base.greyDark};
    max-width: 100%;
    white-space: nowrap;
    span {
      margin-left: ${spacing(2)};
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: ${color.theme.blue};
      display: block;
    }
  }
  p {
    margin: ${spacing(1)} 0 0;
    color: ${color.base.greyDark};
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: ${spacing(6)};
  }
`;
