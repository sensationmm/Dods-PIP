import { shallow } from 'enzyme';
import React from 'react';

import color from '../../globals/color';
import Breadcrumbs from '.';
import Text from '../Text';


describe('Breadcrumbs', () => {

  it('renders without error', () => {
    const wrapper = shallow(<Breadcrumbs history={[]} />);
    const component = wrapper.find('[data-test="component-breadcrumbs"]');
    expect(component.length).toEqual(1);
  });

  it("first link should be bold and blueMid", ()=> {
    const fakeHistory= [{label: "first"},{label:"Second"}] 
    const wrapper = shallow(<Breadcrumbs history={ fakeHistory}/>)
    const firstLink = wrapper.find('[data-test="link-text-0"]')

    expect(firstLink.find(Text).props().color ).toEqual(color.theme.blueMid)
    expect(firstLink.find(Text).props().bold).toEqual(true)
  })

  it("sencond link shouldn't be bold but needs to be blueMid", ()=> {
    const fakeHistory= [{label: "first"},{label:"Second"}] 
    const wrapper = shallow(<Breadcrumbs history={fakeHistory}/>)
    const secondLink = wrapper.find('[data-test="link-text-1"]')

    expect(secondLink.find(Text).props().color).toEqual(color.theme.blueMid)
    expect(secondLink.find(Text).props().bold).toEqual(false)
  })
});


describe("Breadcrumbs with more than 4 links in the history ",  () => {
  it("should show only first link, last 2, and replace the middle ones with 3 dots", () => {

    const fakeHistory = [ {label:"First"},{label:"Second"},{label:"Third"},{label:"Forth"},{label:"Fifth"}, {label:"sixth"}, ]
    
    const wrapper = shallow(<Breadcrumbs history={fakeHistory} />)
    const secondLink = wrapper.find('[data-test="link-text-1"]')
    expect(secondLink.find(Text).props().children).toEqual('...');
    expect(secondLink.find(Text).props().bold).toEqual(true);
  })
})
