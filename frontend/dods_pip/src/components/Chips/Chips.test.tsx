import { shallow, mount } from 'enzyme';
import React from 'react';

import Text from '../Text'; 
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Avatar from '../Avatar';

import Chips from '.';
import color from '../../globals/color';

describe('Core/Chips - tests', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Chips label="Label" />);
    const component = wrapper.find('[data-test="component-chip"]');
    expect(component.length).toEqual(1);
  });

  it('Label should be the word "Label"', () => {
    const wrapper = shallow(<Chips label="Label" />);
    const label = wrapper.find('[data-test="chips-label"]');
    expect(label.find(Text).props().children ).toEqual("Label");
  });

  it('Text component should be the body type when the chips are medium size', () => {
    const wrapper = shallow(<Chips label="Label" chipsSize="medium" />);
    const label = wrapper.find('[data-test="chips-label"]');
    expect(label.find(Text).props().type).toEqual("body");
  });
  it('shouls show Avatar and hide icon ', () => {
    const wrapper = shallow(<Chips label="Label" avatarType="client" />);
    const avatar = wrapper.find('[data-test="avatar-component"]');
    expect(avatar.length).toEqual(1);
    const leftIcon = wrapper.find('[data-test="left-icon-wrapper"]');
    expect(leftIcon.length).toEqual(0);
  });  
  
  it('shouls show Icon and hide Avatar ', () => {
    const wrapper = shallow(<Chips label="Label" icon={Icons.IconCross}/>);
    const avatar = wrapper.find('[data-test="avatar-component"]');
    expect(avatar.length).toEqual(0);
    const leftIcon = wrapper.find('[data-test="left-icon-wrapper"]');
    expect(leftIcon.length).toEqual(1);
  });

  it('shouls show Avatar in small version ', () => {
    const wrapper = shallow(<Chips label="Label" avatarType="client" chipsSize="dense" />);
    const avatar = wrapper.find('[data-test="avatar-component"]');
    expect(avatar.find(Avatar).props().size).toEqual("small");
  });

  it('shouls show Avatar in medium version', () => {
    const wrapper = shallow(<Chips label="Label" avatarType="client" chipsSize="medium" />);
    const avatar = wrapper.find('[data-test="avatar-component"]');
    expect(avatar.find(Avatar).props().size).toEqual("medium");
  });
  
  it("should show icon in small version", ()=> {
    const wrapper = shallow(<Chips label="Label" chipsSize="dense"  icon={Icons.IconCross}/>)
    const icon = wrapper.find('[data-test="left-icon"]')
    expect(icon.find(Icon).props().size).toEqual(IconSize.small)
  })
  
  it("should show icon in medium version", ()=> {
    const wrapper = shallow(<Chips label="Label" chipsSize="medium"  icon={Icons.IconCross}/>)
    const icon = wrapper.find('[data-test="left-icon"]')
    expect(icon.find(Icon).props().size).toEqual(IconSize.large)
  })

  it("should show icon in disabled version", ()=> {
    const wrapper = shallow(<Chips label="Label" chipsSize="medium" disabled icon={Icons.IconCross}/>)
    const icon = wrapper.find('[data-test="left-icon"]')
    expect(icon.find(Icon).props().color).toEqual(color.base.grey)
  })

  it("should show icon in enabled version", ()=> {
    const wrapper = shallow(<Chips label="Label" chipsSize="medium" disabled={false} icon={Icons.IconCross}/>)
    const icon = wrapper.find('[data-test="left-icon"]')
    expect(icon.find(Icon).props().color).toEqual(color.theme.blue)
  })

});

describe("Core/Chips - Hover tests ", () => {
  let setState, useStateSpy, count = 0;
  const states = [
    {hovering: false},
    {hovering: false},
    {hovering: true},
    {hovering: true},
    {hovering: false},
    {hovering: false, chipsSize:"medium" },
    {hovering: false, chipsSize:"dense" },
  ]

  beforeEach( () =>{
    setState = jest.fn()
    useStateSpy = jest.spyOn(React, 'useState')

    useStateSpy.mockImplementationOnce( () => [states[count].hovering, setState])
  } )

  it('sets hover on mouseenter', () => {
    const wrapper = shallow(<Chips label="Label" />)
    const filter = wrapper.find('[data-test="component-chip"]');
    filter.simulate('mouseenter');
    expect(setState).toHaveBeenCalledWith(true);
  });

  it('clears hover on mouseleave', () => {
    const wrapper = shallow(<Chips label="Label" />)
    const filter = wrapper.find('[data-test="component-chip"]');
    filter.simulate('mouseleave');
    expect(setState).toHaveBeenCalledWith(false);
  });

  it("Close button icon renders", () => {
    const wrapper = shallow(<Chips label="Label" />)
    const buttonIcon = wrapper.find('[data-test="closeButtonIcon"]')
    expect(buttonIcon.length).toEqual(1)
  })

  it("Close button icon has white color", () => {
    const wrapper = shallow(<Chips label="Label" />)
    const buttonIcon = wrapper.find('[data-test="closeButtonIcon"]')
    expect(buttonIcon.find(Icon).props().color).toEqual(color.base.white)
  })
  
  it("Close button icon should not render", () => {
    const wrapper = shallow(<Chips label="Label" />)
    const buttonIcon = wrapper.find('[data-test="closeButtonIcon"]')
    expect(buttonIcon.length).toEqual(0)
  })

  
  it('Text component should be the body type when the chips are medium size', () => {
    const wrapper = shallow(<Chips label="Label" chipsSize="medium" />);
    const label = wrapper.find('[data-test="chips-label"]');
    expect(label.find(Text).props().type).toEqual("body");
  });

  it('Text component should be the bodySmall type when the chips are dense size', () => {
    const wrapper = shallow(<Chips label="Label" chipsSize="dense" />);
    const label = wrapper.find('[data-test="chips-label"]');
    expect(label.find(Text).props().type).toEqual("bodySmall");
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
})
