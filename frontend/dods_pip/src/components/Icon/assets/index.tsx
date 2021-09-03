import IconAdd from './icon-add.svg';
import IconAvatar from './icon-avatar.svg';
import IconAzFilter from './icon-azFilter.svg';
import IconCalendar from './icon-calendar.svg';
import IconChevronLeft from './icon-chevronLeft.svg';
import IconChevronRight from './icon-chevronRight.svg';
import IconCross from './icon-cross.svg';
import IconHide from './icon-hide.svg';
import IconSearch from './icon-search.svg';
import IconShow from './icon-show.svg';
import IconTick from './icon-tick.svg';
import IconTickBold from './icon-tickBold.svg';

type TypeIconLibrary = {
  [key in Icons]: string;
};

export enum Icons {
  IconAdd = 'IconAdd',
  IconAvatar = 'IconAvatar',
  IconAzFilter = 'IconAzFilter',
  IconCalendar = 'IconCalendar',
  IconChevronLeft = 'IconChevronLeft',
  IconChevronRight = 'IconChevronRight',
  IconCross = 'IconCross',
  IconHide = 'IconHide',
  IconSearch = 'IconSearch',
  IconShow = 'IconShow',
  IconTick = 'IconTick',
  IconTickBold = 'IconTickBold',
}

const IconLibrary = {
  IconAdd,
  IconAvatar,
  IconAzFilter,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCross,
  IconHide,
  IconSearch,
  IconShow,
  IconTick,
  IconTickBold,
} as TypeIconLibrary;

export default IconLibrary;
