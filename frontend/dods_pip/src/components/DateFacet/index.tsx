import { format } from 'date-fns';
import sub from 'date-fns/sub';
import React, { useCallback, useMemo } from 'react';

import DatePicker from '../_form/DatePicker';
import { IRadioItem } from '../_form/Radio';
import RadioGroup from '../_form/RadioGroup';
import FacetContainer from '../FacetContainer';
import * as Styled from './DateFacet.styles';

export interface IDateRange {
  min?: string;
  max?: string;
}
export interface IDateOption extends IRadioItem, IDateRange {}

interface DateFacetProps {
  onChange: (value: IDateRange) => void;
  values: IDateRange;
}

const DateFacet: React.FC<DateFacetProps> = ({ onChange, values }) => {
  const dateNow = new Date();
  const formatStr = 'yyyy-MM-dd';

  const options: IDateOption[] = useMemo(() => {
    return [
      {
        label: 'Past 24 hours',
        value: 'past-24-hours',
        min: format(sub(dateNow, { days: 1 }), formatStr),
        max: format(dateNow, formatStr),
      },
      {
        label: 'Past week',
        value: 'past-week',
        min: format(sub(dateNow, { weeks: 1 }), formatStr),
        max: format(dateNow, formatStr),
      },
      {
        label: 'Past month',
        value: 'past-month',
        min: format(sub(dateNow, { months: 1 }), formatStr),
        max: format(dateNow, formatStr),
      },
      {
        label: 'Past 6 months',
        value: 'past-6-months',
        min: format(sub(dateNow, { months: 6 }), formatStr),
        max: format(dateNow, formatStr),
      },
      {
        label: 'Past 12 months',
        value: 'past-12-months',
        min: format(sub(dateNow, { months: 12 }), formatStr),
        max: format(dateNow, formatStr),
      },
      {
        label: 'Pick a range',
        value: 'custom-range',
        min: '',
        max: '',
      },
    ];
  }, []);

  const selectedOption = useMemo(() => {
    const presetValue = options.find(
      ({ min, max }) => values.min === min && values.max === max,
    )?.value;

    if (presetValue) {
      return presetValue;
    }

    if (values.min || values.max) {
      return 'custom-range';
    }

    return '';
  }, [values]);

  const updateSelectedValue = useCallback(
    (selectedValue) => {
      const option = options.find(({ value }) => value === selectedValue) as
        | IDateOption
        | undefined;

      if (option?.min && option?.max) {
        onChange(option);
      }
    },
    [options],
  );

  return (
    <FacetContainer heading="Date" onClearSelection={() => onChange({ min: '', max: '' })}>
      <>
        <Styled.radioItemsContainer>
          <RadioGroup
            items={options}
            onChange={updateSelectedValue}
            selectedValue={selectedOption}
          />
        </Styled.radioItemsContainer>
        <Styled.dateInputs>
          <DatePicker
            id="min-date"
            maxDate={values.max || format(dateNow, formatStr)}
            onChange={(min) => {
              onChange({
                ...values,
                min,
              });
            }}
            value={values.min || ''}
            placeholder="dd/mm/yyyy"
          />
          <span>-</span>
          <DatePicker
            id="max-date"
            minDate={values.min}
            maxDate={format(dateNow, formatStr)}
            onChange={(max) => {
              onChange({
                ...values,
                max,
              });
            }}
            value={values.max || ''}
            placeholder="dd/mm/yyyy"
          />
        </Styled.dateInputs>
      </>
    </FacetContainer>
  );
};

export default DateFacet;
