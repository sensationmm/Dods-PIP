import * as string from './string';

describe('string utils', () => {
  describe('ucFirst()', () => {
    it('capitalizes first letter', () => {
      const result = string.ucFirst('example');
      expect(result).toBe('Example');
    });

    it('capitalizes first letter only', () => {
      const result = string.ucFirst('example example');
      expect(result).toBe('Example example');
    });

    it('capitalization unneccesary', () => {
      const result = string.ucFirst('Example example');
      expect(result).toBe('Example example');
    });
  });
});
