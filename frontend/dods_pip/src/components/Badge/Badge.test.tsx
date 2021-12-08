import { shallow } from 'enzyme';
import React from 'react';
import color from '../../globals/color';

import Badge from '.';
import { BadgeType } from '.';

describe('Badge', () => {
  let wrapper;
  let count = 0;
  const types: BadgeType[] = [
    'infoLight',
    'infoGrey',
    'infoDark',
    'infoBlue',
    'confirm',
    'warn',
    'danger',
  ];
  let state = { type: types };

  describe('color check', () => {
    beforeEach(() => {
      wrapper = shallow(<Badge type={state.type[count]} />);
    });

    it('renders infoLight without error', () => {
      const component = wrapper.find('[data-test="badge-component"]');
      expect(component.length).toEqual(1);
    });

    it('renders infoGrey without error', () => {
      const component = wrapper.find('[data-test="badge"]');
      expect(component.length).toEqual(1);
    });

    it('renders infoDark without error', () => {
      const component = wrapper.find('[data-test="badge"]');
      expect(component.length).toEqual(1);
    });

    it('renders infoBlue without error', () => {
      const component = wrapper.find('[data-test="badge"]');
      expect(component.length).toEqual(1);
    });

    it('renders confirm without error', () => {
      const component = wrapper.find('[data-test="badge"]');
      expect(component.length).toEqual(1);
    });

    it('renders warn without error', () => {
      const component = wrapper.find('[data-test="badge"]');
      expect(component.length).toEqual(1);
    });

    it('renders danger without error', () => {
      const component = wrapper.find('[data-test="badge"]');
      expect(component.length).toEqual(1);
    });

    afterEach(() => {
      count++;
    });
  });

  it('allows and shows label', () => {
    const wrapper = shallow(<Badge label="example" />);
    const component = wrapper.find('[data-test-id="badge-label"]');
    expect(component.props().children).toEqual('example');
  });

  it('should show the label in grey', () => {
    const wrapper = shallow(<Badge label="example" />);
    const component = wrapper.find('[data-test-id="badge-label"]');
    expect(component.props().color).toEqual(color.base.greyDark);
  });

  it('allows and shows numbers inside the badge', () => {
    const wrapper = shallow(<Badge number={7} />);
    const component = wrapper.find('[data-test="badge-number"]');
    expect(component.props().children).toEqual('7');
  });

  it('should show the number in white', () => {
    const wrapper = shallow(<Badge number={7} type="infoDark" />);
    const component = wrapper.find('[data-test="badge-number"]');
    expect(component.props().color).toEqual(color.base.white);
  });

  it('should show the number in blue', () => {
    const wrapper = shallow(<Badge number={7} type="infoLight" />);
    const component = wrapper.find('[data-test="badge-number"]');
    expect(component.props().color).toEqual(color.theme.blueMid);
  });

  it('should show the content in small text', () => {
    const wrapper = shallow(<Badge number={7} type="infoLight" size="small" label="example" />);
    const number = wrapper.find('[data-test="badge-number"]');
    const label = wrapper.find('[data-test-id="badge-label"]');
    expect(number.props().type).toEqual('bodySmall');
    expect(label.props().type).toEqual('bodySmall');
  });
});
