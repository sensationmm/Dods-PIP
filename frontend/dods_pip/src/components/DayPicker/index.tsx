import React from 'react';

import * as Styled from './DayPicker.styles';

export type DayType = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

type DayConfig = {
  label: string;
  value: DayType;
};

export interface DayPickerProps {
  selected?: DayType;
  disabled?: boolean;
  onClick?: (val: DayType) => void;
}

const DayPicker: React.FC<DayPickerProps> = ({
  selected = undefined,
  disabled = false,
  onClick = undefined,
}) => {
  const days = [
    { label: 'Mon', value: 'mon' },
    { label: 'Tue', value: 'tue' },
    { label: 'Wed', value: 'wed' },
    { label: 'Thu', value: 'thu' },
    { label: 'Fri', value: 'fri' },
    { label: 'Sat', value: 'sat' },
    { label: 'Sun', value: 'sun' },
  ] as DayConfig[];

  const isDisabled = onClick === undefined || disabled;

  return (
    <Styled.wrapper data-test="component-day-picker" disabled={isDisabled}>
      {days.map((day) => (
        <Styled.day
          data-test={`day-${day.value}`}
          key={`day-${day.value}`}
          selected={selected === day.value}
          disabled={isDisabled}
          onClick={() => onClick && onClick(day.value)}
        >
          {day.label}
        </Styled.day>
      ))}
    </Styled.wrapper>
  );
};

export default DayPicker;
