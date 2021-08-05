import { hexAToRGBA } from './color';

describe('hexAToRGBA', () => {
  it('returns correct RGBA value for six digit hex with no opacity', () => {
    const color = '#ff0000';
    const converted = hexAToRGBA(color);
    expect(converted).toEqual('rgba(255, 0, 0, 1)');
  });

  it('returns correct RGBA value for three digit hex with no opacity', () => {
    const color = '#f00';
    const converted = hexAToRGBA(color);
    expect(converted).toEqual('rgba(255, 0, 0, 1)');
  });

  it('returns correct RGBA value for six digit hex with opacity', () => {
    const color = '#ff0000';
    const converted = hexAToRGBA(color, 0.4);
    expect(converted).toEqual('rgba(255, 0, 0, 0.4)');
  });

  it('returns correct RGBA value for three digit hex with opacity', () => {
    const color = '#f00';
    const converted = hexAToRGBA(color, 0.4);
    expect(converted).toEqual('rgba(255, 0, 0, 0.4)');
  });

  it('returns null for invalid hex', () => {
    const color = 'zzz';
    const converted = hexAToRGBA(color, 1);
    expect(converted).toEqual(null);
  });
});
