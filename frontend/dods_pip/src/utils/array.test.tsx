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

  describe('getIndexById()', () => {
    let searchArray;

    beforeEach(() => {
      searchArray = [
        { id: 'one', val: 'any1' },
        { id: 'two', val: 'any2' },
        { id: 'three', val: 'any3' },
      ];
    });

    it('returns key of found object', () => {
      const index = array.getIndexById(searchArray, 'id', 'two');
      expect(index).toEqual(1);
    });

    it('returns key of found object', () => {
      const index = array.getIndexById(searchArray, 'val', 'any1');
      expect(index).toEqual(0);
    });

    it('return undefined if not found', () => {
      const index = array.getIndexById(searchArray, 'val', 'any5');
      expect(index).toEqual(undefined);
    });
  });
});
