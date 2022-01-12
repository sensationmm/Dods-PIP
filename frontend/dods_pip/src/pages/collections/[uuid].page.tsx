import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Text from '../../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';

interface PeopleProps extends LoadingHOCProps {}

export const People: React.FC<PeopleProps> = () => {
  const router = useRouter();
  const { uuid: collectionId = '' } = router.query;

  return (
    <div data-test="page-people">
      <Head>
        <title>Dods PIP | Collection Details</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Collection Details
          </Text>
          <Spacer size={12} />
          <Text>ID: {collectionId}</Text>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(People);
