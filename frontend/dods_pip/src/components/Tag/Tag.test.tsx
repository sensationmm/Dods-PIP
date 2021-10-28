import { shallow } from 'enzyme';
import React from 'react';

import Text from '../Text';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';

import Tag from '.';

describe('Tag', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Tag label="Label" />);
    const component = wrapper.find('[data-test="component-tag"]');
    expect(component.length).toEqual(1);
  });

  it('renders label', () => {
    const wrapper = shallow(<Tag label="Label" />);
    const label = wrapper.find('[data-test="chips-label"]');
    expect(label.find(Text).props().children).toEqual('Label');
  });

  it('Text component should be the body type when the chips are medium size', () => {
    const wrapper = shallow(<Tag label="Label" size="medium" />);
    const label = wrapper.find('[data-test="chips-label"]');
    expect(label.find(Text).props().type).toEqual('body');
  });

  it('should show icon in small version', () => {
    const wrapper = shallow(<Tag label="Label" size="small" icon={Icons.Cross} />);
    const icon = wrapper.find('[data-test="left-icon"]');
    expect(icon.find(Icon).props().size).toEqual(IconSize.small);
  });

  it('should show icon in medium version', () => {
    const wrapper = shallow(<Tag label="Label" size="medium" icon={Icons.Cross} />);
    const icon = wrapper.find('[data-test="left-icon"]');
    expect(icon.find(Icon).props().size).toEqual(IconSize.large);
  });
});
