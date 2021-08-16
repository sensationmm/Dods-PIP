import { shallow } from 'enzyme';
import React from 'react';

import LoadingHOC from '.';

const MockComponent: React.FC = () => {
  return <div />;
};

describe('LoadingHOC', () => {
  it('renders without error', () => {
    const ConditionalComponent = LoadingHOC(MockComponent);
    const wrapper = shallow(<ConditionalComponent />);
    expect(wrapper.html()).not.toBe(null);
  });
});
