import { shallow } from 'enzyme';
import React from 'react';

import SectionAccordion from '.';
import Icon from '../Icon';
import { Icons } from '../Icon/assets';

describe('SectionAccordion', () => {
  it("Should render the component", () => {
    const wrapper = shallow(<SectionAccordion avatarType="client" />)
    const component = wrapper.find('[data-test="component-serction-accordion"]')
    expect(component.length).toEqual(1)
  })

  it("Should show an up chevron icon in an open stage", () => {
    const wrapper = shallow(<SectionAccordion avatarType="client" open={true} />)
    const component = wrapper.find('[data-test="icon"]')
    expect(component.find(Icon).props().src).toEqual(Icons.IconChevronDown)
  })

  it("Shouldn't show a layer over the component", () => {
    const wrapper = shallow(<SectionAccordion avatarType="client" open={true} />)
    const component = wrapper.find('[data-test="layer"]')
    expect(component.length).toEqual(0)
  })

  it("Should show a down chevron icon in a closed stage", () => {
    const wrapper = shallow(<SectionAccordion avatarType="client" open={false} />)
    const component = wrapper.find('[data-test="icon"]')
    expect(component.find(Icon).props().src).toEqual(Icons.IconChevronUp)
  })

  it("Should show a layer over the component", () => {
    const wrapper = shallow(<SectionAccordion avatarType="client" open={false} />)
    const component = wrapper.find('[data-test="layer"]')
    expect(component.length).toEqual(1)
  })
});
