// import classnames from 'classnames';
import * as React from 'react';
import { StyledComponent } from 'styled-components';

import colorPalette from '../../globals/color';
import * as Styled from './Text.styles';

type TextStyles = 'h1' | 'h2' | 'h3' | 'p' | 'label' | 'span';

interface ITextProps {
  children?: React.ReactNode;
  className?: string;
  type?: TextStyles;
  color?: string;
  bold?: boolean;
  center?: boolean;
  htmlFor?: string;
}

const Text: React.FC<ITextProps> = ({
  className,
  children,
  type = 'p',
  color = colorPalette.base.black,
  bold = false,
  center = false,
  htmlFor,
}) => {
  // TODO: add typography styling once specified by design
  const finalClassName = ''; //classnames(className, baseStyles.base, baseStyles[type], baseStyles[color]);

  const element = Styled[type] as StyledComponent<TextStyles, {}>;

  const props = {
    className: finalClassName,
    'data-test': 'component-text',
    htmlFor: htmlFor,
  };

  return React.createElement(
    element,
    {
      ...props,
      style: {
        color: color,
        fontWeight: bold ? 'bold' : 'normal',
        textAlign: center ? 'center' : 'left',
      },
    },
    children,
  );
};

export default Text;
