import React, { useState } from 'react';

import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Tooltip, { TooltipProps } from '../Tooltip';
import * as Styled from './Popover.styles';

export type alignmentType = 'topLeft' | 'topRight' | 'right';

export interface PopoverProps extends Omit<TooltipProps, 'trigger' | 'colorType' | 'icon'> {}

const Popover: React.FC<PopoverProps> = ({ ...rest }) => {
  const [show, setShow] = useState(false);

  const toggleClass = () => setShow(!show);

  const customButton = (
    <button className="btnTrigger" onClick={toggleClass}>
      <Icon src={Icons.IconInfo} size={IconSize.large} />
    </button>
  );

  return (
    <Styled.popoverWrapper data-test="popover">
      <Tooltip {...rest} trigger={customButton} classShow={show} classHover={true}></Tooltip>
    </Styled.popoverWrapper>
  );
};

export default Popover;
