import { shallow } from 'enzyme';
import React from 'react';

import color from '../../globals/color';
import Text from '../Text';
import PasswordStrength from '.';
import * as Styled from './PasswordStrength.styles';

describe('PasswordStrength', () => {
  it('renders without error', () => {
    const wrapper = shallow(<PasswordStrength />);
    const component = wrapper.find('[data-test="component-password-strength"]');
    expect(component.length).toEqual(1);
  });

  it('renders fail style', () => {
    const wrapper = shallow(<PasswordStrength number={false} />);
    const item = wrapper.find('[data-test="pass-item-0-0"]');
    const pip = item.find(Styled.pip);
    const label = item.find(Text);

    expect(pip.hasClass('pass')).toEqual(false);
    expect(label.props().color).toEqual(color.alert.red);
  });

  it('renders pass style', () => {
    const wrapper = shallow(<PasswordStrength number={true} />);
    const item = wrapper.find('[data-test="pass-item-0-0"]');
    const pip = item.find(Styled.pip);
    const label = item.find(Text);

    expect(pip.hasClass('pass')).toEqual(true);
    expect(label.props().color).toEqual(color.alert.green);
  });

  it('renders disabled style', () => {
    const wrapper = shallow(<PasswordStrength disabled={true} />);
    const item = wrapper.find('[data-test="pass-item-0-0"]');
    const pip = item.find(Styled.pip);
    const label = item.find(Text);

    expect(pip.hasClass('disabled')).toEqual(true);
    expect(label.props().color).toEqual(color.base.grey);
  });
});
