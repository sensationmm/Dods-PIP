import React from 'react';
import { shallow } from 'enzyme';
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
