import { mount, shallow } from 'enzyme';
import React from 'react';

import LoadingHOC from '.';

const MockComponent: React.FC = () => {
  return <div />;
};

const MockNotification = {
  title: 'Example',
  text: 'Text goes here',
};

describe('LoadingHOC', () => {
  let ConditionalComponent, wrapper, wrappedComponent;

  const useStateSpy = jest.spyOn(React, 'useState');
  const setIsLoading = jest.fn();
  const setNotifications = jest.fn();

  const defaultState = {
    isLoading: false,
    notifications: [],
  };

  const states = [
    defaultState, // renders without error
    defaultState, // adds notification
    { ...defaultState, notifications: [{ id: 'exampleid', ...MockNotification }] }, // adds 2nd notification
    { ...defaultState, notifications: [{ id: 'exampleid', ...MockNotification }] }, // removes notification
    {
      ...defaultState,
      notifications: [
        { id: 'exampleid1', ...MockNotification },
        { id: 'exampleid2', ...MockNotification },
      ],
    }, // removes 2nd notification
  ];

  let count = 0;

  beforeEach(() => {
    ConditionalComponent = LoadingHOC(MockComponent);
    wrapper = shallow(<ConditionalComponent />);
    wrappedComponent = wrapper.find('[data-test="wrapped-component"]');

    useStateSpy
      .mockImplementationOnce(() => [states[count].isLoading, setIsLoading])
      .mockImplementationOnce(() => [states[count].notifications, setNotifications]);
  });

  it('renders without error', () => {
    expect(wrapper.html()).not.toBe(null);
  });

  it('adds notification', () => {
    wrappedComponent.props().addNotification(MockNotification);
    expect(setNotifications).toHaveBeenCalledWith([expect.objectContaining(MockNotification)]);
  });

  it('adds 2nd notification', () => {
    wrappedComponent.props().addNotification(MockNotification);
    expect(setNotifications).toHaveBeenCalledWith([
      expect.objectContaining(MockNotification),
      expect.objectContaining(MockNotification),
    ]);
  });

  it('removes notification', () => {
    const notification = wrapper.find('[id="exampleid"]');
    notification.props().onClose();
    expect(setNotifications).toHaveBeenCalledWith([]);
  });

  it('removes 2nd notification', () => {
    const notification = wrapper.find('[id="exampleid2"]');
    notification.props().onClose();
    expect(setNotifications).toHaveBeenCalledWith([expect.objectContaining(MockNotification)]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
