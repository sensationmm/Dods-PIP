import { wrapper as InputSearch } from '@dods-ui/components/_form/InputSearch/InputSearch.styles';
import { label as Label } from '@dods-ui/components/_form/Label/Label.styles';
import { Radio } from '@dods-ui/components/_form/Radio/Radio.styles';
import { wrapper as Avatar } from '@dods-ui/components/Avatar/Avatar.styles';
import { wrapper as Badge } from '@dods-ui/components/Badge/Badge.styles';
import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import { popoverWrapper as Popover } from '@dods-ui/components/Popover/Popover.styles';
import color from '@dods-ui/globals/color';
import media from '@dods-ui/globals/media';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const sectionHeader = styled.div`
  display: flex;
  align-items: center;

  > ${Icon}, > ${Popover}, > ${InputSearch}, > ${Avatar} {
    margin-right: ${spacing(4)};
  }

  > ${Badge} {
    margin-left: ${spacing(12)};
  }
`;

export const sectionHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: ${spacing(5)};
`;

export const actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const key = styled.div`
  color: ${color.base.white};
  padding: ${spacing(1)} ${spacing(2)};
  border-radius: 8px;
  text-transform: uppercase;
  font-family: 'Open Sans Bold';
`;

export const keyOr = styled(key)`
  background-color: ${color.theme.blueLight};
`;
export const keyAnd = styled(key)`
  background-color: ${color.alert.green};
`;
export const keyNot = styled(key)`
  background-color: ${color.theme.blueMid};
`;
export const keyKeywords = styled(key)`
  background-color: ${color.alert.orange};
`;

export const scheduleColumns = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-column-gap: ${spacing(30)};

  > div {
    position: relative;

    &:first-child::after {
      content: '';
      width: 2px;
      height: 100%;
      position: absolute;
      top: 0;
      left: calc(100% + ${spacing(15)});
      background: ${color.base.greyLight};
    }
  }

  ${media.lessThan('xl')`
    display: block;

    > div:first-child {
      margin-bottom: ${spacing(10)};

      &::after {
      content: none;
      }
    }

  `};
`;

export const schedule = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${Label} {
    margin-bottom: 0;
  }
`;

export const times = styled.div`
  background: ${color.base.white};
  border-radius: 8px;
  border: 1px solid ${color.base.greyMid};
  padding: ${spacing(8)};
`;

export const timesOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type TimeOptions = {
  active?: boolean;
};
export const time = styled.div<TimeOptions>`
  display: inline;
  padding: ${spacing(2)} ${spacing(4)};
  border: 1px solid ${color.base.greyLight};
  border-radius: 60px;
  background: ${({ active = false }) => (active ? color.theme.blueMid : color.base.ivory)};
  color: ${({ active = false }) => (active ? color.base.white : color.base.greyDark)};
  cursor: pointer;

  &:hover {
    background: ${({ active = false }) => (active ? color.theme.blueDark : color.base.greyLight)};
  }
`;

export const highlightOptions = styled.div`
  display: flex;
  align-items: center;

  > svg {
    margin-right: ${spacing(4)};
  }

  > ${Radio}:first-of-type {
    margin-right: ${spacing(10)};
  }
`;
