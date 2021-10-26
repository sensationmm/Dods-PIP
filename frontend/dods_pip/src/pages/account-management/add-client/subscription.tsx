import { add, format } from 'date-fns';
import React from 'react';

import Checkbox from '../../../components/_form/Checkbox';
import DatePicker from '../../../components/_form/DatePicker';
import Label from '../../../components/_form/Label';
import NumberPicker from '../../../components/_form/NumberPicker';
import RadioGroup from '../../../components/_form/RadioGroup';
import Select from '../../../components/_form/Select';
import SelectMulti from '../../../components/_form/SelectMulti';
import PageActions from '../../../components/_layout/PageActions';
import Panel from '../../../components/_layout/Panel';
import SectionHeader from '../../../components/_layout/SectionHeader';
import Spacer from '../../../components/_layout/Spacer';
import Button from '../../../components/Button';
import { Icons } from '../../../components/Icon/assets';
import { NotificationProps } from '../../../components/Notification';
import Text from '../../../components/Text';
import color from '../../../globals/color';
import fetchJson from '../../../lib/fetchJson';
import { inArray } from '../../../utils/array';
import * as Styled from './index.styles';

export type Errors = {
  location?: string;
  contentType?: string;
  userSeats?: string;
  consultantHours?: string;
  renewalType?: string;
  startDate?: string;
  endDate?: string;
  endDateType?: string;
};

export interface SubscriptionProps {
  accountId: string;
  addNotification: (props: NotificationProps) => void;
  setLoading: (state: boolean) => void;
  location: Array<string>;
  setLocation: (val: Array<string>) => void;
  contentType: Array<string>;
  setContentType: (val: Array<string>) => void;
  userSeats: string;
  setUserSeats: (val: string) => void;
  consultantHours: string;
  setConsultantHours: (val: string) => void;
  renewalType: string;
  setRenewalType: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  endDateType: string;
  setEndDateType: (val: string) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({
  location,
  setLocation,
  contentType,
  setContentType,
  userSeats,
  setUserSeats,
  consultantHours,
  setConsultantHours,
  renewalType,
  setRenewalType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  endDateType,
  setEndDateType,
  errors,
  setErrors,
  onSubmit,
  onBack,
}) => {
  enum RenewalType {
    Annual = 'annual',
    EndDate = 'endDate',
  }

  enum EndDateType {
    One = '1year',
    Two = '2year',
    Three = '3year',
    Custom = 'custom',
  }

  React.useEffect(() => {
    switch (endDateType) {
      case EndDateType.One:
        setEndDate(format(add(new Date(startDate), { years: 1 }), 'yyyy-MM-dd'));
        break;
      case EndDateType.Two:
        setEndDate(format(add(new Date(startDate), { years: 2 }), 'yyyy-MM-dd'));
        break;
      case EndDateType.Three:
        setEndDate(format(add(new Date(startDate), { years: 3 }), 'yyyy-MM-dd'));
        break;
      case EndDateType.Custom:
        setEndDate('');
        break;
    }
  }, [endDateType]);

  const isComplete =
    location.length > 0 &&
    contentType.length > 0 &&
    userSeats !== '' &&
    consultantHours !== '' &&
    renewalType !== '' &&
    startDate !== '' &&
    (renewalType === RenewalType.Annual ||
      (renewalType === RenewalType.EndDate &&
        endDateType !== '' &&
        endDateType !== EndDateType.Custom) ||
      (renewalType === RenewalType.EndDate &&
        endDateType === EndDateType.Custom &&
        endDate !== '')) &&
    Object.keys(errors).length === 0;

  const handleSetLocation = (val: string) => {
    if (inArray(val, location)) {
      const vals = location.slice();
      const index = location.indexOf(val);
      vals.splice(index, 1);
      setLocation(vals);
    } else {
      setLocation([...location, val]);
    }
  };

  const validateContentType = () => {
    const formErrors = { ...errors };
    if (contentType.length === 0) {
      formErrors.contentType = 'You must choose at least one';
    } else {
      delete formErrors.contentType;
    }
    setErrors(formErrors);
  };

  const setUserSeatsError = (err?: string) => {
    const formErrors = { ...errors };
    if (err !== undefined) {
      formErrors.userSeats = err;
    } else {
      delete formErrors.userSeats;
    }
    setErrors(formErrors);
  };

  const setConsultantHoursError = (err?: string) => {
    const formErrors = { ...errors };
    if (err !== undefined) {
      formErrors.consultantHours = err;
    } else {
      delete formErrors.consultantHours;
    }
    setErrors(formErrors);
  };

  const validateEndDate = () => {
    const formErrors = { ...errors };
    if (endDate === '') {
      formErrors.endDate = 'You must choose an end date';
    } else {
      delete formErrors.endDate;
    }
    setErrors(formErrors);
  };

  const validateEndDateType = () => {
    const formErrors = { ...errors };
    if (endDateType === '') {
      formErrors.endDateType = 'You must choose an end date';
    } else {
      delete formErrors.endDateType;
    }
    setErrors(formErrors);
  };

  return (
    <main data-test="subscription">
      <Panel isNarrow bgColor={color.base.ivory}>
        <SectionHeader
          title="Subscription Type"
          subtitle="Please select the subscription that suits this Account."
          icon={Icons.Subscription}
        />

        <Spacer size={11} />

        <Styled.locations>
          <Styled.allocationTitle>
            <Label label="Location" required />

            <Spacer size={3} />

            <Styled.locations>
              <Checkbox
                id="location-eu"
                label="EU Coverage"
                isChecked={inArray('eu', location)}
                onChange={() => handleSetLocation('eu')}
              />
              <Checkbox
                id="location-uk"
                label="UK Coverage"
                isChecked={inArray('uk', location)}
                onChange={() => handleSetLocation('uk')}
              />
            </Styled.locations>
          </Styled.allocationTitle>

          <SelectMulti
            id="content-type"
            label="Type of Content"
            isFullWidth={false}
            required
            value={contentType}
            onChange={setContentType}
            options={[
              { value: 'option1', label: 'Option One' },
              { value: 'option2', label: 'Option Two' },
              { value: 'option3', label: 'Option Three' },
              { value: 'option4', label: 'Option Four' },
              { value: 'option5', label: 'Option Five' },
            ]}
            onBlur={validateContentType}
            error={errors.contentType}
          />
        </Styled.locations>

        <Spacer size={10} />

        <hr />

        <Spacer size={11} />

        <Styled.locations>
          <Styled.allocationTitle>
            <Text type="h3" headingStyle="titleSmall">
              Allocation
            </Text>
            <Spacer size={1} />
            <Text type="bodySmall" color={color.theme.blueDark}>
              Select an annual allocation for this account
            </Text>
          </Styled.allocationTitle>

          <NumberPicker
            id="user-seats"
            label="User Seats"
            required
            value={parseInt(userSeats)}
            onChange={(value) => setUserSeats(value.toString())}
            error={errors.userSeats}
            minVal={1}
            onBlur={(error) => setUserSeatsError(error)}
          />

          <NumberPicker
            id="consultant-hours"
            label="Consultant hours"
            required
            value={parseInt(consultantHours)}
            onChange={(value) => setConsultantHours(value.toString())}
            error={errors.consultantHours}
            onBlur={(error) => setConsultantHoursError(error)}
          />
        </Styled.locations>

        <Spacer size={12} />

        <SectionHeader
          title="Subscription Time"
          subtitle={[
            'Please choose the date you’d like the Subscription to begin.',
            'The subscription will automatically renew on an annual basis.',
          ]}
          icon={Icons.Calendar}
        />

        <Spacer size={9} />

        <Styled.wrapper>
          <RadioGroup
            groupName="renewal-type"
            label="Renewal type"
            required={true}
            onChange={setRenewalType}
            items={[
              { label: 'Annual Renewal', value: RenewalType.Annual },
              { label: 'End date', value: RenewalType.EndDate },
            ]}
            selectedValue={renewalType}
          />
        </Styled.wrapper>

        <Spacer size={8} />

        <Styled.dates>
          <DatePicker
            id="start-date"
            label="Assign a start date"
            required
            value={startDate}
            minDate={format(new Date(), 'yyyy-MM-dd').toString()}
            onChange={setStartDate}
            helperText="dd/mm/yyyy format"
            maxDate={endDate}
          />

          {renewalType === RenewalType.EndDate && endDateType === EndDateType.Custom && (
            <DatePicker
              id="end-date"
              label="Assign an end date"
              required
              value={endDate}
              onChange={setEndDate}
              helperText="dd/mm/yyyy format"
              minDate={startDate}
              onBlur={validateEndDate}
              error={errors.endDate}
            />
          )}

          {renewalType === RenewalType.EndDate && (
            <Select
              id="end-date-type"
              label="End date"
              required
              isFullWidth={false}
              value={endDateType}
              placeholder="Choose"
              onChange={setEndDateType}
              options={[
                { label: 'In 1 year', value: EndDateType.One },
                { label: 'In 2 years', value: EndDateType.Two },
                { label: 'In 3 years', value: EndDateType.Three },
                { label: 'Custom', value: EndDateType.Custom },
              ]}
              onBlur={validateEndDateType}
              error={errors.endDateType}
            />
          )}
        </Styled.dates>

        <Spacer size={20} />

        <PageActions data-test="page-actions" hasBack backHandler={onBack}>
          <Button
            data-test="continue-button"
            label="Save and continue"
            onClick={onSubmit}
            icon={Icons.ChevronRightBold}
            iconAlignment="right"
            disabled={!isComplete}
          />
        </PageActions>
      </Panel>
    </main>
  );
};

export default Subscription;
