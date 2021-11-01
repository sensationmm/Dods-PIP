interface CustomError extends Error {
  response?: Response;
  data?: Record<string, unknown>;
}

interface customResponse extends Response {
  accessToken?: string;
  data?: Record<string, unknown>;
  totalRecords?: number;
  message?: string;
  success?: boolean;
}

export default async function fetchJson(url: string, args?: RequestInit): Promise<customResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      message: 'An error happened. Please try again.',
    };

    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { message: `!!${error.message}` };
    }
    throw error;
  }
}
