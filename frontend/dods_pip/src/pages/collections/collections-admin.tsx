import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Button from '@dods-ui/components/Button';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import Head from 'next/head';
import React from 'react';

import * as Styled from './collections.styles';
import { CollectionsScreenProps } from './index.page';

export const CollectionsUser: React.FC<CollectionsScreenProps> = ({ setShowAdd }) => {
  return (
    <div data-testid="page-account-management-users">
      <Head>
        <title>Dods PIP | Collections</title>
      </Head>

      <main>
        <Panel>
          <Styled.header>
            <Text type="h1" headingStyle="heroExtraLarge">
              Collections
            </Text>
            <Button
              data-test="btn-add-collection"
              isSmall={false}
              icon={Icons.Add}
              label="Add Collection"
              onClick={() => setShowAdd(true)}
            />
          </Styled.header>

          <Spacer size={4} />
          <Text>Admin view coming soon</Text>
        </Panel>
      </main>
    </div>
  );
};

export default CollectionsUser;
