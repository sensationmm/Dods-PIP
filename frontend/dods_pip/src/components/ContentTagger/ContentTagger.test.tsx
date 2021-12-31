import React from 'react';
import { shallow } from 'enzyme';

import ContentTagger from '.';

describe('ContentTagger', () => {
  it('renders without error', () => {
    const wrapper = shallow(<ContentTagger tags={[]} setTags={jest.fn()} />);
    const component = wrapper.find('[data-test="component-content-tagger"]');
    expect(component.length).toEqual(1);
  });
});
