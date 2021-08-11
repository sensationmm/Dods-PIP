import * as validation from './validation';

describe('validation functions', () => {
  describe('validateEmail()', () => {
    test('returns true for a valid email', () => {
      const email = 'hello@dods.co.uk';
      const isValid = validation.validateEmail(email);
      expect(isValid).toBe(true);
    });

    test('returns false if not an email address', () => {
      const email = 'hellodods';
      const isValid = validation.validateEmail(email);
      expect(isValid).toBe(false);
    });

    test('returns false if no @', () => {
      const email = 'hellodods.co.uk';
      const isValid = validation.validateEmail(email);
      expect(isValid).toBe(false);
    });

    test('returns false if no domain', () => {
      const email = 'hello@dods';
      const isValid = validation.validateEmail(email);
      expect(isValid).toBe(false);
    });
  });

  describe('validMatching()', () => {
    test('returns true for matching string', () => {
      const string1 = 'something';
      const string2 = 'something';
      const isValid = validation.validateMatching(string1, string2);
      expect(isValid).toBe(true);
    });

    test('returns false for non-matching string', () => {
      const string1 = 'something';
      const string2 = 'somethingelse';
      const isValid = validation.validateMatching(string1, string2);
      expect(isValid).toBe(false);
    });
  });

  describe('validateNumeric', () => {
    test('returns true for numbers', () => {
      const isValid = validation.validateNumeric('21');
      expect(isValid).toBe(true);
    });

    test('returns false for strings', () => {
      const isValid = validation.validateNumeric('abc');
      expect(isValid).toBe(false);
    });

    test('returns false if empty', () => {
      const isValid = validation.validateNumeric('');
      expect(isValid).toBe(false);
    });
  });

  describe('validateRequired()', () => {
    test('returns true if input is entered', () => {
      const input = 'some text';
      const isValid = validation.validateRequired(input);
      expect(isValid).toBe(true);
    });

    test('returns false if empty string', () => {
      const input = '';
      const isValid = validation.validateRequired(input);
      expect(isValid).toBe(false);
    });

    test('returns false if null value', () => {
      const input = null;
      const isValid = validation.validateRequired(input);
      expect(isValid).toBe(false);
    });

    test('returns false if undefined', () => {
      const input = undefined;
      const isValid = validation.validateRequired(input);
      expect(isValid).toBe(false);
    });

    test('returns false if empty array', () => {
      const input: Array<any> = [];
      const isValid = validation.validateRequired(input);
      expect(isValid).toBe(false);
    });
  });
});
