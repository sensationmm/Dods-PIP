import { shallow } from 'enzyme';
import React from 'react';

import PageActions from '.';

const mockBack = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ back: () => mockBack() }),
}));

describe('PageActions', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <PageActions>
        <div data-test="test-button" />
      </PageActions>,
    );
    const component = wrapper.find('[data-test="component-page-actions"]');
    const backButton = wrapper.find('[data-test="actions-back-button"]');
    const childButton = wrapper.find('[data-test="test-button"]');
    expect(component.length).toEqual(1);
    expect(backButton.length).toEqual(0);
    expect(childButton.length).toEqual(1);
  });

  it('renders default back button', () => {
    const wrapper = shallow(<PageActions hasBack />);
    const component = wrapper.find('[data-test="actions-back-button"]');
    component.simulate('click');
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('renders back button with label override', () => {
    const wrapper = shallow(<PageActions hasBack backLabel="Example" />);
    const component = wrapper.find('[data-test="actions-back-button"]');
    expect(component.props().label).toEqual('Example');
  });

  it('renders back button with action override', () => {
    const backOverride = jest.fn();
    const wrapper = shallow(<PageActions hasBack backHandler={backOverride} />);
    const component = wrapper.find('[data-test="actions-back-button"]');
    component.simulate('click');
    expect(mockBack).toHaveBeenCalledTimes(0);
    expect(backOverride).toHaveBeenCalledTimes(1);
  });

  it('renders multiple buttons', () => {
    const wrapper = shallow(
      <PageActions>
        <div data-test="test-button-1" />
        <div data-test="test-button-2" />
      </PageActions>,
    );
    const childButton1 = wrapper.find('[data-test="test-button-1"]');
    const childButton2 = wrapper.find('[data-test="test-button-2"]');
    expect(childButton1.length).toEqual(1);
    expect(childButton2.length).toEqual(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
