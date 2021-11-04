import { mount } from 'enzyme';
import DataCount from './index';

const SELECTOR_COMPONENT = '[data-test="data-count-component"]';

const getWrapper = (total: number) => mount(<DataCount {...{ total }} />);

describe('DataCount', () => {
  it.each([
    ['zero item counts', 0, 'Total 0 items'],
    ['single item counts', 1, 'Total 1 item'],
    ['multiple item counts', 345, 'Total 345 items'],
    ['thousands', 13234, 'Total 13,234 items'],
  ])('should render %s with correct format', (name, total, expected) => {
    const wrapper = getWrapper(total);
    expect(wrapper.find(SELECTOR_COMPONENT).text()).toBe(expected);
  });
});
