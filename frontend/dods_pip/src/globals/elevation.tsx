import { hexAToRGBA } from '../utils/color';
import color from './color';

const dropShadow = {
  dropShadow1: `0 4px 12px ${hexAToRGBA(color.theme.blueDark, 0.12)}`,
  dropShadow2: `0 8px 24px ${hexAToRGBA(color.theme.blueDark, 0.16)}`,
  selectShadow: `0 7px 12px ${hexAToRGBA(color.theme.blueDark, 0.12)}`,
  notification: `0px 3px 20px ${hexAToRGBA(color.base.black, 0.4)}`,
};

export default dropShadow;
