import React from 'react';

import * as Styled from './ProgressTracker.styles';

export interface ProgressTrackerProps {}

const ProgressTracker: React.FC<ProgressTrackerProps> = () => {
  return <Styled.wrapper data-test="component-progress-tracker">ProgressTracker</Styled.wrapper>;
};

export default ProgressTracker;
