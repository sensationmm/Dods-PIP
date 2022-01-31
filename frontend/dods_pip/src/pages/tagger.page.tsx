import { useRouter } from 'next/router';
import React from 'react';

import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import ContentTagger, { ContentTaggerProps } from '../components/ContentTagger';
import Text from '../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';

interface TaggerProps extends LoadingHOCProps {}

export const Tagger: React.FC<TaggerProps> = () => {
  const router = useRouter();
  const { highlight = undefined } = router.query;
  const [tags, setTags] = React.useState<ContentTaggerProps['tags']>([
    {
      tagId: 'http://www.dods.co.uk/taxonomy/instance/Topics/ba68835e-6584-4c14-ab83-29fcae407cda',
      termLabel: 'radiation and nuclear waste',
      type: 'Topics',
      instances: 3,
      facetType: '',
      inScheme: [],
      score: 0,
    },
  ]);

  return (
    <Panel isNarrow>
      <Columns>
        <ul>
          {tags.map((tag) => (
            <li key={`li-${tag.tagId}`}>
              <Text>{tag.termLabel}</Text>{' '}
            </li>
          ))}
        </ul>

        <ContentTagger
          tags={tags}
          setTags={setTags}
          highlight={highlight as string}
          highlightWordCount={3}
        />
      </Columns>
    </Panel>
  );
};

export default LoadingHOC(Tagger);
