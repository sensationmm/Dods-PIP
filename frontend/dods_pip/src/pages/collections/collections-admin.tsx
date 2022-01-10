import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Text from '@dods-ui/components/Text';
import Head from 'next/head';
import React from 'react';

import { CollectionsScreenProps } from './index.page';

export const CollectionsUser: React.FC<CollectionsScreenProps> = () => {
  return (
    <div data-testid="page-account-management-users">
      <Head>
        <title>Dods PIP | Collections</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Collections
          </Text>
          <Spacer size={4} />
          <Text>Admin view coming soon</Text>
        </Panel>
      </main>
    </div>
  );
};

export default CollectionsUser;
