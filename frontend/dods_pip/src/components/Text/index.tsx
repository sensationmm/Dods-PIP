import classNames from 'classnames';
import * as React from 'react';
import { StyledComponent } from 'styled-components';

import colorPalette from '../../globals/color';
import * as Styled from './Text.styles';

export type CoreTextStyles = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'label' | 'span';
export type TextStyles =
  | CoreTextStyles
  | 'body'
  | 'bodySmall'
  | 'bodyLarge'
  | 'labelSmall'
  | 'headerTitle';
export type HeadingStyle =
  | 'heroExtraLarge'
  | 'heroLarge'
  | 'hero'
  | 'titleLarge'
  | 'title'
  | 'titleSmall';

export interface TextProps {
  children?: React.ReactNode;
  type?: TextStyles;
  headingStyle?: HeadingStyle;
  color?: string;
  bold?: boolean;
  uppercase?: boolean;
  center?: boolean;
  htmlFor?: string;
}

const Text: React.FC<TextProps> = ({
  children,
  type = 'body',
  headingStyle = 'hero',
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
    case 'headerTitle':
      element = Styled.span;
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

  if (type.length === 2 && type.substr(0, 1) === 'h') {
    return (
      <Styled.heading>
        {React.createElement(
          type,
          {
            ...props,
            className: headingStyle,
            style: {
              color: color,
              textAlign: center ? 'center' : 'left',
              textTransform: uppercase ? 'uppercase' : 'none',
            },
          },
          children,
        )}
      </Styled.heading>
    );
  }

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
