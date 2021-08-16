import classNames from 'classnames';
import * as React from 'react';
import { StyledComponent } from 'styled-components';

import colorPalette from '../../globals/color';
import * as Styled from './Text.styles';

type CoreTextStyles = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'label' | 'span';

type TextStyles = CoreTextStyles | 'body' | 'bodySmall' | 'bodyLarge' | 'labelSmall';

export interface TextProps {
  children?: React.ReactNode;
  type?: TextStyles;
  color?: string;
  bold?: boolean;
  uppercase?: boolean;
  center?: boolean;
  htmlFor?: string;
}

const Text: React.FC<TextProps> = ({
  children,
  type = 'body',
  color = colorPalette.theme.blue,
  bold = false,
  uppercase = false,
  center = false,
  htmlFor,
}) => {
  let element: StyledComponent<CoreTextStyles, Record<string, unknown>>;
  let className = '';
  switch (type) {
    case 'body':
    case 'bodySmall':
    case 'bodyLarge':
      element = Styled.p;
      className = type;
      break;
    case 'labelSmall':
      element = Styled.label;
      className = type;
      break;
    default:
      element = Styled[type];
  }

  const props = {
    className: classNames(className, { bold: bold }),
    'data-test': 'component-text',
    htmlFor: htmlFor,
  };

  return React.createElement(
    element,
    {
      ...props,
      style: {
        color: color,
        textAlign: center ? 'center' : 'left',
        textTransform: uppercase ? 'uppercase' : 'none',
      },
    },
    children,
  );
};

export default Text;
