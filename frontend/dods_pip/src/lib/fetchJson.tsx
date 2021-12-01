import { NextIronRequest } from './session';

interface CustomError extends Error {
  response?: Response;
  data?: Record<string, unknown>;
}

export type UserResponse = {
  accessToken?: string;
  isDodsUser?: boolean;
  clientAccountId?: string;
  clientAccountName?: string;
  displayName?: string;
};

interface CustomResponse extends Response, UserResponse {
  data?: Record<string, unknown>;
  totalRecords?: number;
  message?: string;
  success?: boolean;
}

export default async function fetchJson(
  url: string,
  args?: RequestInit,
  req?: NextIronRequest,
): Promise<CustomResponse> {
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    const isAuthPath = /signin|signout$/i.test(url);

    if (!isAuthPath && req?.session) {
      const { accessToken = undefined } = req.session.get('user');

      headers = {
        ...headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { ...args?.headers, ...headers },
      ...args,
    });

    const data = await response
      .clone()
      .json()
      .catch(() => response.text());

    if (response.ok) {
      return data;
    }

    const error = new Error(response.statusText) as CustomError;
    error.response = response;
    error.data = {
      name: data?.name || 'UnknownException',
      code: response.status,
      message: data?.message || 'An error happened. Please try again.',
    };

    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { message: `!!${error.message}` };
    }
    throw error;
  }
}
