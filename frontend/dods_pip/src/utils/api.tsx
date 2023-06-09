export const BASE_URI = '/api';

export enum Api {
  Alerts = '/alerts',
  AlertResultsQuery = '/search/create-query',
  CheckAccountName = '/checkaccountname',
  ChangePassword = '/changePassword',
  ClientAccount = '/clientaccount',
  ClientAccounts = '/client-accounts',
  Collections = '/collections',
  CollectionDetails = '/collections/details',
  Queries = '/queries',
  Recipients = '/recipients',
  EnableUser = '/enableUser',
  ForgotPassword = '/forgotPassword',
  GetUser = '/get-user',
  Login = '/login',
  Logout = '/logout',
  ResetPassword = '/resetPassword',
  SubscriptionTypes = '/subscription-types',
  TeamMember = '/teammember',
  TeamMemberCreate = '/teammember/new',
  User = '/user',
  Users = '/users',
  EditorialContentSources = '/content-sources',
  EditorialInfoTypes = '/information-types',
  EditorialStatus = '/editorial-record-status',
  EditorialRecords = '/editorial-record',
  Seats = '/seats',
  Taxonomies = '/taxonomies',
  TaxonomySearch = '/taxonomy',
  TaxonomyTree = '/taxonomy/tree',
  Content = '/search/contents',
  ContentSearch = '/search/contents/query',
  ContentSearchApp = '/library',
}

export const toQueryString = (params: Record<string, any> = {}): string => {
  const keys = Object.keys(params);
  let queryString = '';

  if (Array.isArray(keys) && keys.length > 0) {
    queryString = '?' + keys.map((key: string) => `${key}=${params[key]}`).join('&');
  }

  return queryString;
};
