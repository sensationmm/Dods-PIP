import { toQueryString } from './api';

describe('utils/api', () => {
  describe('toQueryString', () => {
    it('when argument is a string returns empty string', () => {
      expect(toQueryString('')).toEqual('');
    });

    it('when argument is nothing returns empty string', () => {
      expect(toQueryString()).toEqual('');
    });

    it('when argument is an object returns correct query string', () => {
      expect(toQueryString({ limit: 10, foo: 'bar', isUK: false })).toEqual('?limit=10&foo=bar&isUK=false');
    });
  });
});