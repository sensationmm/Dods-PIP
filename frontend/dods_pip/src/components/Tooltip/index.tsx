import classNames from 'classnames'
import Text from '../Text'
import * as Styled from './Tooltip.styles'
import Icon, { IconSize } from '../Icon'
import { Icons } from '../Icon/assets'
import color from '../../globals/color'

export type alignmentType = 'topLeft' | 'topRight' | 'right'
export type colorMode = 'Light' | 'Dark'

export interface TooltipProps {
  alignment?: alignmentType
  colorType?: colorMode
  title?: string
  body?: string
  icon?: Icons
  trigger?: JSX.Element
  classShow?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({alignment, colorType, title, body, icon, trigger, classShow}) => {
  let Component = Styled.tooltipStyle

  return (
    <Styled.wrapper data-test="component-tooltip">
      {trigger && trigger}
      <Component className={classNames({
        alignTopLeft: alignment === 'topLeft',
        alignTopRight: alignment === 'topRight',
        alignRight: alignment === 'right',
        colorLight: colorType === 'Light',
        colorDark: colorType === 'Dark',
        show: classShow ? 'show' : '',
        hover: 'hover'
      })}>
        <div className="inner">
          {title && <Text data-test="component-title" color={colorType === 'Dark' ? color.base.white : color.theme.blue} type="body">{title}</Text>}
          <Text
            data-test="component-body"
            color={
              colorType === 'Dark' ? 
              color.base.white : 
              color.theme.blue
            }
            type='bodySmall'
          >
            {icon && <Icon src={icon} size={IconSize.medium} color={colorType === 'Light' ? color.theme.blue : color.base.white} />}
            {body}
          </Text>
        </div>
      </Component>
    </Styled.wrapper>
  )
}

export default Tooltip
