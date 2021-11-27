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

    it('allows printable characters', () => {
      const email = "hello!#$%&'*+-/=?^_`{|}~@dods.com";
      const isValid = validation.validateEmail(email);
      expect(isValid).toBe(true);
    });

    it('does not allow successive `.`', () => {
      const email = 'hello..you@dods.com';
      const isValid = validation.validateEmail(email);
      expect(isValid).toBe(false);
    });

    it('does not allow leading `.`', () => {
      const email = '.hello.you@dods.com';
      const isValid = validation.validateEmail(email);
      expect(isValid).toBe(false);
    });

    it('does not allow trailing `.`', () => {
      const email = 'hello.@dods.com';
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

  describe('validateNumeric()', () => {
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

  describe('validatePassword()', () => {
    test('returns false if less than 8 chars', () => {
      const password = 'Passwo';
      const result = validation.validatePassword(password);
      expect(result).toEqual({
        valid: false,
        results: {
          number: false,
          uppercase: true,
          lowercase: true,
          special: false,
          length8: false,
        },
      });
    });

    test('returns false if no numbers', () => {
      const password = 'Password';
      const result = validation.validatePassword(password);
      expect(result).toEqual({
        valid: false,
        results: {
          number: false,
          uppercase: true,
          lowercase: true,
          special: false,
          length8: true,
        },
      });
    });

    test('returns false if no uppercase', () => {
      const password = 'password1';
      const result = validation.validatePassword(password);
      expect(result).toEqual({
        valid: false,
        results: {
          number: true,
          uppercase: false,
          lowercase: true,
          special: false,
          length8: true,
        },
      });
    });

    test('returns false if no lowercase', () => {
      const password = 'PASSWORD1';
      const result = validation.validatePassword(password);
      expect(result).toEqual({
        valid: false,
        results: {
          number: true,
          uppercase: true,
          lowercase: false,
          special: false,
          length8: true,
        },
      });
    });

    test('returns false if no special characters', () => {
      const password = 'Password1';
      const result = validation.validatePassword(password);
      expect(result).toEqual({
        valid: false,
        results: {
          number: true,
          uppercase: true,
          lowercase: true,
          special: false,
          length8: true,
        },
      });
    });

    test('returns true for a valid password', () => {
      const password = 'Password1!';
      const result = validation.validatePassword(password);
      expect(result).toEqual({
        valid: true,
        results: {
          number: true,
          uppercase: true,
          lowercase: true,
          special: true,
          length8: true,
        },
      });
    });
  });

  describe('validatePhone()', () => {
    test('returns true for numeric string with phone number chars', () => {
      const string = '(+44)1234567';
      const isValid = validation.validatePhone(string);
      expect(isValid).toBe(true);
    });

    test('returns false for non-numeric string', () => {
      const string = '(+44)123456asd';
      const isValid = validation.validatePhone(string);
      expect(isValid).toBe(false);
    });

    test('returns false if value is an empty string', () => {
      const string = '';
      const isValid = validation.validatePhone(string);
      expect(isValid).toBe(false);
    });

    test('returns false if value is less than 7', () => {
      const string = '(+44)123456';
      const isValid = validation.validatePhone(string);
      expect(isValid).toBe(false);
    });

    test('returns false if value is larger than 15', () => {
      const string = '(+44)1234567890123456';
      const isValid = validation.validatePhone(string);
      expect(isValid).toBe(false);
    });
  });
});
