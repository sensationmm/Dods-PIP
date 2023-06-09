/* eslint-disable  @typescript-eslint/no-explicit-any */
// mutateUser return type is Promise<any>

import Cookies from 'js-cookie';
import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

import { Api, BASE_URI } from '../utils/api';

export type User = {
  id?: string;
  isActive?: number;
  isDodsUser?: boolean;
  clientAccount?: {
    name: string;
    uuid: string;
  };
  clientAccountId?: string;
  clientAccountName?: string;
  displayName?: string;
  emailAddress?: string;
  title?: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  telephoneNumber1?: string;
  telephoneNumber2?: string;
  memberSince: Date;
};

export interface UserAuth extends User {
  isLoggedIn: boolean;
  accessToken: string;
}

type UseUser = {
  user: UserAuth;
  mutateUser: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>;
};

export default function useUser({ redirectTo = '', redirectIfFound = false } = {}): UseUser {
  const { data: user, mutate: mutateUser } = useSWR(`${BASE_URI}${Api.User}`);

  useEffect(() => {
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!user) {
      // Add / remove this cookie as the library page depends on it in order to determine the Jurisdiction
      Cookies.remove('account-id');
      return;
    } else {
      Cookies.set('account-id', user.clientAccountId);
    }

    // if no redirect needed, just return (example: already on /dashboard)
    if (!redirectTo) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}
