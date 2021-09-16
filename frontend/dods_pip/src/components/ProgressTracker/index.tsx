import React from 'react';

import color from '../../globals/color';
import Text from '../Text';
import * as Styled from './ProgressTracker.styles';

type ProgressItem = {
  label: string;
  required?: boolean;
};

export interface ProgressTrackerProps {
  condensed?: boolean;
  activeStep: number;
  steps: ProgressItem[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  condensed = false,
  activeStep,
  steps,
}) => {
  return (
    <Styled.wrapper data-test="component-progress-tracker">
      {steps.map((step, count) => {
        const isActiveStep = activeStep === count + 1;
        return (
          <Styled.step data-test="progress-step" key={`step-${count}`} condensed={condensed}>
            <div className="label">
              <Text color={color.theme.blue} bold={isActiveStep}>
                {step.label}
              </Text>
            </div>
            <Styled.stepCount active={isActiveStep} condensed={condensed}>
              <Text type="span" color={isActiveStep ? color.base.white : color.theme.blue}>
                {count + 1}
              </Text>
            </Styled.stepCount>
          </Styled.step>
        );
      })}
      <Styled.currentStep>
        <Text color={color.theme.blue} bold data-test="current-step">
          {activeStep <= steps.length ? steps[activeStep - 1].label : ''}
        </Text>
      </Styled.currentStep>
    </Styled.wrapper>
  );
};

export default ProgressTracker;
