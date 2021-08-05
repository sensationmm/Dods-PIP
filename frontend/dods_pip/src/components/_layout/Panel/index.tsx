import React from 'react';
import classNames from 'classnames';
import color from '../../../globals/color';
import Leaves from '../../../assets/leaves.svg';
import LeavesMobile from '../../../assets/leaves-mobile.svg';

import * as Styled from './Panel.styles';

export interface PanelProps {
  bgColor?: string;
  isWelcome?: boolean;
  isPadded?: boolean;
}

const Panel: React.FC<PanelProps> = ({
  children,
  bgColor = color.base.white,
  isWelcome = false,
  isPadded = true,
}) => {
  return (
    <Styled.wrapper
      data-test="component-panel"
      style={{ backgroundColor: bgColor }}
      className={classNames({ welcome: isWelcome })}
    >
      <Styled.panel className={classNames({ padded: isPadded })}>{children}</Styled.panel>
      {isWelcome && (
        <Styled.leaves data-test="panel-leaves" aria-hidden="true">
          <Leaves id="desktop" alt="" />
          <LeavesMobile id="mobile" alt="" />
        </Styled.leaves>
      )}
    </Styled.wrapper>
  );
};

export default Panel;
