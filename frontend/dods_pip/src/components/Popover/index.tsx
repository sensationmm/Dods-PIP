import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Tooltip, { TooltipProps } from '../Tooltip';
import * as Styled from './Popover.styles';

export interface PopoverProps extends Omit<TooltipProps, 'trigger' | 'colorType' | 'icon'> {}

const Popover: React.FC<PopoverProps> = ({ ...rest }) => {
  const [show, setShow] = React.useState<boolean>(false);

  const toggleClass = () => setShow(!show);

  const customButton = (
    <button className="btnTrigger" onClick={toggleClass}>
      <Icon src={Icons.Info} size={IconSize.large} />
    </button>
  );

  return (
    <Styled.popoverWrapper data-test="popover">
      <OutsideClickHandler onOutsideClick={() => setShow(false)}>
        <Tooltip {...rest} trigger={customButton} classShow={show}></Tooltip>
      </OutsideClickHandler>
    </Styled.popoverWrapper>
  );
};

export default Popover;
