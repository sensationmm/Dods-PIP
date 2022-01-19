import styled from 'styled-components';
import color from '../../globals/color';
import spacing from '../../globals/spacing';
import { input } from '@dods-ui/components/_form/InputBase/InputBase.styles';

export const filtersContent = styled.div`
  width: 350px;
  margin-left: 30px;
  text-align: center;
`;

export const contentWrapper = styled.div`
  display: flex;
  flex-basis: 0;
  @media (max-width: 599px) {
    flex-direction: column-reverse;
    width: 100%;
    ${filtersContent} {
      margin: 0 0 24px;
      width: 100%;
    }
  }
  aside {
    width: 372px;
    @media (max-width: 599px) {
      width: 100%;
      padding: 0;
    }
  }
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
    margin-left: 25px;
  }
`;

export const searchResult = styled.div`
  width: 100%;
  padding-bottom: 64px;

}

  h2 {
    color: ${color.theme.blue};
    margin-bottom: 10px;
    font-weight: 700;
    margin-left: 15px;
  }

  Box {
    padding: 20px;
  }
`;

export const fade = styled.div`
  position: absolute;
  bottom: 0px;

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
  padding-bottom: 15px;
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

  a {
    position: absolute;
    bottom: ${spacing(6)};
    right ${spacing(6)};
  }
`;

export const tagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${spacing(6)};
  color: ${color.theme.blue};
  max-width: 80%;

  div {
    margin: 1px;
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
  padding-bottom: 16px;
  border-bottom: 1px solid ${color.base.greyLight};
  ${input} {
    width: 629px;
    @media (max-width: 599px) {
      width: 100%;
    }
  }
  section {
    width: 908px;
    @media (max-width: 599px) {
      width: 100%;
    }
  }
  aside {
    width: 350px;
    display: flex;
    justify-content: flex-end;
    padding-top: 24px;
    @media (max-width: 599px) {
      display: none;
    }
  }
`;
