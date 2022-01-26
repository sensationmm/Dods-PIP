import EmailFormatFull from '@dods-ui/assets/images/email-format-full.svg';
import EmailFormatSnippet from '@dods-ui/assets/images/email-format-snippet.svg';
import HightlightActive from '@dods-ui/assets/images/highlight-active.svg';
import HightlightInactive from '@dods-ui/assets/images/highlight-inactive.svg';
import Label from '@dods-ui/components/_form/Label';
import Radio from '@dods-ui/components/_form/Radio';
import Select from '@dods-ui/components/_form/Select';
import Toggle from '@dods-ui/components/_form/Toggle';
import Spacer from '@dods-ui/components/_layout/Spacer';
import DayPicker, { DayType } from '@dods-ui/components/DayPicker';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import React from 'react';

import { AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

const AlertStep4: React.FC<AlertStepProps> = () => {
  const [isScheduled, setIsScheduled] = React.useState<boolean>(true);
  const [isSpecific, setIsSpecific] = React.useState<boolean>(true);
  const [timezone, setTimezone] = React.useState<string>('');
  const [days, setDays] = React.useState<DayType[]>([]);
  const [times, setTimes] = React.useState<Array<string>>([]);
  const [highlight, setHighlight] = React.useState<string>('');
  const [format, setFormat] = React.useState<string>('');

  React.useEffect(() => {
    if (!isSpecific) {
      setDays(['mon', 'tue', 'wed', 'thu', 'fri']);
    } else {
      setDays([]);
    }
  }, [isSpecific]);

  const handleClick = (clicked: string) => {
    const existing = times.slice();

    if (existing.findIndex((day) => day === clicked) < 0) {
      existing.push(clicked);
    } else {
      existing.splice(existing.indexOf(clicked), 1);
    }

    setTimes(existing);
  };

  return (
    <Styled.scheduleColumns>
      <div>
        <Styled.sectionHeader>
          <Icon src={Icons.Calendar} size={IconSize.xxlarge} />
          <Text type="h2" headingStyle="title">
            Schedule
          </Text>
        </Styled.sectionHeader>

        <Spacer size={8} />

        <Styled.schedule>
          <Toggle
            label="Schedule Type"
            required
            labelOff="Immediate"
            labelOn="Scheduled"
            isActive={isScheduled}
            onChange={setIsScheduled}
          />
          <div>
            <Styled.schedule>
              <Label required label="Days" />
              <Toggle
                isSmall
                labelOff="Weekdays"
                labelOn="Specific days"
                isActive={isSpecific}
                onChange={setIsSpecific}
              />
            </Styled.schedule>
            <Spacer size={3} />
            <DayPicker selected={days} onClick={setDays} disabled={!isSpecific} />
          </div>
        </Styled.schedule>

        <Spacer size={7} />

        <Select
          id="timezone"
          label="Choose a timezone"
          required
          value={timezone}
          onChange={setTimezone}
          options={[
            { label: 'GMT', value: 'London' },
            { label: 'GMT+1', value: 'Berlin' },
            { label: 'GMT+2', value: 'Amsterdam' },
          ]}
        />

        <Spacer size={7} />

        <Label required label="Choose the times" />

        <Styled.times>
          <Text type="span" color={color.base.greyDark}>
            Early morning
          </Text>
          <Spacer size={3} />
          <Styled.timesOptions>
            {['1', '2', '3', '4', '5', '6'].map((time) => (
              <Styled.time
                key={`time${time}`}
                active={times.findIndex((t) => t === `${time}:00`) > -1}
                onClick={() => handleClick(`${time}:00`)}
              >
                {time}:00
              </Styled.time>
            ))}
          </Styled.timesOptions>
          <Spacer size={8} />
          <Text type="span" color={color.base.greyDark}>
            Working day
          </Text>
          <Spacer size={3} />
          <Styled.timesOptions>
            {['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'].map((time) => (
              <Styled.time
                key={`time${time}`}
                active={times.findIndex((t) => t === `${time}:00`) > -1}
                onClick={() => handleClick(`${time}:00`)}
              >
                {time}:00
              </Styled.time>
            ))}
          </Styled.timesOptions>
          <Spacer size={8} />
          <Text type="span" color={color.base.greyDark}>
            Late evening
          </Text>
          <Spacer size={3} />
          <Styled.timesOptions>
            {['19', '20', '21', '22', '23', '24'].map((time) => (
              <Styled.time
                key={`time${time}`}
                active={times.findIndex((t) => t === `${time}:00`) > -1}
                onClick={() => handleClick(`${time}:00`)}
              >
                {time}:00
              </Styled.time>
            ))}
          </Styled.timesOptions>
          <Spacer size={8} />
        </Styled.times>
      </div>

      <div>
        <Styled.sectionHeader>
          <Icon src={Icons.Mail} size={IconSize.xxlarge} />
          <Text type="h2" headingStyle="title">
            Format
          </Text>
        </Styled.sectionHeader>
        <Spacer size={8} />
        <Label required label="Keyword highlight" />
        <Styled.highlightOptions>
          <HightlightInactive width="40px" height="40px" />
          <Radio
            name="keyword-highlight"
            label="No"
            value="no"
            isChecked={highlight === 'no'}
            onChange={setHighlight}
          />
          <HightlightActive width="40px" height="40px" />
          <Radio
            name="keyword-highlight"
            label="Yes"
            value="yes"
            isChecked={highlight === 'yes'}
            onChange={setHighlight}
          />
        </Styled.highlightOptions>

        <Spacer size={8} />
        <Label required label="Choose the format you prefer" />
        <Styled.highlightOptions>
          <div>
            <EmailFormatFull />
            <Radio
              name="email-format"
              label="Full text"
              value="full"
              isChecked={format === 'full'}
              onChange={setFormat}
            />
            <Spacer size={2} />
            <Text type="bodySmall" color={color.base.greyDark}>
              Heading and full article
            </Text>
          </div>
          <div>
            <EmailFormatSnippet />
            <Radio
              name="email-format"
              label="Snippet"
              value="snippet"
              isChecked={format === 'snippet'}
              onChange={setFormat}
            />
            <Spacer size={2} />
            <Text type="bodySmall" color={color.base.greyDark}>
              Headline and first paragraph
            </Text>
          </div>
        </Styled.highlightOptions>
      </div>
    </Styled.scheduleColumns>
  );
};

export default AlertStep4;
