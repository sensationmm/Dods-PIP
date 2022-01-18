import { format } from 'date-fns';
import sub from 'date-fns/sub';
import React, { useCallback, useMemo, useState } from 'react';

import DatePicker from '../_form/DatePicker';
import { IRadioItem } from '../_form/Radio';
import RadioGroup from '../_form/RadioGroup';
import FacetContainer from '../FacetContainer';
import * as Styled from './DateFacet.styles';

interface DateFacetProps {
  onClearSelection?: () => void;
}

interface IOption extends IRadioItem {
  min: string;
  max: string;
}

const DateFacet: React.FC<DateFacetProps> = ({ onClearSelection }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [dateValues, setDateValues] = useState({ min: '', max: '' });
  const dateNow = new Date();
  const formatStr = 'yyyy-MM-dd';

  const options: IOption[] = useMemo(() => {
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
        value: 'pick-a-range',
        min: '',
        max: '',
      },
    ];
  }, []);

  const { minValue, maxValue } = useMemo(() => {
    return {
      minValue: dateValues.min || '',
      maxValue: dateValues.max || '',
    };
  }, [dateValues]);

  const updateSelectedValue = useCallback(
    (selectedValue) => {
      setSelectedOption(selectedValue);
      const option = options.find(({ value }) => value === selectedValue) as IOption | undefined;

      if (option?.min && option?.max) {
        setDateValues(option);
      }
    },
    [options],
  );

  return (
    <FacetContainer heading="Date" onClearSelection={onClearSelection}>
      <>
        <RadioGroup items={options} onChange={updateSelectedValue} selectedValue={selectedOption} />
        <Styled.dateInputs>
          <DatePicker
            id="min-date"
            maxDate={maxValue || format(dateNow, formatStr)}
            onChange={(min) => {
              setDateValues({
                ...dateValues,
                min,
              });
            }}
            value={minValue}
            placeholder="dd/mm/yyyy"
            isDisabled={selectedOption !== 'pick-a-range'}
          />
          <span>-</span>
          <DatePicker
            id="max-date"
            minDate={dateValues.min}
            maxDate={format(dateNow, formatStr)}
            onChange={(max) => {
              setDateValues({
                ...dateValues,
                max,
              });
            }}
            value={maxValue}
            placeholder="dd/mm/yyyy"
            isDisabled={selectedOption !== 'pick-a-range'}
          />
        </Styled.dateInputs>
      </>
    </FacetContainer>
  );
};

export default DateFacet;
