import DatePicker from '@dods-ui/components/_form/DatePicker';
import InputBase from '@dods-ui/components/_form/InputBase';
import Label from '@dods-ui/components/_form/Label';
import RadioGroup from '@dods-ui/components/_form/RadioGroup';
import Select, { SelectItem } from '@dods-ui/components/_form/Select';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Button from '@dods-ui/components/Button';
import { Icons } from '@dods-ui/components/Icon/assets';
import Modal from '@dods-ui/components/Modal';
import { addHours, format, parseISO } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';

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

interface IScheduleModalProps {
  onClose: () => void;
  onSchedule: (dateAndTime: Date) => void;
}

const getDateNow = () => format(new Date(), 'yyyy-MM-dd');

const ScheduleModal: React.FC<IScheduleModalProps> = ({ onClose, onSchedule }) => {
  const [period, setPeriod] = useState('today');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('0');
  const [date, setDate] = useState(getDateNow());

  const showDatePicker = period !== 'today';
  const disableSubmit = !time;

  const renderTimeInputs = useMemo(() => {
    return (
      <div>
        <Label label="Choose a time" required />
        <Styled.inputGroup>
          <Styled.timeInput>
            <InputBase id="time" type="time" value={time} placeholder="hh:mm" onChange={setTime} />
          </Styled.timeInput>
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
  }, [time, timezone]);

  const renderDatePicker = useMemo(() => {
    return (
      <div>
        <Label label="Assign a publishing date" required />
        <DatePicker
          id="min-date"
          minDate={getDateNow()}
          onChange={setDate}
          value={date}
          placeholder="dd/mm/yyyy"
        />
      </div>
    );
  }, [date]);

  useEffect(() => {
    if (!showDatePicker) {
      setDate(getDateNow());
    }
  }, [showDatePicker]);

  return (
    <Modal
      size={showDatePicker ? 'xlarge' : 'large'}
      title="Schedule Publishing for this content"
      onClose={onClose}
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
        <Button type="secondary" label="Cancel" onClick={onClose} />
        <Button
          icon={Icons.Clock}
          type="secondary"
          label="Schedule Publishing"
          onClick={() => {
            const dateAndTime = addHours(parseISO(`${date}T${time}`), -parseInt(timezone));
            onSchedule(dateAndTime);
          }}
          disabled={disableSubmit}
        />
      </Styled.buttons>
    </Modal>
  );
};

export default ScheduleModal;
