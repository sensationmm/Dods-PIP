import React from 'react';
import spacing from '../../../globals/spacing';

export interface SpacerProps {
  size?: number;
}

const Spacer: React.FC<SpacerProps> = ({ size = 1 }) => {
  return (
    <span
      data-test="component-spacer"
      aria-hidden={'true'}
      style={{ display: 'block', height: spacing(size) }}
    />
  );
};

export default Spacer;
