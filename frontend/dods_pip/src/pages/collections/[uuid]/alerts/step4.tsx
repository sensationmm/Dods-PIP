import EmailFormatFull from '@dods-ui/assets/images/email-format-full.svg';
import EmailFormatSnippet from '@dods-ui/assets/images/email-format-snippet.svg';
import HightlightActive from '@dods-ui/assets/images/highlight-active.svg';
import HightlightInactive from '@dods-ui/assets/images/highlight-inactive.svg';
import Label from '@dods-ui/components/_form/Label';
import Radio from '@dods-ui/components/_form/Radio';
import Select from '@dods-ui/components/_form/Select';
import Toggle from '@dods-ui/components/_form/Toggle';
import Spacer from '@dods-ui/components/_layout/Spacer';
import { parseScheduleCron } from '@dods-ui/components/Alert';
import Button from '@dods-ui/components/Button';
import DayPicker, { DayType } from '@dods-ui/components/DayPicker';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import React from 'react';

import { AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

const AlertStep4: React.FC<AlertStepProps> = ({
  alert,
  setActiveStep,
  editAlert,
  disabled = false,
}) => {
  const [isScheduled, setIsScheduled] = React.useState<boolean>(
    alert.isScheduled ? alert.isScheduled : true,
  );
  const [isSpecific, setIsSpecific] = React.useState<boolean>(true);
  const [timezone, setTimezone] = React.useState<string>(alert.timezone || '');
  const [days, setDays] = React.useState<DayType[]>([]);
  const [times, setTimes] = React.useState<Array<string>>([]);
  const [hasKeywordHighlight, setHasKeywordHighlight] = React.useState<string>(
    alert.hasKeywordsHighlight !== undefined
      ? alert.hasKeywordsHighlight === true
        ? 'yes'
        : 'no'
      : '',
  );
  const [alertTemplateId, setAlertTemplateId] = React.useState<string>(
    alert.template?.id ? (alert.template.id === 1 ? 'full' : 'snippet') : '',
  );

  React.useEffect(() => {
    const { deliveryDays, deliveryTimes } = parseScheduleCron(alert.schedule as string);
    setDays(deliveryDays);
    setTimes(deliveryTimes);
  }, []);

  React.useEffect(() => {
    if (!isSpecific) {
      setDays(['MON', 'TUE', 'WED', 'THU', 'FRI']);
    }
  }, [isSpecific]);

  React.useEffect(() => {
    if (!isScheduled) {
      setTimezone('');
      setDays([]);
      setTimes([]);
      setIsSpecific(true);
    }
  }, [isScheduled]);

  const handleClick = (clicked: string) => {
    const existing = times.slice();

    if (existing.findIndex((day) => day === clicked) < 0) {
      existing.push(clicked);
    } else {
      existing.splice(existing.indexOf(clicked), 1);
    }

    setTimes(existing);
  };

  const handleSetDays = (days: DayType[]) => {
    setDays(days);
    if (!isSpecific) {
      setIsSpecific(true);
    }
  };

  const cronTime = () => {
    let cron = '0 0 TIMES ? * DAYS *';

    cron = cron.replace('TIMES', times.map((time: string) => time.replace(':00', '')).join(','));
    cron = cron.replace('DAYS', days.join(','));

    return cron;
  };

  const isComplete =
    ((days.length > 0 && timezone !== '' && times.length > 0) || !isScheduled) &&
    hasKeywordHighlight !== '' &&
    alertTemplateId !== '';

  return (
    <>
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
              isDisabled={disabled}
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
                  isDisabled={!isScheduled || disabled}
                />
              </Styled.schedule>
              <Spacer size={3} />
              <DayPicker
                selected={days}
                onClick={handleSetDays}
                disabled={!isScheduled || disabled}
              />
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
            isDisabled={!isScheduled || disabled}
          />

          <Spacer size={7} />

          <Label required label="Choose the times" />

          <Styled.times disabled={!isScheduled}>
            <Text type="span" color={color.base.greyDark}>
              Early morning
            </Text>
            <Spacer size={3} />
            <Styled.timesOptions>
              {['01', '02', '03', '04', '05', '06'].map((time) => (
                <Styled.time
                  key={`time${time}`}
                  active={times.findIndex((t) => t === `${time}:00`) > -1}
                  onClick={() => !disabled && handleClick(`${time}:00`)}
                  disabled={!isScheduled || disabled}
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
              {['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'].map(
                (time) => (
                  <Styled.time
                    key={`time${time}`}
                    active={times.findIndex((t) => t === `${time}:00`) > -1}
                    onClick={() => !disabled && handleClick(`${time}:00`)}
                    disabled={!isScheduled || disabled}
                  >
                    {time}:00
                  </Styled.time>
                ),
              )}
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
                  onClick={() => !disabled && handleClick(`${time}:00`)}
                  disabled={!isScheduled || disabled}
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
              isChecked={hasKeywordHighlight === 'no'}
              onChange={setHasKeywordHighlight}
              isDisabled={disabled}
            />
            <HightlightActive width="40px" height="40px" />
            <Radio
              name="keyword-highlight"
              label="Yes"
              value="yes"
              isChecked={hasKeywordHighlight === 'yes'}
              onChange={setHasKeywordHighlight}
              isDisabled={disabled}
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
                isChecked={alertTemplateId === 'full'}
                onChange={setAlertTemplateId}
                isDisabled={disabled}
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
                isChecked={alertTemplateId === 'snippet'}
                onChange={setAlertTemplateId}
                isDisabled={disabled}
              />
              <Spacer size={2} />
              <Text type="bodySmall" color={color.base.greyDark}>
                Headline and first paragraph
              </Text>
            </div>
          </Styled.highlightOptions>
        </div>
      </Styled.scheduleColumns>

      {!disabled && (
        <>
          <Spacer size={15} />

          <Styled.actions>
            <Button
              type="text"
              inline
              label="Back"
              icon={Icons.ChevronLeftBold}
              onClick={() => setActiveStep(3)}
            />
            <Button
              inline
              label={alert.isPublished ? 'Save Alert' : 'Publish Alert'}
              icon={Icons.ChevronRightBold}
              iconAlignment="right"
              onClick={() =>
                editAlert &&
                editAlert({
                  isScheduled,
                  hasKeywordHighlight: hasKeywordHighlight === 'yes' ? true : false,
                  timezone,
                  alertTemplateId: alertTemplateId === 'full' ? 1 : 2,
                  schedule: cronTime(),
                })
              }
              disabled={!isComplete}
            />
          </Styled.actions>
        </>
      )}
    </>
  );
};

export default AlertStep4;
