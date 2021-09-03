import React, { useEffect } from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Chips.styles';

export interface ChipsProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
}

const Chips: React.FC<ChipsProps> = ({ label, disabled = false, selected = false }) => {
  const [localSelected, setLocalSelected] = React.useState(selected);
  const [hovering, setHovering] = React.useState(false);

  useEffect(() => {
    setLocalSelected(selected);
  }, [selected]);

  return (
    <Styled.wrapper
      data-test="component-chip"
      selected={localSelected}
      disabled={disabled}
      onClick={() => setLocalSelected(!localSelected)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Text type="body" bold color={disabled ? color.base.grey : color.theme.blueMid}>
        {label}
      </Text>
      {hovering && (
        <Styled.closeButton disabled={disabled}>
          <Icon src={Icons.IconCross} size={IconSize.small} color={color.base.white} />
        </Styled.closeButton>
      )}
    </Styled.wrapper>
  );
};

export default Chips;
