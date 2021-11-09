import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';

interface UsersProps extends LoadingHOCProps {}

export const Users: React.FC<UsersProps> = () => {
  return <div>Hello from Users page</div>;
};

export default LoadingHOC(Users);
