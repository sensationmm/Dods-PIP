import Head from 'next/head';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Text from '../../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';

interface PeopleProps extends LoadingHOCProps {}

export const People: React.FC<PeopleProps> = () => {
  return (
    <div data-test="page-people">
      <Head>
        <title>Dods | Library</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            People
          </Text>
          <Spacer size={12} />
          <Text>People coming to new platform soon</Text>
          <Spacer size={8} />
          <Text>
            <a
              href="http://www.dodspeople.com/"
              title="Dods People Platform"
              target="_blank"
              rel="noreferrer"
            >
              Click here to go to existing People platform
            </a>
          </Text>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(People);
