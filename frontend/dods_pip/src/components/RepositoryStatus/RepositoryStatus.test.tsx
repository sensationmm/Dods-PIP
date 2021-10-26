import { shallow } from 'enzyme';
import React from 'react';

import RepositoryStatus, { RepositoryStatusProps } from '.';
import Tag from '../Tag';

describe('RepositoryStatus', () => {
  it.each(['ingested', 'draft', 'in_progress', 'scheduled', 'published'])(
    'renders `%s` type without error',
    (type) => {
      const wrapper = shallow(<RepositoryStatus type={type as RepositoryStatusProps['type']} />);
      const component = wrapper.find(Tag);
      expect(component.length).toEqual(1);
    },
  );
});
