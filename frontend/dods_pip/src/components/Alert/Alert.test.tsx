import { shallow } from 'enzyme';
import React from 'react';

import { DayType } from '../DayPicker';
import Alert from '.';

const AlertProps = {
  title: 'Final Services Market Act 2000',
  searchQueries: 9,
  recipients: 18,
  immediateDelivery: false,
  deliveryDay: 'wed' as DayType,
  deliveryTimes: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  isConsultant: false,
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
