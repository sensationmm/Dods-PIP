import React from 'react';

import * as Styled from './DatePicker.styles';

export interface DatePickerProps {}

const DatePicker: React.FC<DatePickerProps> = () => {
  return <Styled.wrapper data-test="component-date-picker">DatePicker</Styled.wrapper>;
};

export default DatePicker;
