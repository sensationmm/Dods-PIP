import { create } from '@storybook/theming';
import Logo from '../src/assets/logo-white-dods-pip.png';
import color from '../src/globals/color';

export default create({
  appBg: color.theme.blue,
  appContentBg: color.base.grey,
  appBorderRadius: 4,
  brandTitle: 'Dods PIP Components',
  brandImage: Logo,
});
