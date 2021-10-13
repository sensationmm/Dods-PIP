import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import { useRouter } from 'next/router';
import fetchJson from '../lib/fetchJson';
import * as Validation from '../utils/validation';
import { PasswordReset } from './password-reset.page';

jest.mock('../lib/fetchJson', () => jest.fn());
jest.mock('../utils/validation', () => ({
  validateRequired: jest.fn(),
  validatePassword: jest.fn(),
  validateMatching: jest.fn(),
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const SELECTOR_DIALOGUE_CONTAINER = '[data-test="dialogue-container"]';
const SELECTOR_DIALOGUE_CONFIRMATION = '[data-test="reset-confirmation"]';
const SELECTOR_WARNING_EXPIRED = '[data-test="code-expired-warning"]';
const SELECTOR_WARNING_REPEAT = '[data-test="repeat-password-warning"]';
const SELECTOR_LOADER = '[data-test="no-code-loader"]';
const SELECTOR_COMPONENT_ROOT = '[data-test="page-password-reset"]';
const SELECTOR_REQUEST_FORM = '[data-test="reset-request"]';
const SELECTOR_FORM_BUTTON = '[data-test="form-button"]';
const SELECTOR_BACK_BUTTON = '[data-test="button-back-to-login"]';
const SELECTOR_INPUT = '[data-test="reset-password"]';
const SELECTOR_INPUT_CONFIRM = '[data-test="reset-password-confirm"]';

describe('PasswordReset', () => {
  let dialogueContainer: ShallowWrapper;
  let wrapper: ShallowWrapper;

  const useRouterMock = useRouter as jest.Mock;
  const fetchJsonMock = fetchJson as jest.Mock;
  const validationMock = Validation;

  const getWrapper = () => shallow(<PasswordReset isLoading={false} setLoading={jest.fn()} />);
  const getDialogueContainer = () => wrapper?.find(SELECTOR_DIALOGUE_CONTAINER);

  const setFieldValidation = (required = false, password = false, matching = false) => {
    (validationMock.validateRequired as jest.Mock).mockReturnValue(required);
    (validationMock.validatePassword as jest.Mock).mockReturnValue({ valid: password });
    (validationMock.validateMatching as jest.Mock).mockReturnValue(matching);
  };

  describe('when `code` is NOT defined', () => {
    beforeEach(() => {
      useRouterMock.mockReturnValueOnce({ query: {} });
      wrapper = getWrapper();
    });

    it('renders the loader', () => {
      const noCodeLoader = wrapper.find(SELECTOR_LOADER);
      expect(noCodeLoader.exists()).toBe(true);
      expect(wrapper.getElements()).toHaveLength(1);
    });

    describe('and router is ready', () => {
      const pushFn = jest.fn();

      beforeEach(() => {
        useRouterMock.mockReturnValueOnce({
          query: {},
          isReady: true,
          push: pushFn,
        });
      });

      it('redirects to the home page', () => {
        wrapper = getWrapper();
        expect(pushFn).toHaveBeenCalledWith('/');
        expect(pushFn).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when a `code` IS defined', () => {
    const pushFn = jest.fn();

    beforeEach(() => {
      useRouterMock.mockReturnValue({ query: { code: '12345' }, push: pushFn });
      wrapper = getWrapper();
    });

    it('renders the component', () => {
      const component = wrapper.find(SELECTOR_COMPONENT_ROOT);
      expect(component.exists()).toBe(true);
      expect(wrapper.getElements()).toHaveLength(1);
    });

    it('renders password reset form', () => {
      const requestForm = wrapper.find(SELECTOR_REQUEST_FORM);
      dialogueContainer = getDialogueContainer();

      expect(requestForm.exists()).toBe(true);
      expect(dialogueContainer.children().getElements()).toHaveLength(1);
    });

    describe('and valid password fields are successfully submitted', () => {
      beforeEach(() => {
        fetchJsonMock.mockResolvedValueOnce({});

        setFieldValidation(true, true, true);

        const formButton = wrapper.find(SELECTOR_FORM_BUTTON);
        formButton.simulate('click');
      });

      it('renders password reset confirmation', () => {
        dialogueContainer = getDialogueContainer();
        const confirmation = wrapper.find(SELECTOR_DIALOGUE_CONFIRMATION);
        expect(confirmation.exists()).toBe(true);
        expect(dialogueContainer.children().getElements()).toHaveLength(1);
      });

      describe('and back to login button is clicked', () => {
        beforeEach(() => wrapper.find(SELECTOR_BACK_BUTTON).simulate('click'));

        it('navigates back to home page', () => {
          expect(pushFn).toHaveBeenCalledWith('/');
          expect(pushFn).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('and previously used passwords are submitted', () => {
      beforeEach(() => {
        fetchJsonMock.mockRejectedValueOnce({ data: { code: 401 } });

        setFieldValidation(true, true, true);

        const formButton = wrapper.find(SELECTOR_FORM_BUTTON);
        formButton.simulate('click');
      });

      it('renders repeat password warning in reset form', () => {
        dialogueContainer = getDialogueContainer();
        const resetForm = dialogueContainer.find(SELECTOR_REQUEST_FORM);
        const repeatPasswordWarning = dialogueContainer.find(SELECTOR_WARNING_REPEAT);

        expect(repeatPasswordWarning.exists()).toBe(true);
        expect(resetForm.exists()).toBe(true);
        expect(dialogueContainer.children().getElements()).toHaveLength(1);
      });
    });

    describe.each([
      ['expired', 'ExpiredCodeException'],
      ['mismatched', 'CodeMismatchException'],
    ])('and %s code is submitted', (name, codeName) => {
      beforeEach(() => {
        fetchJsonMock.mockRejectedValueOnce({ data: { name: codeName } });

        setFieldValidation(true, true, true);

        const formButton = wrapper.find(SELECTOR_FORM_BUTTON);
        formButton.simulate('click');
      });

      it('renders code expired warning in reset form', () => {
        dialogueContainer = getDialogueContainer();
        const resetForm = dialogueContainer.find(SELECTOR_REQUEST_FORM);
        const codeExpiredWarning = dialogueContainer.find(SELECTOR_WARNING_EXPIRED);

        expect(codeExpiredWarning.exists()).toBe(true);
        expect(resetForm.exists()).toBe(true);
        expect(dialogueContainer.children().getElements()).toHaveLength(1);
      });
    });

    describe.each([
      ['password is invalid', 1],
      ["passwords don't match", 2],
      ['passwords are empty', 3],
    ])('and %s', (name, testCase) => {
      beforeEach(() => {
        if (testCase === 1) setFieldValidation(true, false, true);
        if (testCase === 2) setFieldValidation(true, true, false);
        if (testCase === 3) setFieldValidation(false, true, true);
        wrapper.find(SELECTOR_FORM_BUTTON).simulate('click');
      });

      it('should not submit data', () => {
        expect(fetchJsonMock).not.toHaveBeenCalled();
      });

      it('renders correct validation messages', () => {
        const resetPassword = wrapper.find(SELECTOR_INPUT).html();
        const resetPasswordConfirm = wrapper.find(SELECTOR_INPUT_CONFIRM).html();

        if (testCase === 1) expect(resetPassword).toContain('Password must meet all criteria');
        if (testCase === 2) expect(resetPasswordConfirm).toContain('Passwords must match');
        if (testCase === 3) {
          expect(resetPassword).toContain('Password is required');
          expect(resetPasswordConfirm).toContain('Confirm password is required');
        }
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
