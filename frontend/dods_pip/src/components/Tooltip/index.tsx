import classNames from 'classnames';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Tooltip.styles';

export type alignmentType = 'topLeft' | 'topRight' | 'right';
export type colorMode = 'Light' | 'Dark';

export interface TooltipProps {
  alignment?: alignmentType;
  colorType?: colorMode;
  title?: string;
  body?: string;
  icon?: Icons;
  trigger?: JSX.Element;
  classShow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  alignment,
  colorType,
  title,
  body,
  icon,
  trigger,
  classShow,
}) => {
  const Component = Styled.tooltipStyle;
  const darkColor = colorType === 'Dark' ? color.base.white : color.theme.blue;

  return (
    <Styled.wrapper data-test="component-tooltip">
      {trigger}

      <Component
        className={classNames({
          alignTopLeft: alignment === 'topLeft',
          alignTopRight: alignment === 'topRight',
          alignRight: alignment === 'right',
          colorLight: colorType === 'Light',
          colorDark: colorType === 'Dark',
          show: classShow,
        })}
      >
        <div className="inner">
          {title && (
            <Text data-test="component-title" color={darkColor} type="body">
              {title}
            </Text>
          )}
          <Text color={darkColor} type="bodySmall">
            {icon && (
              <Icon
                data-test="component-icon"
                src={icon}
                size={IconSize.medium}
                color={colorType === 'Light' ? color.theme.blue : color.base.white}
              />
            )}
            {body}
          </Text>
        </div>
      </Component>
    </Styled.wrapper>
  );
};

export default Tooltip;
