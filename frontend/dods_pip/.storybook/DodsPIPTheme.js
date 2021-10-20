import { create } from '@storybook/theming';
import Logo from '../src/assets/images/logo-white-dods-pip.png';
import color from '../src/globals/color';

export default create({
  textColor: 'white',
  appBg: color.theme.blue,
  appContentBg: 'white',
  appBorderRadius: 2,
  brandTitle: 'Dods PIP Components',
  brandImage: Logo,
});
