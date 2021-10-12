import { shallow } from 'enzyme';
import React from 'react';

import PageHeader from '.';

describe('PageHeader', () => {
  it('renders without error', () => {
    const wrapper = shallow(<PageHeader title={'Page Title'} />);
    const component = wrapper.find('[data-test="component-page-header"]');
    expect(component.length).toEqual(1);
  });

  it('renders title', () => {
    const wrapper = shallow(<PageHeader title={'Page Title'} />);
    const title = wrapper.find('[data-test="pageheader-title"]');
    expect(title.props().children).toEqual('Page Title');
  });

  it('renders optional content', () => {
    const wrapper = shallow(
      <PageHeader title={'Page Title'} content={<div data-test="pageheader-content" />} />,
    );
    const content = wrapper.find('[data-test="pageheader-content"]');
    expect(content.length).toEqual(1);
  });
});
