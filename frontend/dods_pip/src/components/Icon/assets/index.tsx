import Add from './icon-add.svg';
import Alert from './icon-alert.svg';
import Avatar from './icon-avatar.svg';
import AzFilter from './icon-azFilter.svg';
import Calendar from './icon-calendar.svg';
import ChevronDown from './icon-chevronDown.svg';
import ChevronLeft from './icon-chevronLeft.svg';
import ChevronRight from './icon-chevronRight.svg';
import ChevronUp from './icon-chevronUp.svg';
import Cross from './icon-cross.svg';
import CrossBold from './icon-crossBold.svg';
import Grid from './icon-grid.svg';
import Hide from './icon-hide.svg';
import Info from './icon-info.svg';
import Issue from './icon-issue.svg';
import Minus from './icon-minus.svg';
import Person from './icon-person.svg';
import Search from './icon-search.svg';
import Show from './icon-show.svg';
import Subscription from './icon-subscription.svg';
import Suitcase from './icon-suitcase.svg';
import Tick from './icon-tick.svg';
import TickBold from './icon-tickBold.svg';

type TypeIconLibrary = {
  [key in Icons]: string;
};

export enum Icons {
  Add = 'Add',
  Alert = 'Alert',
  Avatar = 'Avatar',
  AzFilter = 'AzFilter',
  Calendar = 'Calendar',
  ChevronDown = 'ChevronDown',
  ChevronLeft = 'ChevronLeft',
  ChevronRight = 'ChevronRight',
  ChevronUp = 'ChevronUp',
  Cross = 'Cross',
  CrossBold = 'CrossBold',
  Grid = 'Grid',
  Hide = 'Hide',
  Info = 'Info',
  Issue = 'Issue',
  Minus = 'Minus',
  Person = 'Person',
  Search = 'Search',
  Show = 'Show',
  Subscription = 'Subscription',
  Suitcase = 'Suitcase',
  Tick = 'Tick',
  TickBold = 'TickBold',
}

export type IconType = keyof typeof Icons;

const IconLibrary = {
  Add,
  Alert,
  Avatar,
  AzFilter,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cross,
  CrossBold,
  Grid,
  Hide,
  Info,
  Issue,
  Minus,
  Person,
  Search,
  Show,
  Subscription,
  Suitcase,
  Tick,
  TickBold,
} as TypeIconLibrary;

export default IconLibrary;
