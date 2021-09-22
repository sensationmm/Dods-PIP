import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import Box from '../components/_layout/Box';
import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Text from '../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import fetchJson from '../lib/fetchJson';
import useUser from '../lib/useUser';

interface DashboardProps extends LoadingHOCProps {}

export const Dashboard: React.FC<DashboardProps> = ({ setLoading }) => {
  const router = useRouter();
  const { user, mutateUser } = useUser({ redirectTo: '/' });

  if (!user?.isLoggedIn) return <Loader data-test="loader" inline />;

  return (
    <div data-test="page-dashboard">
      <Head>
        <title>Dods PIP | Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel isWelcome>
          <Columns>
            <div>
              <Text type={'h1'} headingStyle="heroExtraLarge">
                Political Intelligence Platform
              </Text>
              <Spacer size={12} />
              <Text bold>Better decisions. For a better tomorrow.</Text>
              <Spacer size={4} />
              <Text>
                We harness insights from over two centuries of experience, through the specialised
                knowledge of our Consultants, and our innovative technologies.
              </Text>
              <Spacer size={4} />
              <Text>
                Dods PIP is the market leading, Global political intelligence service, facilitating
                comprehensive monitoring of people, political and policy developments.
              </Text>
              <Spacer size={12} />
              <Button type={'secondary'} inline label={'Find out more'} />
            </div>

            <div>
              <Box data-test="reset-request">
                <Text type={'h4'}>Logged In</Text>

                <Spacer size={6} />

                {user?.isLoggedIn && <Text type="bodySmall">ACCESS TOKEN: {user.accessToken}</Text>}

                <Spacer size={4} />

                <Button
                  data-test={'logout-button'}
                  label={'Logout'}
                  onClick={async () => {
                    setLoading(true);
                    mutateUser(await fetchJson('/api/logout'), false);
                    router.push('/');
                  }}
                />
              </Box>
            </div>
          </Columns>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Dashboard);
