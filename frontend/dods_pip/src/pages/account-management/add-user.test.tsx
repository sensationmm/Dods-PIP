import React from 'react';
import { AddUser } from './add-user.page';
import { act, cleanup, fireEvent, render, RenderResult } from '@testing-library/react';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import { useRouter } from 'next/router';

jest.mock('../../lib/fetchJson', () => jest.fn());

jest.mock('../../lib/useUser', () => {
  return jest.fn().mockImplementation(() => {
    return { user: { isLoggedIn: true, clientAccountId: '1234567890', isDodsUser: true } };
  });
});

const mockRouterPushFn = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: mockRouterPushFn,
    query: {
      pageAccountName: 'asd',
    },
  })),
}));

const getRenderedComponent = async (): Promise<RenderResult> => {
  const renderer = render(
    <AddUser isLoading={false} setLoading={jest.fn()} addNotification={false} />,
  );

  await renderer.findByTestId('page-add-user');
  return renderer;
};

const clickSelectOption = (context: RenderResult, testId: string, optionText: string) => {
  const $userTypeSelect = context.queryByTestId(testId) as HTMLDivElement;
  ($userTypeSelect.querySelector(SELECTOR_SELECT_TRIGGER) as HTMLDivElement).click();
  const $options = Array.from(
    $userTypeSelect.querySelector(SELECTOR_SELECT_DROPDOWN).children,
  ) as Element[];
  (
    $options.find((item) => RegExp(optionText, 'i').test(item.textContent)) as HTMLDivElement
  )?.click();
};

const useUserMock = useUser as jest.Mock;
const useRouterMock = useRouter as jest.Mock;
const fetchJsonMock = fetchJson as jest.Mock;

const SELECTOR_SELECT_TRIGGER = '[data-test="select-trigger"';
const SELECTOR_SELECT_DROPDOWN = '[data-test="component-dropdown"]';

const TEST_ID_USER_TYPE = 'user-type';
const TEST_ID_JOB_TITLE = 'job-title';
const TEST_ID_ACCOUNT = 'account';
const TEST_ID_ACCOUNT_DROPDOWN = 'account-dropdown';
const TEST_ID_FIRST_NAME = 'first-name';
const TEST_ID_LAST_NAME = 'last-name';
const TEST_ID_EMAIL = 'email-address';
const TEST_ID_EMAIL_2 = 'email-address-2';
const TEST_ID_PHONE = 'telephone-number';
const TEST_ID_PHONE_2 = 'telephone-number-2';
const TEST_ID_BACK = 'button-back';
const TEST_ID_CREATE_USER = 'button-create-user';

describe('AddUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('user type field should default to `client user`', async () => {
    const component = await getRenderedComponent();
    const $userTypeSelect = component.queryByTestId(TEST_ID_USER_TYPE) as HTMLDivElement;
    const $userTypeInput = $userTypeSelect.querySelector('input');
    expect($userTypeInput.value).toBe('Client User');
  });

  it.each<[string, string]>([
    ['first name field', TEST_ID_FIRST_NAME],
    ['last name field', TEST_ID_LAST_NAME],
    ['email address field', TEST_ID_EMAIL],
    ['secondary email address field', TEST_ID_EMAIL_2],
    ['phone number field', TEST_ID_PHONE],
    ['secondary phone number field', TEST_ID_PHONE_2],
    ['job title field', TEST_ID_JOB_TITLE],
    ['account field', TEST_ID_ACCOUNT],
    ['back button', TEST_ID_BACK],
    ['create user button', TEST_ID_BACK],
  ])('should render %s field', async (name, testId) => {
    const component = await getRenderedComponent();

    expect(component.queryByTestId(testId)).not.toBeNull();
  });

  describe('when user is `Dods Consultant`', () => {
    let component;
    beforeEach(async () => {
      component = await getRenderedComponent();
      act(() => clickSelectOption(component, 'user-type', 'Dods Consultant'));
    });

    it.each<[string, string]>([
      ['job title', TEST_ID_JOB_TITLE],
      ['account', TEST_ID_ACCOUNT],
    ])('should NOT render %s field', async (name, testId) => {
      expect(component.queryByTestId(testId)).toBeNull();
    });
  });

  describe('when `back` button is clicked', () => {
    beforeEach(async () => {
      const component = await getRenderedComponent();
      const $backButton = component.queryByTestId(TEST_ID_BACK) as HTMLButtonElement;
      $backButton.click();
    });
    it('should navigate to users page', () => {
      expect(mockRouterPushFn).toHaveBeenCalledWith('/account-management/users');
      expect(mockRouterPushFn).toHaveBeenCalledTimes(1);
    });
  });

  it('should validate all form fields', () => {});

  it('should validate account input', () => {});

  describe('when form is incomplete', () => {
    let component;
    beforeEach(async () => {
      component = await getRenderedComponent();
      const $inputs = Array.from(component.container.querySelectorAll('input') as HTMLCollection);
      $inputs.forEach(($input) => {
        fireEvent.blur($input, { target: { value: '' } });
      });
    });

    it('should not be submittable', () => {
      expect(component.queryByTestId(TEST_ID_CREATE_USER)).toHaveProperty('disabled', true);
    });
  });

  describe.skip('when form is valid', () => {
    let component: RenderResult;
    beforeEach(async () => {
      fetchJsonMock.mockResolvedValueOnce({ success: true });

      component = await getRenderedComponent();

      component.getByTestId(TEST_ID_ACCOUNT).click();
      (component.getByTestId(TEST_ID_ACCOUNT_DROPDOWN).children[0] as HTMLDivElement).click();

      [
        { testId: TEST_ID_JOB_TITLE, validinput: 'developer' },
        { testId: TEST_ID_FIRST_NAME, validinput: 'Seymour' },
        { testId: TEST_ID_LAST_NAME, validinput: 'Buttz' },
        { testId: TEST_ID_EMAIL, validinput: 'seymour@buttz.com' },
        { testId: TEST_ID_PHONE, validinput: '07123080775' },
      ].forEach((field) => {
        const $input = component.getByTestId(field.testId);
        fireEvent.change($input, { target: { value: field.validinput } });
      });
    });

    it('should be submittable', () => {
      expect(component.queryByTestId(TEST_ID_CREATE_USER)).not.toHaveProperty('disabled', true);
    });

    describe('and `create user` button is clicked', () => {
      beforeEach(() => {
        component.queryByTestId(TEST_ID_CREATE_USER).click();
      });

      it('should submit the form data', () => {
        expect(fetchJsonMock).toHaveBeenLastCalledWith(
          '/api/clientaccount/1234567890/teammember/new',
          {
            body: '{"userProfile":{"title":"developer","first_name":"Seymour","last_name":"Buttz","primary_email_address":"seymour@buttz.com","telephone_number_1":"07123080775","role_id":"24e7ca86-1788-4b6e-b153-9c963dc928cb"},"clientAccountId":"d4bbbd4b-e02f-4343-a7e9-397eea2b1bcd","teamMemberType":1}',
            method: 'POST',
          },
        );
        expect(fetchJsonMock).toHaveBeenCalledTimes(1);
      });

      describe('and there is a `referrer` query parameter', () => {
        it('should navigate to the referrer path', () => {});
      });
    });
  });
});
