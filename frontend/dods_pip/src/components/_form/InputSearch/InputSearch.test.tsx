import React from 'react';
import { shallow } from 'enzyme';

import color from '../../../globals/color';
import Icon from '../../Icon';
import InputBase from '../InputBase';
import InputSearch from '.';

const SELECTOR_PREFIX_ICON = '[data-test="input-prefix-icon"]';

describe('InputSearch', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <InputSearch id="test" label="Example" value={'Example'} onChange={jest.fn} />,
    );
    const component = wrapper.find('[data-test="component-input-search"]');
    expect(component.length).toEqual(1);
  });

  it('renders default placeholder', () => {
    const wrapper = shallow(<InputSearch id="test" value={''} onChange={jest.fn} />);
    const component = wrapper.find(InputBase);
    expect(component.props()).toHaveProperty('placeholder', 'Search...');
  });

  it('renders label override', () => {
    const wrapper = shallow(
      <InputSearch id="test" label="Example" value={'Example'} onChange={jest.fn} />,
    );
    const component = wrapper.find(InputBase);
    expect(component.props()).toHaveProperty('label', 'Example');
  });

  it('renders disabled state', () => {
    const wrapper = shallow(
      <InputSearch id="test" isDisabled={true} value={''} onChange={jest.fn} />,
    );
    const component = wrapper.find(SELECTOR_PREFIX_ICON);
    expect(component.props()).toHaveProperty('color', color.base.grey);
  });

  it('renders error state', () => {
    const wrapper = shallow(<InputSearch id="test" error={'yes'} value={''} onChange={jest.fn} />);
    const component = wrapper.find(SELECTOR_PREFIX_ICON);
    expect(component.props()).toHaveProperty('color', color.alert.red);
  });

  it('fires onChange method', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(
      <InputSearch id="test" label="Example" value={'example'} onChange={typeWatcher} />,
    );
    const clear = wrapper.find('[data-test="input-clear"]');
    clear.simulate('click');
    expect(typeWatcher).toHaveBeenCalledTimes(1);
    expect(typeWatcher).toHaveBeenCalledWith('');
  });

  it('clears value', () => {});

  afterEach(() => {
    jest.resetAllMocks();
  });
});
