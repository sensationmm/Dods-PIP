import Head from 'next/head';
import React from 'react';

import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Text from '../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';

interface TermsConditionsProps extends LoadingHOCProps {}

export const TermsConditions: React.FC<TermsConditionsProps> = () => {
  return (
    <div data-test="page-privacy-policy">
      <Head>
        <title>Dods PIP | Terms &amp; Conditions</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Terms &amp; Conditions
          </Text>
          <Spacer size={12} />
          <Spacer size={12} />
          <Text>Coming Soon</Text>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(TermsConditions);
