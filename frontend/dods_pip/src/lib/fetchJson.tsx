interface CustomError extends Error {
  response?: Response;
  data?: Record<string, unknown>;
}

interface customResponse extends Response {
  accessToken?: string;
}

export default async function fetchJson(url: string, args?: RequestInit): Promise<customResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      ...args,
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    const error = new Error(response.statusText) as CustomError;
    error.response = response;
    error.data = data;
    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { message: `!!${error.message}` };
    }
    throw error;
  }
}
