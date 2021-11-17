import React from 'react';

import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import ContentTagger, { ContentTaggerProps } from '../components/ContentTagger';
import Text from '../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import MockTagging from '../mocks/data/tagging.json';

interface TaggerProps extends LoadingHOCProps {}

export const Tagger: React.FC<TaggerProps> = () => {
  const [tags, setTags] = React.useState<ContentTaggerProps['tags']>(MockTagging.activeTags);
  return (
    <Panel isNarrow>
      <Columns>
        <ul>
          {tags.map((tag) => (
            <li key={`li-${tag.id}`}>
              <Text>{tag.termName}</Text>
            </li>
          ))}
        </ul>

        <ContentTagger tags={tags} setTags={setTags} />
      </Columns>
    </Panel>
  );
};

export default LoadingHOC(Tagger);
