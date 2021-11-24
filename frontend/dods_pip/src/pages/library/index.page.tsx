import Head from 'next/head';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Text from '../../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';

interface LibraryProps extends LoadingHOCProps {}

export const Library: React.FC<LibraryProps> = () => {
  return (
    <div data-test="page-library">
      <Head>
        <title>Dods PIP | Library</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Library
          </Text>
          <Spacer size={12} />
          <Text>Coming Soon</Text>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Library);
