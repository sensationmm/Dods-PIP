import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Label from '../../components/_form/Label';
import Select from '../../components/_form/Select';
import PageHeader from '../../components/_layout/PageHeader';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Button from '../../components/Button';
import { Icons } from '../../components/Icon/assets';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import { Api, BASE_URI } from '../../utils/api';
import { RoleType } from './add-client/type';
import * as Styled from './add-user.styles';
import AddUserForm, { FormFields } from './add-user-form';

interface AddUserProps extends LoadingHOCProps {}

export const AddUser: React.FC<AddUserProps> = ({ addNotification, setLoading }) => {
  const router = useRouter();
  const { user } = useUser();
  const [userTypeSelectDisabled, setUserTypeSelectDisabled] = React.useState(false);
  const [formFields, setFormFields] = useState<FormFields>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    emailAddress2: '',
    telephoneNumber: '',
    telephoneNumber2: '',
    account: '',
    jobTitle: '',
    userType: RoleType.ClientUser,
  });
  const [userTypeOptions, setUserTypeOptions] = React.useState([
    { label: 'Dods Consultant', value: RoleType.DodsConsultant },
    { label: 'Client User', value: RoleType.ClientUser },
  ]);

  const [errors, setErrors] = useState<Partial<FormFields>>({});

  React.useEffect(() => {
    if (router.query?.type === 'accountsAddNewUser') {
      setUserTypeSelectDisabled(true);
      setFormFields({
        ...formFields,
        ...{ userType: RoleType.ClientUser, account: String(router.query?.accountId) },
      });
      setUserTypeOptions([{ label: 'Client User', value: RoleType.ClientUser }]);
    }
  }, [router.query]);

  const isClientUser = formFields.userType === RoleType.ClientUser;
  const hasValue = (value: string) => /^\w/.test(value);

  const isComplete =
    hasValue(formFields.firstName) &&
    hasValue(formFields.lastName) &&
    hasValue(formFields.emailAddress) &&
    (!isClientUser || hasValue(formFields.account)) &&
    Object.keys(errors).length === 0;

  const setFormFieldProp = (field: keyof FormFields, value: string) => {
    setFormFields({ ...formFields, ...{ [field]: value } });
  };

  const createUser = async () => {
    setLoading(true);
    const data = {
      userProfile: {
        title: formFields.jobTitle,
        first_name: formFields.firstName,
        last_name: formFields.lastName,
        primary_email_address: formFields.emailAddress,
        telephone_number_1: formFields.telephoneNumber,
        ...(formFields.emailAddress2 && { secondary_email_address: formFields.emailAddress2 }),
        ...(formFields.telephoneNumber2 && {
          telephone_number_2: formFields.telephoneNumber2,
        }),
        role_id: formFields.userType,
      },
      clientAccountId: isClientUser ? formFields.account : user?.clientAccountId,
      teamMemberType: formFields.userType === RoleType.ClientUser ? 3 : 1,
    };

    try {
      const result = await fetchJson(
        `${BASE_URI}${Api.ClientAccount}/${user?.clientAccountId}${Api.TeamMemberCreate}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );
      if (result.success) {
        if (router.query?.referrer) {
          await router.push(`${router.query?.referrer}?userAdded=true` as string);
        } else {
          router.push(`/account-management/users?userAdded=true` as string);
        }
      }
    } catch (e) {
      addNotification({
        type: 'warn',
        title: 'Error',
        text: e.data.message,
      });
    }
    setLoading(false);
  };

  return (
    <Styled.wrapper data-testid="page-add-user">
      <Head>
        <title>Dods PIP | Account Management | Add User</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PageHeader
          title="Create New User"
          content={
            <Styled.userType>
              <Label htmlFor="user-type" label="User type" />
              <Select
                id="user-type"
                testId={'user-type'}
                options={userTypeOptions}
                value={formFields.userType}
                onChange={(value) => setFormFieldProp('userType', value)}
                isDisabled={userTypeSelectDisabled}
              />
            </Styled.userType>
          }
          flexDirection="column"
        />

        <Panel bgColor={color.base.ivory} isNarrow>
          <Styled.content>
            <AddUserForm
              fieldData={formFields}
              onFieldChange={setFormFieldProp}
              isClientUser={isClientUser}
              errors={errors}
              setErrors={setErrors}
            />

            <div>
              <Spacer size={0.5} />
              <Styled.pageActions>
                <Button
                  isSmall
                  testId="button-back"
                  type="secondary"
                  label="Back"
                  icon={Icons.ChevronLeft}
                  onClick={() => router.push('/account-management/users')}
                />
                <Button
                  isSmall
                  testId="button-create-user"
                  label="Create User"
                  icon={Icons.Tick}
                  iconAlignment="right"
                  disabled={!isComplete}
                  onClick={createUser}
                />
              </Styled.pageActions>
            </div>
          </Styled.content>
        </Panel>
      </main>
    </Styled.wrapper>
  );
};

export default LoadingHOC(AddUser);
