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

  it('renders default tag', () => {
    const wrapper = shallow(<Text>{props.children}</Text>);
    expect(wrapper.find('[data-test="component-text"]').type().target).toEqual('p');
  });

  it('renders the given prop type as the html tag', () => {
    const wrapper = shallow(<Text {...props} />);
    expect(wrapper.find('[data-test="component-text"]').type().target).toEqual('p');
  });

  it('renders the given child in the html tag', () => {
    const wrapper = shallow(<Text {...props} />);
    expect(wrapper.find('[data-test="component-text"]').text()).toEqual(props.children);
  });

  it('renders the default style', () => {
    const wrapper = shallow(<Text {...props} />);
    const component = wrapper.find('[data-test="component-text"]');

    let containerStyle = component.get(0).props.style;
    expect(containerStyle.fontWeight).toEqual('normal');
  });

  it('renders the bold style', () => {
    const wrapper = shallow(<Text {...props} bold={true} />);
    const component = wrapper.find('[data-test="component-text"]');

    let containerStyle = component.get(0).props.style;
    expect(containerStyle.fontWeight).toEqual('bold');
  });

  it('renders the centered style', () => {
    const wrapper = shallow(<Text {...props} center={true} />);
    const component = wrapper.find('[data-test="component-text"]');

    let containerStyle = component.get(0).props.style;
    expect(containerStyle.textAlign).toEqual('center');
  });
});
