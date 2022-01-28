import DatePicker from '@dods-ui/components/_form/DatePicker';
import InputText from '@dods-ui/components/_form/InputText';
import Label from '@dods-ui/components/_form/Label';
import RadioGroup from '@dods-ui/components/_form/RadioGroup';
import Select, { SelectItem } from '@dods-ui/components/_form/Select';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Button from '@dods-ui/components/Button';
import { Icons } from '@dods-ui/components/Icon/assets';
import Modal from '@dods-ui/components/Modal';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';

import * as Styled from './schedule-modal.styles';

const timezones: SelectItem[] = [
  {
    label: 'GMT',
    value: '0',
  },
  {
    label: 'GMT + 1',
    value: '1',
  },
  {
    label: 'GMT + 2',
    value: '2',
  },
  {
    label: 'GMT + 3',
    value: '3',
  },
];

const timePeriods: SelectItem[] = [
  {
    label: 'AM',
    value: 'am',
  },
  {
    label: 'PM',
    value: 'pm',
  },
];

const ScheduleModal: React.FC = () => {
  const [period, setPeriod] = useState('today');
  const [time, setTime] = useState('');
  const [timePeriod, setTimePeriod] = useState('am');
  const [timezone, setTimezone] = useState('0');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const showDatePicker = period !== 'today';

  const renderTimeInputs = useMemo(() => {
    return (
      <div>
        <Label label="Choose a time" required />
        <Styled.inputGroup>
          <Styled.timeInput>
            <InputText id="time" value={time} placeholder="hh:mm" onChange={setTime} />
          </Styled.timeInput>
          <Select
            id="am-pm"
            options={timePeriods}
            value={timePeriod}
            placeholder="AM"
            onChange={setTimePeriod}
          />
          <Select
            id="timezone"
            options={timezones}
            value={timezone}
            placeholder="hh:mm"
            onChange={setTimezone}
          />
        </Styled.inputGroup>
      </div>
    );
  }, [time, timePeriod, timezone]);

  const renderDatePicker = useMemo(() => {
    return (
      <div>
        <Label label="Assign a publishing date" required />
        <DatePicker
          id="min-date"
          minDate={format(new Date(), 'yyyy-MM-dd')}
          onChange={setDate}
          value={date}
          placeholder="dd/mm/yyyy"
        />
      </div>
    );
  }, [date]);

  return (
    <Modal
      size={showDatePicker ? 'xlarge' : 'large'}
      title="Schedule Publishing for this content"
      bodyOverflow
    >
      <Spacer size={3} />
      <Styled.fields>
        <div>
          <RadioGroup
            label="Select a period"
            onChange={(value) => setPeriod(value)}
            selectedValue={period}
            required
            items={[
              {
                label: 'Today',
                value: 'today',
              },
              {
                label: 'Select a date',
                value: 'custom',
              },
            ]}
          />
        </div>
        {showDatePicker && renderDatePicker}
        {renderTimeInputs}
      </Styled.fields>
      <Styled.buttons>
        <Button type="secondary" label="Cancel" />
        <Button icon={Icons.Clock} type="secondary" label="Schedule Publishing" disabled />
      </Styled.buttons>
    </Modal>
  );
};

export default ScheduleModal;
