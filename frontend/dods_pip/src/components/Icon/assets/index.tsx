import Add from './icon-add.svg';
import Alert from './icon-alert.svg';
import ArrowDown from './icon-arrowDown.svg';
import Avatar from './icon-avatar.svg';
import AzFilter from './icon-azFilter.svg';
import Bin from './icon-bin.svg';
import Building from './icon-building.svg';
import Calendar from './icon-calendar.svg';
import Checklist from './icon-checklist.svg';
import ChecklistBold from './icon-checklistBold.svg';
import ChevronDown from './icon-chevronDown.svg';
import ChevronDownBold from './icon-chevronDownBold.svg';
import ChevronLeft from './icon-chevronLeft.svg';
import ChevronLeftBold from './icon-chevronLeftBold.svg';
import ChevronRight from './icon-chevronRight.svg';
import ChevronRightBold from './icon-chevronRightBold.svg';
import ChevronUp from './icon-chevronUp.svg';
import ChevronUpBold from './icon-chevronUpBold.svg';
import Clock from './icon-clock.svg';
import Copy from './icon-copy.svg';
import Cross from './icon-cross.svg';
import CrossBold from './icon-crossBold.svg';
import Disk from './icon-disk.svg';
import Document from './icon-document.svg';
import Edit from './icon-edit.svg';
import Exit from './icon-exit.svg';
import Grid from './icon-grid.svg';
import Hide from './icon-hide.svg';
import Info from './icon-info.svg';
import Issue from './icon-issue.svg';
import List from './icon-list.svg';
import Lock from './icon-lock.svg';
import Mail from './icon-mail.svg';
import MailBold from './icon-mailBold.svg';
import Menu from './icon-menu.svg';
import Minus from './icon-minus.svg';
import Pencil from './icon-pencil.svg';
import Person from './icon-person.svg';
import Phone from './icon-phone.svg';
import PhoneBold from './icon-phoneBold.svg';
import Refresh from './icon-refresh.svg';
import Search from './icon-search.svg';
import SearchBold from './icon-searchBold.svg';
import Show from './icon-show.svg';
import Subscription from './icon-subscription.svg';
import Suitcase from './icon-suitcase.svg';
import Tag from './icon-tag.svg';
import Tick from './icon-tick.svg';
import TickBold from './icon-tickBold.svg';
import Users from './icon-users.svg';

type TypeIconLibrary = {
  [key in Icons]: string;
};

export enum Icons {
  Add = 'Add',
  Alert = 'Alert',
  ArrowDown = 'ArrowDown',
  Avatar = 'Avatar',
  AzFilter = 'AzFilter',
  Bin = 'Bin',
  Building = 'Building',
  Calendar = 'Calendar',
  Checklist = 'Checklist',
  ChecklistBold = 'ChecklistBold',
  ChevronDown = 'ChevronDown',
  ChevronDownBold = 'ChevronDownBold',
  ChevronLeft = 'ChevronLeft',
  ChevronLeftBold = 'ChevronLeftBold',
  ChevronRight = 'ChevronRight',
  ChevronRightBold = 'ChevronRightBold',
  ChevronUp = 'ChevronUp',
  ChevronUpBold = 'ChevronUpBold',
  Clock = 'Clock',
  Copy = 'Copy',
  Cross = 'Cross',
  CrossBold = 'CrossBold',
  Disk = 'Disk',
  Document = 'Document',
  Edit = 'Edit',
  Exit = 'Exit',
  Grid = 'Grid',
  Hide = 'Hide',
  Info = 'Info',
  Issue = 'Issue',
  List = 'List',
  Lock = 'Lock',
  Mail = 'Mail',
  MailBold = 'MailBold',
  Menu = 'Menu',
  Minus = 'Minus',
  Pencil = 'Pencil',
  Person = 'Person',
  Phone = 'Phone',
  PhoneBold = 'PhoneBold',
  Refresh = 'Refresh',
  Search = 'Search',
  SearchBold = 'SearchBold',
  Show = 'Show',
  Subscription = 'Subscription',
  Suitcase = 'Suitcase',
  Tag = 'Tag',
  Tick = 'Tick',
  TickBold = 'TickBold',
  Users = 'Users',
}

export type IconType = keyof typeof Icons;

const IconLibrary = {
  Add,
  Alert,
  ArrowDown,
  Avatar,
  AzFilter,
  Bin,
  Building,
  Calendar,
  Checklist,
  ChecklistBold,
  ChevronDown,
  ChevronDownBold,
  ChevronLeft,
  ChevronLeftBold,
  ChevronRight,
  ChevronRightBold,
  ChevronUp,
  ChevronUpBold,
  Clock,
  Copy,
  Cross,
  CrossBold,
  Disk,
  Document,
  Edit,
  Exit,
  Grid,
  Hide,
  Info,
  Issue,
  List,
  Lock,
  Mail,
  MailBold,
  Menu,
  Minus,
  Pencil,
  Person,
  Phone,
  PhoneBold,
  Refresh,
  Search,
  SearchBold,
  Show,
  Subscription,
  Suitcase,
  Tag,
  Tick,
  TickBold,
  Users,
} as TypeIconLibrary;

export default IconLibrary;
