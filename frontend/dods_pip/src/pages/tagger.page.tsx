import React from 'react';

import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import ContentTagger, { ContentTaggerProps } from '../components/ContentTagger';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import MockTagging from '../mocks/data/tagging.json';

interface TaggerProps extends LoadingHOCProps {}

export const Tagger: React.FC<TaggerProps> = () => {
  return (
    <Panel isNarrow>
      <Columns>
        <div />
        <ContentTagger tags={MockTagging.activeTags as unknown as ContentTaggerProps['tags']} />
      </Columns>
    </Panel>
  );
};

export default LoadingHOC(Tagger);
