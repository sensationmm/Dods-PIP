import styled from 'styled-components';

import { secondary, wrapper as btnWrapper } from '../../components/Button/Button.styles';
import { pages } from '../../components/Pagination/Pagination.styles';
import {
  content as sectionContent,
  header as sectionHeader,
  headerContent as sectionHeaderContent,
} from '../../components/SectionAccordion/SectionAccordion.styles';
import color from '../../globals/color';
import dropShadow from '../../globals/elevation';
import spacing from '../../globals/spacing';

export const sumWrapper = styled.div`
  border: 1px solid ${color.base.greyLight};
  border-radius: ${spacing(2)};
  box-shadow: ${dropShadow.dropShadow1};
  background-color: ${color.base.white};

  ${sectionHeader} {
    padding: ${spacing(8)};
  }

  ${sectionHeaderContent} {
    width: 100%;
  }

  ${sectionContent} {
    padding-top: ${spacing(4)};
  }

  a {
    font-family: 'OpenSans', sans-serif;
    color: ${color.theme.blueLight};

    &:focus,
    &:hover {
      color: ${color.theme.blueMid};
      text-decoration: none;
    }
  }
`;

export const sectionCustomHeader = styled.div`
  display: flex;
  align-items: center;

  ${btnWrapper} {
    margin-left: auto;
    margin-right: ${spacing(8)};
  }

  ${secondary} {
    border-color: ${color.base.greyLight};
    border-radius: ${spacing(2)};
    box-shadow: ${dropShadow.dropShadow1};
  }
`;

export const badgeContainer = styled.div`
  display: flex;
  margin-left: ${spacing(12)};

  > div {
    margin-right: ${spacing(10)};

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const sumIconTitle = styled.div`
  display: flex;
  align-items: center;
  min-width: ${spacing(75)};

  > div {
    margin-right: ${spacing(3)};

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const sumAvatarName = styled.div`
  display: flex;
  justify-content: flex-start;

  > div {
    margin-right: ${spacing(3)};
  }
`;

export const sumUserNav = styled.div`
  padding: ${spacing(5)} ${spacing(8)};
  position: relative;

  ${pages} {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

type SumAccountWrapperProps = {
  padded?: boolean;
};
export const sumAccountWrapper = styled.div<SumAccountWrapperProps>`
  display: flex;
  align-items: flex-start;
  background-color: transparent;
  padding: ${({ padded = true }) => (padded ? `0 ${spacing(8)}` : `0`)};

  > div {
    &:last-child {
      margin-left: auto;
    }
  }
`;

export const sumAccountContent = styled.div`
  background-color: transparent;

  > div {
    display: flex;

    p {
      margin-bottom: ${spacing(4)};

      &:first-child {
        min-width: ${spacing(40)};
      }
    }

    &:last-child {
      p {
        margin-bottom: 0;
      }
    }
  }
`;

export const sumAccountContentDetails = styled.div`
  max-width: ${spacing(154)};
`;

export const sumAccountContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing(8)} ${spacing(24)};

  p {
    margin-bottom: ${spacing(2)};
  }
`;

export const sumAccountContentNotes = styled.div`
  margin-bottom: ${spacing(10)};

  p {
    &:first-child {
      margin-bottom: ${spacing(3)};
    }
  }
`;

export const sumUUIDContainer = styled.div`
  display: flex;

  p {
    &:first-child {
      margin-right: ${spacing(3)};
    }
  }
`;

export const sumConsultantAvatar = styled.div`
  display: flex;

  > div {
    &:first-child {
      margin-right: ${spacing(3)};
    }
  }
`;

export const sumConsultantContact = styled.div`
  span {
    display: inline-block;
    margin-right: ${spacing(6)};
    min-width: ${spacing(17)};
  }
`;

export const loader = styled.div`
  position: relative;
  width: 100%;
  height: 100px;
  margin-bottom: ${spacing(12)};
`;

export const footerPagination = styled.div`
  margin-top: ${spacing(10)};
  margin-bottom: ${spacing(4)};
  padding-right: ${spacing(10)};
  padding-left: ${spacing(10)};
  position: relative;

  ${pages} {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`;
