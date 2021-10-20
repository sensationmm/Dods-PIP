import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Tooltip, { TooltipProps } from '../Tooltip';
import * as Styled from './Popover.styles';

export type alignmentType = 'topLeft' | 'topRight' | 'right';

export interface PopoverProps extends Omit<TooltipProps, 'trigger' | 'colorType' | 'icon'> {}

const Popover: React.FC<PopoverProps> = ({ ...rest }) => {
  const firstRun = React.useRef(true);
  const [show, setShow] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
  }, [show]);

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
