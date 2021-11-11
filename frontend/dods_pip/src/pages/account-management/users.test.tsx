import { shallow } from 'enzyme';
import React from 'react';

import {Users} from './users.page';

describe('Component', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Users isLoading={false} setLoading={function (state: boolean): void {
      throw new Error('Function not implemented.');
    } } addNotification={jest.fn} />);
    const component = wrapper.find('[data-test="page-account-management-users"]');
    expect(component.length).toEqual(1);
  });
});
