import { add, format } from 'date-fns';
import React from 'react';

import Checkbox from '../../../components/_form/Checkbox';
import DatePicker from '../../../components/_form/DatePicker';
import Label from '../../../components/_form/Label';
import NumberPicker from '../../../components/_form/NumberPicker';
import RadioGroup from '../../../components/_form/RadioGroup';
import Select from '../../../components/_form/Select';
import PageActions from '../../../components/_layout/PageActions';
import Panel from '../../../components/_layout/Panel';
import SectionHeader from '../../../components/_layout/SectionHeader';
import Spacer from '../../../components/_layout/Spacer';
import Button from '../../../components/Button';
import { Icons } from '../../../components/Icon/assets';
import Text from '../../../components/Text';
import color from '../../../globals/color';
import { PushNotificationProps } from '../../../hoc/LoadingHOC';
import fetchJson from '../../../lib/fetchJson';
import useSubscriptionTypes from '../../../lib/useSubscriptionTypes';
import { Api, BASE_URI } from '../../../utils/api';
import * as Styled from './index.styles';
import { DateFormat, EndDateType, RenewalType } from './type';

export type Errors = {
  location?: string;
  subscriptionType?: string;
  userSeats?: string;
  consultantHours?: string;
  renewalType?: string;
  startDate?: string;
  endDate?: string;
  endDateType?: string;
};

export interface SubscriptionProps {
  accountId: string;
  addNotification: (props: PushNotificationProps) => void;
  setLoading: (state: boolean) => void;
  editMode: boolean;
  onCloseEditModal: () => void;
  isEU: boolean;
  setIsEU: (val: boolean) => void;
  isUK: boolean;
  setIsUK: (val: boolean) => void;
  subscriptionType: string;
  setSubscriptionType: (val: string) => void;
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
  onEditSuccess: (val: Record<any, unknown>) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({
  accountId,
  addNotification,
  setLoading,
  editMode,
  onCloseEditModal,
  isEU,
  setIsEU,
  isUK,
  setIsUK,
  subscriptionType,
  setSubscriptionType,
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
  onEditSuccess,
}) => {
  const [endDateHelper, setEndDateHelper] = React.useState<string>('');
  const [pristine, setPristine] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false); // editMode - disabled save button when saving request in progress

  React.useEffect(() => {
    let date;

    if (startDate !== '') {
      switch (endDateType) {
        case EndDateType.One:
          date = add(new Date(startDate), { years: 1 });
          setEndDate(format(date, DateFormat.API));
          setEndDateHelper(`Expires on: ${format(date, DateFormat.UI)}`);
          break;
        case EndDateType.Two:
          date = add(new Date(startDate), { years: 2 });
          setEndDate(format(date, DateFormat.API));
          setEndDateHelper(`Expires on: ${format(date, DateFormat.UI)}`);
          break;
        case EndDateType.Three:
          date = add(new Date(startDate), { years: 3 });
          setEndDate(format(date, DateFormat.API));
          setEndDateHelper(`Expires on: ${format(date, DateFormat.UI)}`);
          break;
        case EndDateType.Trial:
          date = add(new Date(startDate), { weeks: 2 });
          setEndDate(format(date, DateFormat.API));
          setEndDateHelper(`Expires on: ${format(date, DateFormat.UI)}`);
          break;
        case EndDateType.Custom:
          if (endDate !== '') {
            date = new Date(endDate);
            setEndDate(format(date, DateFormat.API));
          }
          setEndDateHelper('');
          break;
      }
    }
  }, [startDate, endDateType]);

  const isComplete =
    (isEU || isUK) &&
    subscriptionType &&
    subscriptionType !== '' &&
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

  const subscriptionPlaceholder = 'Select a subscription type';
  const { subscriptionList } = useSubscriptionTypes({ placeholder: subscriptionPlaceholder });

  const handleSave = async () => {
    setLoading(true);
    setSaving(true);

    const rollover = renewalType === RenewalType.Annual;
    const payload = {
      contractRollover: rollover,
      contractStartDate: startDate,
      contractEndDate: rollover ? '' : endDate,
      subscriptionSeats: parseInt(userSeats, 10),
      consultantHours: parseInt(consultantHours, 10),
      isEU,
      isUK,
      subscription: subscriptionType,
    };

    const response = await fetchJson(`${BASE_URI}${Api.ClientAccount}/${accountId}/subscription`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    const { message = '', success = false } = response;

    setLoading(false);
    setSaving(false);

    if (success) {
      if (editMode) {
        onEditSuccess(payload);
        onCloseEditModal(); // close modal windows
      } else {
        onSubmit(); // go to next step
      }
    } else {
      // show server error
      addNotification({
        type: 'warn',
        title: 'Error',
        text: message,
      });
    }
  };

  const validateSubscriptionType = () => {
    const formErrors = { ...errors };
    if (subscriptionType === '') {
      formErrors.subscriptionType = 'You must choose one';
    } else {
      delete formErrors.subscriptionType;
    }
    setPristine(false);
    setErrors(formErrors);
  };

  const setUserSeatsError = (err?: string) => {
    const formErrors = { ...errors };
    if (err !== undefined) {
      formErrors.userSeats = err;
    } else {
      delete formErrors.userSeats;
    }
    setPristine(false);
    setErrors(formErrors);
  };

  const setConsultantHoursError = (err?: string) => {
    const formErrors = { ...errors };
    if (err !== undefined) {
      formErrors.consultantHours = err;
    } else {
      delete formErrors.consultantHours;
    }
    setPristine(false);
    setErrors(formErrors);
  };

  const validateEndDate = () => {
    const formErrors = { ...errors };
    if (endDate === '') {
      formErrors.endDate = 'You must choose an end date';
    } else {
      delete formErrors.endDate;
    }
    setPristine(false);
    setErrors(formErrors);
  };

  const validateEndDateType = () => {
    const formErrors = { ...errors };
    if (endDateType === '') {
      formErrors.endDateType = 'You must choose an end date';
    } else {
      delete formErrors.endDateType;
    }
    setPristine(false);
    setErrors(formErrors);
  };

  const onChangeRenewalType = (val: string) => {
    setPristine(false);
    setRenewalType(val);

    if (val === RenewalType.Annual) {
      setEndDateType('');
      setEndDate('');
    }
  };

  return (
    <main data-test="subscription">
      <Panel
        isPadded={!editMode}
        isNarrow={!editMode}
        bgColor={editMode ? color.base.white : color.base.ivory}
      >
        <SectionHeader
          title="Subscription details "
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
                isChecked={isEU}
                onChange={() => {
                  setPristine(false);
                  setIsEU(!isEU);
                }}
              />
              <Checkbox
                id="location-uk"
                label="UK Coverage"
                isChecked={isUK}
                onChange={() => {
                  setPristine(false);
                  setIsUK(!isUK);
                }}
              />
            </Styled.locations>
          </Styled.allocationTitle>

          <Select
            id="subscription-type"
            label="Type"
            isFullWidth={false}
            required
            value={subscriptionType}
            onChange={setSubscriptionType}
            options={subscriptionList}
            onBlur={validateSubscriptionType}
            error={errors.subscriptionType}
            placeholder={subscriptionPlaceholder}
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
            onChange={(value) => {
              setPristine(false);
              setUserSeats(value.toString());
            }}
            error={errors.userSeats}
            minVal={1}
            onBlur={(error) => setUserSeatsError(error)}
          />

          <NumberPicker
            id="consultant-hours"
            label="Consultant hours"
            required
            value={parseInt(consultantHours)}
            onChange={(value) => {
              setPristine(false);
              setConsultantHours(value.toString());
            }}
            error={errors.consultantHours}
            onBlur={(error) => setConsultantHoursError(error)}
          />
        </Styled.locations>

        <Spacer size={12} />

        <SectionHeader
          title="Subscription Period"
          subtitle={'Please select a subscription renewal type for this account.'}
          icon={Icons.Calendar}
        />

        <Spacer size={9} />

        <Styled.wrapper>
          <RadioGroup
            groupName="renewal-type"
            label="Renewal type"
            required={true}
            onChange={onChangeRenewalType}
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
            minDate={format(new Date(), DateFormat.API).toString()}
            onChange={(val) => {
              setPristine(false);
              setStartDate(val);
            }}
            helperText="dd/mm/yyyy format"
            maxDate={endDate}
          />

          {renewalType === RenewalType.EndDate && endDateType === EndDateType.Custom && (
            <DatePicker
              id="end-date"
              label="Assign an end date"
              required
              value={endDate}
              onChange={(val) => {
                setPristine(false);
                setEndDate(val);
              }}
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
                { label: 'Trial (2 weeks)', value: EndDateType.Trial },
                { label: 'Custom', value: EndDateType.Custom },
              ]}
              onBlur={validateEndDateType}
              error={errors.endDateType}
              helperText={endDateHelper}
            />
          )}
        </Styled.dates>

        <Spacer size={20} />

        {editMode ? (
          <PageActions isRightAligned={true} data-test="page-actions">
            <Button
              data-test="cancel-button"
              label="Cancel"
              type="secondary"
              onClick={onCloseEditModal}
              disabled={saving}
            />
            <Button
              data-test="continue-button"
              label="Save"
              onClick={handleSave}
              icon={Icons.TickBold}
              iconAlignment="left"
              disabled={!isComplete || pristine || saving}
            />
          </PageActions>
        ) : (
          <PageActions data-test="page-actions" hasBack backHandler={onBack}>
            <Button
              data-test="continue-button"
              label="Save and continue"
              onClick={handleSave}
              icon={Icons.ChevronRightBold}
              iconAlignment="right"
              disabled={!isComplete}
            />
          </PageActions>
        )}
      </Panel>
    </main>
  );
};

export default Subscription;
