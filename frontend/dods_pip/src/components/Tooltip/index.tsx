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
  classHover?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  alignment,
  colorType,
  title,
  body,
  icon,
  trigger,
  classShow,
  classHover,
}) => {
  const Component = Styled.tooltipStyle;

  return (
    <Styled.wrapper data-test="component-tooltip">
      {trigger && trigger}

      <Component
        className={classNames({
          alignTopLeft: alignment === 'topLeft',
          alignTopRight: alignment === 'topRight',
          alignRight: alignment === 'right',
          colorLight: colorType === 'Light',
          colorDark: colorType === 'Dark',
          show: classShow ? 'show' : '',
          hover: classHover ? '' : 'hover',
          popover: 'popover',
        })}
      >
        <div className="inner">
          {title && (
            <Text color={colorType === 'Dark' ? color.base.white : color.theme.blue} type="body">
              {title}
            </Text>
          )}
          <Text color={colorType === 'Dark' ? color.base.white : color.theme.blue} type="bodySmall">
            {icon && (
              <Icon
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
