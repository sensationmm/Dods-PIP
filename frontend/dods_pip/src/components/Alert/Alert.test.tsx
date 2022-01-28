import { shallow } from 'enzyme';
import React from 'react';

import { DayType } from '../DayPicker';
import Alert from '.';

const AlertProps = {
  uuid: 'ssd',
  collectionId: 'sdas',
  title: 'Final Services Market Act 2000',
  searchQueriesCount: 9,
  recipientsCount: 18,
  isScheduled: true,
  schedule: '0 0 08,12,20 ? * MON,TUE,WED *',
  isConsultant: false,
  lastStepCompleted: 1,
  onDelete: jest.fn,
  onCopy: jest.fn,
  onViewSettings: jest.fn,
  onViewResults: jest.fn,
};

describe('Alert', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Alert {...AlertProps} />);
    const component = wrapper.find('[data-test="component-alert"]');
    expect(component.length).toEqual(1);
  });
});
