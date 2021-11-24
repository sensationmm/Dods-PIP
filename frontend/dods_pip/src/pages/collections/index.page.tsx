import Head from 'next/head';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Text from '../../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';

interface CollectionsProps extends LoadingHOCProps {}

export const Collections: React.FC<CollectionsProps> = () => {
  return (
    <div data-test="page-collections">
      <Head>
        <title>Dods PIP | Collections</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Collections
          </Text>
          <Spacer size={12} />
          <Text>Coming Soon</Text>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Collections);
