export const BASE_URI = '/api';

export enum Api {
  CheckAccountName = '/checkaccountname',
  ClientAccount = '/clientaccount',
  EnableUser = '/enableUser',
  ForgotPassword = '/forgotPassword',
  Login = '/login',
  Logout = '/logout',
  ResetPassword = '/resetPassword',
  SubscriptionTypes = '/subscription-types',
  TeamMember = '/teammember',
  TeamMemberCreate = '/teammember/new',
  User = '/user',
  Users = '/users',
}

export const toQueryString = (params: Record<string, any> = {}): string => {
  const keys = Object.keys(params);
  let queryString = '';

  if (Array.isArray(keys) && keys.length > 0) {
    queryString = '?' + keys.map((key: string) => `${key}=${params[key]}`).join('&');
  }

  return queryString;
};
