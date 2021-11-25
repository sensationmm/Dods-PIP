import { shallow } from 'enzyme';
import React from 'react';

import Header from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ pathname: '' }),
}));

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn().mockReturnValue(true),
}));

describe('Header', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Header />);
    const component = wrapper.find('[data-test="component-header"]');
    const title = wrapper.find('[data-test="header-title"]');
    expect(title.length).toEqual(0);
    expect(component.length).toEqual(1);
  });

  it('renders with a title if specified', () => {
    const wrapper = shallow(<Header title="Example" />);
    const title = wrapper.find('[data-test="header-title"]');
    expect(title.length).toEqual(1);
  });
});
