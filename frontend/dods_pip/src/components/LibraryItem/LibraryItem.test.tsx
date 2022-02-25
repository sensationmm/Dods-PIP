import { shallow } from 'enzyme';
import React from 'react';

import LibraryItem from '.';

describe('LibraryItem', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <LibraryItem
        parsedQuery=""
        documentTitle=""
        documentContent=""
        contentDateTime=""
        organisationName=""
        informationType=""
        taxonomyTerms={[]}
        documentId=""
        contentSource=""
      />,
    );
    const component = wrapper.find('[data-test="library-item"]');
    expect(component.length).toEqual(1);
  });
});
