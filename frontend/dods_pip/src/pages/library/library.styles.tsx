import { input } from '@dods-ui/components/_form/InputBase/InputBase.styles';
import media from '@dods-ui/globals/media';
import styled from 'styled-components';

import {
  childrenContainer,
  container as facetContainer,
  header as facetContainerHeader,
} from '../../components/FacetContainer/FacetContainer.styles';
import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const filtersContent = styled.div`
  width: 350px;
  margin-left: ${spacing(8)};
  text-align: center;
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

export const pagination = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div span {
    cursor: pointer;
    margin-left: ${spacing(6)};
  }
`;

export const searchResult = styled.div`
  width: 100%;
  padding-bottom: ${spacing(16)};

}

  h2 {
    color: ${color.theme.blue};
    margin-bottom: ${spacing(3)};
    font-weight: 700;
    margin-left: ${spacing(4)};
  }

  Box {
    padding: ${spacing(5)};
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

export const contentPreview = styled.div`
  position: relative;
  width: 100%;
  max-height: 75px;
  overflow: hidden;
`;

export const contentSourceText = styled.div`
  margin-left: ${spacing(2)};
  color: ${color.theme.blue};
`;

export const boxContent = styled.div`
  margin: 0 10px;
`;

export const bottomRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${spacing(3)};
  color: ${color.theme.blue};
  margin-bottom: ${spacing(3)};
`;

export const tagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${spacing(1)};
  margin-top: ${spacing(6)};
  color: ${color.theme.blue};
  max-width: 80%;

  div {
    margin: 1px;
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

export const topRow = styled.div`
  color: ${color.theme.blue};
  width: 100%;
  span {
    width: 100%;
    div {
      width: 100%;

      h2 {
        max-width: 85%;
      }
    }
  }

  span {
    display: flex;
    flex-direction: row;
    p {
      color: ${color.base.greyDark};
      margin: 22px 2px;
      min-width: 180px;
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

export const readMoreLink = styled.a`
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  color: ${color.theme.blue};
  padding-right: 20px;
  position: absolute;
  right: 20px;
  bottom: 25px;

  > div {
    position: absolute;
    right: 0;
    top: 5px;
  }
`;
