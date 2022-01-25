import color from '@dods-ui/globals/color';
import React from 'react';

import Text from '../Text';
import * as Styled from './DayPicker.styles';

export type DayType = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

type DayConfig = {
  label: string;
  value: DayType;
};

export interface DayPickerProps {
  selected?: DayType[];
  disabled?: boolean;
  onClick?: (vals: DayType[]) => void;
}

const DayPicker: React.FC<DayPickerProps> = ({
  selected = [],
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

  const handleClick = (clicked: DayType) => {
    const existing = selected.slice();

    if (existing.findIndex((day) => day === clicked) < 0) {
      existing.push(clicked);
    } else {
      existing.splice(existing.indexOf(clicked), 1);
    }

    onClick && onClick(existing);
  };

  return (
    <Styled.wrapper data-test="component-day-picker" disabled={disabled}>
      {days.map((day) => {
        const dayIsSelected = selected.find((el) => el === day.value) !== undefined;
        return (
          <Styled.day
            data-test={`day-${day.value}`}
            key={`day-${day.value}`}
            selected={dayIsSelected}
            disabled={disabled}
            clickable={onClick !== undefined}
            onClick={() => onClick && !disabled && handleClick(day.value)}
          >
            <Text color={dayIsSelected && !disabled ? color.base.white : color.base.greyDark}>
              {day.label}
            </Text>
          </Styled.day>
        );
      })}
    </Styled.wrapper>
  );
};

export default DayPicker;
