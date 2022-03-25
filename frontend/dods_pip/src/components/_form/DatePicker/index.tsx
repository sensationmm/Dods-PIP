import 'react-datepicker/dist/react-datepicker.css';

import { format } from 'date-fns';
import React from 'react';
import ReactDatePicker from 'react-datepicker';

import { Icons } from '../../Icon/assets';
import InputText, { InputTextProps } from '../InputText';
import * as Styled from './DatePicker.styles';

export interface DatePickerProps extends Omit<InputTextProps, 'icon'> {
  minDate?: string;
  maxDate?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  size = 'large',
  label,
  value,
  placeholder = 'Pick a date...',
  isDisabled = false,
  error,
  required,
  optional,
  helperText,
  onChange,
  onBlur,
  minDate,
  maxDate,
}) => {
  const firstRun = React.useRef(true);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (!firstRun.current && !isOpen) {
      onBlur && onBlur();
    }
  }, [isOpen]);

  const handleChange = (date: Date) => {
    setIsOpen(!isOpen);
    onChange(format(date, 'yyyy-MM-dd'));
  };

  const date = value.toString().split('-');
  const formattedDate = new Date(
    parseInt(date[0]),
    parseInt(date[1]) - 1,
    parseInt(date[2]),
    0,
    0,
    0,
  );

  const destructuredMinDate = minDate?.toString().split('-');
  const formattedMinDate = destructuredMinDate
    ? new Date(
        parseInt(destructuredMinDate[0]),
        parseInt(destructuredMinDate[1]) - 1,
        parseInt(destructuredMinDate[2]),
        0,
        0,
        0,
      )
    : undefined;

  const destructuredMaxDate = maxDate?.toString().split('-');
  const formattedMaxDate = destructuredMaxDate
    ? new Date(
        parseInt(destructuredMaxDate[0]),
        parseInt(destructuredMaxDate[1]) - 1,
        parseInt(destructuredMaxDate[2]),
        0,
        0,
        0,
      )
    : undefined;

  return (
    <Styled.wrapper data-test="component-date-picker">
      <InputText
        id={id}
        data-test="date-picker-input"
        size={size}
        label={label}
        value={value !== '' ? format(formattedDate, 'dd/MM/yyyy') : placeholder}
        isDisabled={isDisabled}
        error={error}
        required={required}
        optional={optional}
        helperText={helperText}
        onChange={() => false}
        icon={Icons.Calendar}
        onFocus={() => setIsOpen(true)}
        tabIndex={0}
        placeholder={placeholder}
      />
      {isOpen && (
        <ReactDatePicker
          data-test="date-popup"
          selected={value ? formattedDate : undefined}
          onChange={handleChange}
          inline
          onClickOutside={() => setIsOpen(false)}
          closeOnScroll={true}
          calendarStartDay={1}
          minDate={minDate ? formattedMinDate : undefined}
          maxDate={maxDate ? formattedMaxDate : undefined}
          dateFormat={'dd/MM/yyyy'}
        />
      )}
    </Styled.wrapper>
  );
};

export default DatePicker;
