import { shallow } from 'enzyme';
import React from 'react';

import SectionAccordion from '.';
import Icon from '../Icon';
import { Icons } from '../Icon/assets';

describe('SectionAccordion', () => {
  const header = <div>Header</div>;
  const content = <div>Content</div>;
  const useStateSpy = jest.spyOn(React, 'useState');

  it('Should render the component', () => {
    const wrapper = shallow(<SectionAccordion header={header}>{content}</SectionAccordion>);
    const component = wrapper.find('[data-test="component-section-accordion"]');
    expect(component.length).toEqual(1);
  });

  it('Should show an up chevron icon in an open stage', () => {
    const wrapper = shallow(
      <SectionAccordion header={header} isOpen={true}>
        {content}
      </SectionAccordion>,
    );
    const component = wrapper.find('[data-test="icon"]');
    expect(component.find(Icon).props().src).toEqual(Icons.ChevronDown);
  });

  it('Should show a down chevron icon in a closed stage', () => {
    const wrapper = shallow(
      <SectionAccordion header={header} isOpen={false}>
        {content}
      </SectionAccordion>,
    );
    const component = wrapper.find('[data-test="icon"]');
    expect(component.find(Icon).props().src).toEqual(Icons.ChevronUp);
  });

  it('should close', () => {
    const wrapper = shallow(
      <SectionAccordion header={header} isOpen={true}>
        {content}
      </SectionAccordion>,
    );
    const trigger = wrapper.find('[data-test="header"]');
    trigger.simulate('click', { target: {} });
    expect(React.useState).toHaveBeenCalledWith(false);
  });

  it('should open', () => {
    const wrapper = shallow(<SectionAccordion header={header}>{content}</SectionAccordion>);
    const trigger = wrapper.find('[data-test="header"]');
    trigger.simulate('click', { target: {} });
    expect(React.useState).toHaveBeenCalledWith(true);
  });

  it('should fire callback if given', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <SectionAccordion header={header} callback={mockCallback}>
        {content}
      </SectionAccordion>,
    );
    const trigger = wrapper.find('[data-test="header"]');
    trigger.simulate('click', { target: {} });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
