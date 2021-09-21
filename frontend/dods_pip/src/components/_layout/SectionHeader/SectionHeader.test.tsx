import { shallow } from 'enzyme';
import React from 'react';

import SectionHeader from '.';
import { Icons } from '../../Icon/assets';

describe('SectionHeader', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SectionHeader title="Title" subtitle="Subtitle" icon={Icons.IconTick} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-section-header"]');
    expect(component.length).toEqual(1);
  });

  it('renders title', () => {
    const title = wrapper.find('[data-test="sectionheader-title"]');
    expect(title.props().children).toEqual('Title');
  });

  it('renders subtitle', () => {
    const subtitle = wrapper.find('[data-test="sectionheader-subtitle"]');
    expect(subtitle.props().children).toEqual('Subtitle');
  });

  it('renders array of subtitles', () => {
    wrapper = shallow(
      <SectionHeader title="Title" subtitle={['Subtitle 1', 'Subtitle 2']} icon={Icons.IconTick} />,
    );
    const subtitle1 = wrapper.find('[data-test="sectionheader-subtitle-0"]');
    const subtitle2 = wrapper.find('[data-test="sectionheader-subtitle-1"]');
    expect(subtitle1.props().children).toEqual('Subtitle 1');
    expect(subtitle2.props().children).toEqual('Subtitle 2');
  });

  it('renders icon', () => {
    const icon = wrapper.find('[data-test="sectionheader-icon"]');
    expect(icon.props().src).toEqual(Icons.IconTick);
  });
});
