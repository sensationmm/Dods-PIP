import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Button from '../Button';
import Icon from '../Icon';
import Text from '../Text';
import Notification from '.';
import { Icons } from '../Icon/assets';

describe('Notification', () => {
  let wrapper, mockOnClose, mockAction, cleanupFunc;

  describe('mounted', () => {
    beforeAll(() => {
      mockOnClose = jest.fn();
      mockAction = jest.fn();
    });

    it('clears notification on timeout', () => {
      jest.useFakeTimers();
      wrapper = mount(<Notification title="Example" onClose={mockOnClose} />);
      act(() => {
        jest.advanceTimersByTime(5500);
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('clears timers on unmount', () => {
      jest.spyOn(window, 'clearTimeout');
      jest.spyOn(React, 'useEffect').mockImplementationOnce((func) => {
        cleanupFunc = func();
      });
      wrapper = mount(<Notification title="Example" onClose={mockOnClose} />);
      act(() => {
        jest.advanceTimersByTime(5500);
      });
      cleanupFunc();
      expect(clearTimeout).toHaveBeenCalledTimes(2);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('shallow', () => {
    beforeAll(() => {
      mockOnClose = jest.fn();
      mockAction = jest.fn();
    });

    beforeEach(() => {
      jest.useFakeTimers();
      wrapper = shallow(<Notification title="Example" onClose={mockOnClose} />);
    });

    it('renders default info type without error', () => {
      const component = wrapper.find('[data-test="component-notification"]');
      expect(component.length).toEqual(1);
      const icon = wrapper.find(Icon).at(0);
      expect(icon.props().src).toEqual(Icons.Info);
      const title = wrapper.find(Text).at(0);
      expect(title.props().children).toEqual('Example');
    });

    it('renders confirm type', () => {
      wrapper = shallow(<Notification type="confirm" title="Example" onClose={mockOnClose} />);
      const icon = wrapper.find(Icon).at(0);
      expect(icon.props().src).toEqual(Icons.TickBold);
    });

    it('renders warn type', () => {
      wrapper = shallow(<Notification type="warn" title="Example" onClose={mockOnClose} />);
      const icon = wrapper.find(Icon).at(0);
      expect(icon.props().src).toEqual(Icons.Issue);
    });

    it('renders alert type', () => {
      wrapper = shallow(<Notification type="alert" title="Example" onClose={mockOnClose} />);
      const icon = wrapper.find(Icon).at(0);
      expect(icon.props().src).toEqual(Icons.Alert);
    });

    it('renders optional text', () => {
      wrapper = shallow(<Notification title="Example" text="Example text" onClose={mockOnClose} />);
      const text = wrapper.find(Text).at(1);
      expect(text.props().children).toEqual('Example text');
    });

    it('fires onClose', () => {
      const onClose = wrapper.find('[data-test="notification-close"]');
      expect(onClose.length).toEqual(1);
      onClose.simulate('click');
      jest.advanceTimersByTime(500);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('renders optional action button', () => {
      wrapper = shallow(<Notification title="Example" action={mockAction} onClose={mockOnClose} />);
      const onClose = wrapper.find('[data-test="notification-close"]');
      expect(onClose.length).toEqual(0);
      const button = wrapper.find(Button);
      button.simulate('click');
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
