import { NextIronRequest } from './session';

export type UserResponse = {
  id?: string;
  userId?: string;
  accessToken?: string;
  isDodsUser?: boolean;
  clientAccountId?: string;
  clientAccountName?: string;
  displayName?: string;
};

// @deprecated - You need to define the type you are fetching with fetchJson<ResponseType>
export interface CustomResponse extends Response, UserResponse {
  data?: Record<string, unknown>;
  alerts?: Record<string, unknown>;
  queries?: Array<Record<string, unknown>>;
  alert?: Record<string, unknown>;
  totalRecords?: number;
  filteredRecords?: number;
  message?: string;
  success?: boolean;
  people: Record<string, unknown>;
  organisations: Record<string, unknown>;
  topics: Record<string, unknown>;
  geography: Record<string, unknown>;
  isActive?: boolean;
  isLoggedIn?: boolean;
  query?: Record<string, unknown>;
}

export interface CustomError extends CustomResponse {
  ok: boolean;
  code: number;
  statusText: string;
  error: Error;
}

type AuthHeader = {
  Authorization?: string;
};

const requestDefaults = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  },
};

export default async function fetchJson<T>(
  url: string,
  args?: RequestInit,
  req?: NextIronRequest,
): Promise<T | CustomError> {
  const isExemptRoute = /signin|signout$/i.test(url);
  const accessToken = req?.session?.get('user')?.accessToken;
  const authHeader: AuthHeader =
    !isExemptRoute && accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  let response, data;
  try {
    response = await fetch(url, {
      ...requestDefaults,
      ...args,
      headers: { ...requestDefaults.headers, ...authHeader, ...args?.headers },
    });
    data = await response.json();
    return data as T;
  } catch (error) {
    return {
      ok: response?.ok as boolean,
      code: response?.status as number,
      statusText: response?.statusText as string,
      error,
      ...(data || {}),
    };
  }
}
