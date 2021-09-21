import classNames from 'classnames';
import React from 'react';

import Leaves from '../../../assets/images/leaves.svg';
import LeavesMobile from '../../../assets/images/leaves-mobile.svg';
import color from '../../../globals/color';
import * as Styled from './Panel.styles';

export interface PanelProps {
  bgColor?: string;
  isWelcome?: boolean;
  isPadded?: boolean;
  isNarrow?: boolean;
}

const Panel: React.FC<PanelProps> = ({
  children,
  bgColor = color.base.white,
  isWelcome = false,
  isPadded = true,
  isNarrow = false,
}) => {
  return (
    <Styled.wrapper
      data-test="component-panel"
      style={{ backgroundColor: bgColor }}
      className={classNames({ welcome: isWelcome })}
    >
      <Styled.panel className={classNames({ padded: isPadded }, { narrow: isNarrow })}>
        {children}
      </Styled.panel>
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
