import { shallow } from 'enzyme';

import Radio, { IRadioProps } from '.';

const TEST_PROPS: IRadioProps = {
  label: 'test radio',
  name: 'Example',
  value: 'test value',
  theme: 'dark',
  onChange: jest.fn(),
};

const SELECTOR_COMPONENT = '[data-test="component-radio"]';
const SELECTOR_RADIO_INPUT = '[data-test="radio-input"]';
const SELECTOR_CUSTOM_LABEL = '[data-test="custom-label"]';
const SELECTOR_CUSTOM_RADIO = '[data-test="custom-radio"]';

const getWrapper = (props: IRadioProps = TEST_PROPS) => shallow(<Radio {...props} />);

describe('Radio', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = getWrapper();
  });

  it('renders all required elements', () => {
    const component = wrapper.find(SELECTOR_COMPONENT);
    const radioInput = component.find(SELECTOR_RADIO_INPUT);
    const customLabel = component.find(SELECTOR_CUSTOM_LABEL);
    const customRadio = component.find(SELECTOR_CUSTOM_RADIO);
    expect(component.length).toEqual(1);
    expect(radioInput.length).toEqual(1);
    expect(customLabel.length).toEqual(1);
    expect(customRadio.length).toEqual(1);
  });

  it('handles click', () => {
    wrapper.find(SELECTOR_RADIO_INPUT).props().onChange();
    expect(TEST_PROPS.onChange).toHaveBeenCalledWith(TEST_PROPS.value);
    expect(TEST_PROPS.onChange).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['truthy', true],
    ['falsey', false],
  ])('renders %s checked state', (name, isChecked) => {
    const input = getWrapper({ ...TEST_PROPS, isChecked }).find(SELECTOR_RADIO_INPUT);
    if (name === 'truthy') expect(input.props().defaultChecked).toEqual(isChecked);
    if (name === 'falsey') expect(input.props()).not.toContain('defaultChecked');
  });

  it.each([
    ['truthy', true],
    ['falsey', false],
  ])('renders $% disabled state', (name, isDisabled) => {
    const input = getWrapper({ ...TEST_PROPS, isDisabled }).find(SELECTOR_RADIO_INPUT);
    if (name === 'truthy') expect(input.props().disabled).toEqual(isDisabled);
    if (name === 'falsey') expect(input.props()).not.toContain('disabled');
  });

  // Just for test coverage satisfaction
  describe('when no value is set', () => {
    let wrapper;
    beforeEach(() => {
      const props = { ...TEST_PROPS };
      delete props.value;
      wrapper = getWrapper(props);
    });
    it('sets an empty value', () => {
      const input = wrapper.find(SELECTOR_RADIO_INPUT);
      expect(input.props().value).toBe('');
    });
  });
});
