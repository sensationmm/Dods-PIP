import * as array from './array';

describe('Functions', () => {
  describe('inArray()', () => {
    let searchArray;

    beforeEach(() => {
      searchArray = ['search-one', 'search-two', 'search-three'];
    });

    it('returns true for if item is in array', () => {
      const search = 'search-one';
      const isInArray = array.inArray(search, searchArray);
      expect(isInArray).toBe(true);
    });

    it('returns false if item is not in array', () => {
      const search = 'search-four';
      const isInArray = array.inArray(search, searchArray);
      expect(isInArray).toBe(false);
    });
  });
});
