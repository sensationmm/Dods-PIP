import Head from 'next/head';
import React from 'react';

import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Text from '../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';

interface PrivacyPolicyProps extends LoadingHOCProps {}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  return (
    <div data-test="page-privacy-policy">
      <Head>
        <title>Dods PIP | Privacy Policy</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Privacy Policy
          </Text>
          <Spacer size={12} />
          <Spacer size={12} />
          <Text>Coming Soon</Text>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(PrivacyPolicy);
