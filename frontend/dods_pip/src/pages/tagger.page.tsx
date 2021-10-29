import React from 'react';

import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import ContentTagger, { ContentTaggerProps } from '../components/ContentTagger';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import MockTagging from '../mocks/data/tagging.json';

interface NotificationsProps extends LoadingHOCProps {}

export const Notifications: React.FC<NotificationsProps> = () => {
  return (
    <Panel isNarrow>
      <Columns>
        <div />
        <ContentTagger tags={MockTagging.activeTags as unknown as ContentTaggerProps['tags']} />
      </Columns>
    </Panel>
  );
};

export default LoadingHOC(Notifications);
