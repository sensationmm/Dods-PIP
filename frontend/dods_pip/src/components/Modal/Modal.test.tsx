import { shallow } from 'enzyme';
import Modal, { ModalProps } from './index';
import { ButtonType } from '../Button';

const SELECTOR_VEIL = '[data-test="modal-veil"]';
const SELECTOR_MODAL = '[data-test="modal"]';
const SELECTOR_CLOSE = '[data-test="modal-close"]';
const SELECTOR_FOOTER = '[data-test="modal-footer"]';

const getWrapper = (props: ModalProps) => shallow(<Modal {...props} />);

const root = global.document.createElement('div');
root.setAttribute('id', '__next');
const body = global.document.querySelector('body');
body.appendChild(root);

describe('Modal', () => {
  let MOCK_CLOSE_FN;
  let DEFAULT_PROPS: ModalProps;

  afterEach(jest.clearAllMocks);

  beforeEach(() => {
    MOCK_CLOSE_FN = jest.fn();
    DEFAULT_PROPS = {
      onClose: MOCK_CLOSE_FN,
      portalContainerId: '__next',
    };
  });

  it('should render default composition', () => {
    const wrapper = getWrapper(DEFAULT_PROPS);
    expect(wrapper.find(SELECTOR_VEIL)).toHaveLength(1);
    expect(wrapper.find(SELECTOR_MODAL)).toHaveLength(1);
    expect(wrapper.find(SELECTOR_CLOSE)).toHaveLength(1);
    expect(wrapper.find(SELECTOR_FOOTER)).toHaveLength(1);
    expect(wrapper.find(SELECTOR_FOOTER).children()).toHaveLength(0);
  });

  describe('when isDismissible is true', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, isDismissible: true });
    });

    describe('and escape key is pressed', () => {
      beforeEach(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      it('should close modal', () => {
        expect(MOCK_CLOSE_FN).toHaveBeenCalledTimes(1);
      });
    });

    describe('and close button is clicked', () => {
      beforeEach(() => {
        wrapper.find(SELECTOR_CLOSE).simulate('click');
      });

      it('should close modal', () => {
        expect(MOCK_CLOSE_FN).toHaveBeenCalledTimes(1);
      });
    });

    describe('and veil is clicked', () => {
      beforeEach(() => {
        // very poor test case... will migrate to react testing library soon
        wrapper.find(SELECTOR_VEIL).simulate('click', { target: { classList: ['veil'] } });
      });

      it('should close modal', () => {
        expect(MOCK_CLOSE_FN).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when isDismissible is false', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, isDismissible: false });
    });

    it('should not display a close button', () => {
      expect(wrapper.find(SELECTOR_CLOSE)).toHaveLength(0);
    });

    describe('and veil is clicked', () => {
      beforeEach(() => {
        wrapper.find(SELECTOR_VEIL).simulate('click');
      });

      it('should close modal', () => {
        expect(MOCK_CLOSE_FN).not.toHaveBeenCalled();
      });
    });

    describe('and escape key is pressed', () => {
      beforeEach(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      it('should close modal', () => {
        expect(MOCK_CLOSE_FN).not.toHaveBeenCalled();
      });
    });
  });

  describe('when there are button configurations', () => {
    let wrapper;
    const buttons = [1, 2, 3].map((item) => ({
      label: `test ${item}`,
      type: 'primary' as ButtonType,
    }));
    beforeEach(() => (wrapper = getWrapper({ ...DEFAULT_PROPS, buttons })));

    it('should render footer buttons', () => {
      const footer = wrapper.find(SELECTOR_FOOTER);
      expect(footer.find('Button')).toHaveLength(buttons.length);
    });
  });
});
