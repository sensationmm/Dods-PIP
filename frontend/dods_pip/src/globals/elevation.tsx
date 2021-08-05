import color from './color';
import { hexAToRGBA } from '../utils/color';

const dropShadow = {
  dropShadow1: `0 4px 12px ${hexAToRGBA(color.theme.blueDark, 0.12)}`,
  dropShadow2: `0 8px 24px ${hexAToRGBA(color.theme.blueDark, 0.16)}`,
};

export default dropShadow;
