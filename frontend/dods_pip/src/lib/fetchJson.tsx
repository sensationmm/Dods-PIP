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
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
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

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    return response;
  } catch (error) {
    if (!error.data) {
      error.data = { message: `!!${error.message}` };
    }
    throw error;
  }
}
