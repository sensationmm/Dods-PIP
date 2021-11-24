import Head from 'next/head';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Text from '../../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';

interface MyProfileProps extends LoadingHOCProps {}

export const MyProfile: React.FC<MyProfileProps> = () => {
  return (
    <div data-test="page-my-profile">
      <Head>
        <title>Dods PIP | Library</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            My Profile
          </Text>
          <Spacer size={12} />
          <Text>Coming Soon</Text>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(MyProfile);
