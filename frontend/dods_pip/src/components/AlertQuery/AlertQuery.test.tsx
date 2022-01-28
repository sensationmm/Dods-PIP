import { shallow } from 'enzyme';
import React from 'react';

import AlertQuery from '.';

describe('AlertQuery', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <AlertQuery
        id={12345}
        onSave={jest.fn}
        onCancel={jest.fn}
        numQueries={0}
        searchTerms=""
        source={[]}
        informationType={[]}
      />,
    );
    const component = wrapper.find('[data-test="component-alert-query"]');
    expect(component.length).toEqual(1);
  });
});
