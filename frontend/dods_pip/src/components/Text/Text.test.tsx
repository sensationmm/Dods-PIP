import { shallow } from 'enzyme';
import * as React from 'react';

import Text from '.';

describe('Text', () => {
  const props = {
    children: 'text goes here',
  };

  it('renders without error', () => {
    const wrapper = shallow(<Text {...props} />);
    expect(wrapper.find('[data-test="component-text"]').length).toEqual(1);
  });

  it('renders default p tag', () => {
    const wrapper = shallow(<Text>{props.children}</Text>);
    expect(wrapper.find('[data-test="component-text"]').type().target).toEqual('p');
  });

  it('renders header tag', () => {
    const wrapper = shallow(<Text type="h2">{props.children}</Text>);
    expect(wrapper.find('[data-test="component-text"]').type().target).toEqual('h2');
  });

  it('renders custom body tag', () => {
    const wrapper = shallow(<Text type="bodySmall">{props.children}</Text>);
    expect(wrapper.find('[data-test="component-text"]').type().target).toEqual('p');
  });

  it('renders custom label tag', () => {
    const wrapper = shallow(<Text type="labelSmall">{props.children}</Text>);
    expect(wrapper.find('[data-test="component-text"]').type().target).toEqual('label');
  });

  it('renders the given child in the html tag', () => {
    const wrapper = shallow(<Text {...props} />);
    expect(wrapper.find('[data-test="component-text"]').text()).toEqual(props.children);
  });

  it('renders the bold style', () => {
    const wrapper = shallow(<Text {...props} bold={true} />);
    const component = wrapper.find('[data-test="component-text"]');

    expect(component.hasClass('bold')).toEqual(true);
  });

  it('renders the uppercase style', () => {
    const wrapper = shallow(<Text {...props} uppercase={true} />);
    const component = wrapper.find('[data-test="component-text"]');

    const containerStyle = component.get(0).props.style;
    expect(containerStyle.textTransform).toEqual('uppercase');
  });

  it('renders the centered style', () => {
    const wrapper = shallow(<Text {...props} center={true} />);
    const component = wrapper.find('[data-test="component-text"]');

    const containerStyle = component.get(0).props.style;
    expect(containerStyle.textAlign).toEqual('center');
  });
});
