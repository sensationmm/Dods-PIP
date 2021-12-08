import { useRouter } from 'next/router';
import React from 'react';

import Loader from '../components/Loader';
import useUser from '../lib/useUser';

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  const router = useRouter();
  const { user } = useUser({ redirectTo: '/' });

  if (user && user.isDodsUser) {
    router.push('/account-management/accounts');
  } else if (user && !user.isDodsUser) {
    router.push(`/accounts/${user.clientAccountId}`);
  }

  return <Loader data-test="loader" inline />;
};

export default Dashboard;
