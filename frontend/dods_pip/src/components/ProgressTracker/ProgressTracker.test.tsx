import { shallow } from 'enzyme';
import React from 'react';

import ProgressTracker from '.';

describe('ProgressTracker', () => {
  let wrapper;

  const activeStep = 3;
  const steps = [
    { label: 'Project Overview' },
    { label: 'Project Tags' },
    { label: 'Project Setup' },
    { label: 'Lorem ipsum' },
  ];

  beforeEach(() => {
    wrapper = shallow(<ProgressTracker activeStep={activeStep} steps={steps} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-progress-tracker"]');
    expect(component.length).toEqual(1);
  });

  it('renders correct steps', () => {
    const renderedSteps = wrapper.find('[data-test="progress-step"]');
    expect(renderedSteps.length).toEqual(steps.length);
  });

  it('shows correct active step', () => {
    const currentStep = wrapper.find('[data-test="current-step"]');
    expect(currentStep.props().children).toEqual('Project Setup');
  });
});
