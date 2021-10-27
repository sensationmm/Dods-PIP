import { shallow } from 'enzyme';
import React from 'react';

import RepositoryStatus, { RepositoryStatusProps } from '.';
import { Icons } from '../Icon/assets';
import Tag from '../Tag';

describe('RepositoryStatus', () => {
  it.each([
    ['ingested', 'Ingested', Icons.Disk],
    ['draft', 'Draft', Icons.Pencil],
    ['in_progress', 'In progress', Icons.Pencil],
    ['scheduled', 'Scheduled', Icons.Clock],
    ['published', 'Published', Icons.TickBold],
  ])('renders `%s` type without error', (type, label, icon) => {
    const wrapper = shallow(<RepositoryStatus type={type as RepositoryStatusProps['type']} />);
    const component = wrapper.find(Tag);
    expect(component.props().label).toEqual(label);
    expect(component.props().icon).toEqual(icon);
    expect(component.length).toEqual(1);
  });
});
