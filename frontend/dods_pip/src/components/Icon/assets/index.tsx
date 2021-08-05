import IconCross from './icon-cross.svg';
import IconTick from './icon-tick.svg';
import IconTickBold from './icon-tickBold.svg';
import IconSearch from './icon-search.svg';
import IconShow from './icon-show.svg';
import IconHide from './icon-hide.svg';
import IconCalendar from './icon-calendar.svg';
import IconAdd from './icon-add.svg';

type TypeIconLibrary = {
  [key in Icons]: string;
};

export enum Icons {
  IconCalendar = 'IconCalendar',
  IconCross = 'IconCross',
  IconHide = 'IconHide',
  IconSearch = 'IconSearch',
  IconShow = 'IconShow',
  IconTick = 'IconTick',
  IconTickBold = 'IconTickBold',
  IconAdd = 'IconAdd',
}

const IconLibrary = {
  IconCalendar,
  IconCross,
  IconHide,
  IconSearch,
  IconShow,
  IconTick,
  IconTickBold,
  IconAdd,
} as TypeIconLibrary;

export default IconLibrary;
