  import { shallow } from 'enzyme';
  import React from 'react';

  import TextArea from '.';
  import color from '../../../globals/color';
  import Text from "../../Text"

  describe('InputText', () => {
    it('renders without error', () => {
      const wrapper = shallow(
        <TextArea label="Example" value={'Example'} onChange={jest.fn} />,
      );
      const component = wrapper.find('[data-test="component-textarea"]');
      expect(component.length).toEqual(1);
    });

    it('shows a limit of characters component', () => {
      const wrapper = shallow(
        <TextArea label="Example" value={'Example'} onChange={jest.fn} characterLimit={100} />,
      );
      const component = wrapper.find('[data-test="textarea-label-character-limit"]');
      expect(component.length).toEqual(1);
    });

    it('hides a limit of characters component', () => {
      const wrapper = shallow(
        <TextArea label="Example" value={'Example'} onChange={jest.fn}  />,
      );
      const component = wrapper.find('[data-test="textarea-label-character-limit"]');
      expect(component.length).toEqual(0);
    });


    it('shows the helper component component', () => {
      const wrapper = shallow(
        <TextArea label="Example" value={'Example'} onChange={jest.fn} helperText="example" />,
      );
      const component = wrapper.find('[data-test="component-input-base-helper"]');
      expect(component.length).toEqual(1);
    });

    it('hides the helper component component', () => {
      const wrapper = shallow(
        <TextArea label="Example" value={'Example'} onChange={jest.fn}  />,
      );
      const component = wrapper.find('[data-test="component-input-base-helper"]');
      expect(component.length).toEqual(0);
    });

    it('fires onChange method', () => {
      const typeWatcher = jest.fn();
      const wrapper = shallow(
        <TextArea label="Example" value={''} onChange={typeWatcher} />,
      );
      const component = wrapper.find('[data-test="textarea-input"]');
      component.simulate('focus');
      component.simulate('change', { target: { value: 'new' } });
      expect(typeWatcher).toHaveBeenCalledTimes(1);
      expect(typeWatcher).toHaveBeenCalledWith( 'new' );
    });

    it("shouldn't allow more charcters than the limit added to the component", () => {
      const typeWatcher = jest.fn()
      const wrapper = shallow(
        <TextArea label="Example" value={''} onChange={typeWatcher} characterLimit={5} />
      )

      const component = wrapper.find('[data-test="textarea-input"]');
      component.simulate('focus');
      component.simulate('change', { target: { value: 'sam' } });
      component.simulate('change', { target: { value: 'samp' } });
      component.simulate('change', { target: { value: 'sampl' } });
      component.simulate('change', { target: { value: 'sample' } });

      expect(typeWatcher).toHaveBeenCalledTimes(4)
      expect(typeWatcher).toHaveBeenCalledWith("sampl")
    })


    it("should display an asterisk when it's a required field", () => {
      const typeWatcher = jest.fn()
      const wrapper = shallow(
        <TextArea label="Example" value={''} onChange={typeWatcher} required />
      )
      const component = wrapper.find('[data-test="textarea-label-asterisk"]');
      expect(component.find(Text).props().children).toEqual("*")
      expect(component.find(Text).props().color).toEqual(color.alert.red)
    })

    it("should show the current amount of characters next to the total allowed", () => {
      const typeWatcher = jest.fn()
      const value= "sample"
      const characterLimit= 6

      const wrapper = shallow(<TextArea onChange={typeWatcher} value={value} characterLimit={characterLimit} />)
      const component = wrapper.find('[data-test="textarea-label-character-limit"]')

      expect(component.find(Text).props().children).toEqual([value.length, "/", characterLimit])

    })

    it("should show the helper text with a gray color", ()=> {
      const typeWatcher = jest.fn()
      const wrapper = shallow(<TextArea onChange={typeWatcher} isDisabled helperText="sample" />)
      const component  = wrapper.find('[data-test="component-input-base-helper"]')
      expect(component.find(Text).props().color).toEqual(color.base.grey)
    })

    it("Should show the error/helper text in red", () => {
      const typeWatcher = jest.fn()
      const wrapper = shallow(<TextArea onChange={typeWatcher} error="sample" />)
      const errorMessageComponent = wrapper.find('[data-test="component-input-base-helper"]')       
      expect(errorMessageComponent.find(Text).props().color).toEqual(color.alert.red)
    })

  });
