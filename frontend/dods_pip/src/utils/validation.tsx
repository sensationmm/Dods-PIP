import { PasswordStrengthProps } from '../components/PasswordStrength';

export const validateEmail = (email: string): boolean => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  return !email || re.test(email);
};

export const validateMatching = (input: string, inputToMatch: string): boolean => {
  return input === inputToMatch && !!input;
};

export const validateNumeric = (input: number): boolean => {
  if (input.toString() === '') {
    return false;
  }

  return !isNaN(input);
};

export const validateRequired = (input: string): boolean => {
  return !!input && (!Array.isArray(input) || (Array.isArray(input) && input.length > 0));
};

type ValidatePasswordReturn = {
  valid: boolean;
  results: PasswordStrengthProps;
};

export const validatePassword = (input: string): ValidatePasswordReturn => {
  let isValid = false;
  const results: PasswordStrengthProps = {
    number: false,
    uppercase: false,
    lowercase: false,
    special: false,
    length8: false,
  };

  if (input.length >= 8) {
    results.length8 = true;
  }

  if (/\d/.test(input)) {
    results.number = true;
  }

  if (/[A-Z]/.test(input)) {
    results.uppercase = true;
  }

  if (/[a-z]/.test(input)) {
    results.lowercase = true;
  }

  if (/\W+/.test(input)) {
    results.special = true;
  }

  if (Object.keys(results).every((k) => results[k as keyof PasswordStrengthProps])) {
    isValid = true;
  }

  return {
    valid: isValid,
    results: results,
  };
};
