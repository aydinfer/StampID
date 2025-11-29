/**
 * Simple API client for making HTTP requests
 * Use this for external APIs (not Supabase)
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export const api = {
  /**
   * GET request
   */
  get: async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const { params, ...fetchOptions } = options;
    const url = buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...fetchOptions,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  post: async <T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> => {
    const response = await fetch(buildUrl(endpoint), {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  put: async <T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> => {
    const response = await fetch(buildUrl(endpoint), {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * PATCH request
   */
  patch: async <T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> => {
    const response = await fetch(buildUrl(endpoint), {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  delete: async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const response = await fetch(buildUrl(endpoint), {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return handleResponse<T>(response);
  },
};

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const baseUrl = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  if (!params) return baseUrl;

  const searchParams = new URLSearchParams(params);
  return `${baseUrl}?${searchParams.toString()}`;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    throw new ApiError(
      errorData?.message || response.statusText || 'Request failed',
      response.status,
      errorData
    );
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

/**
 * Add authorization token to requests
 */
export function withAuth(token: string): RequestOptions {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

/**
 * Example usage:
 *
 * // Simple GET
 * const data = await api.get('/users');
 *
 * // GET with params
 * const data = await api.get('/users', { params: { page: '1', limit: '10' } });
 *
 * // POST with body
 * const user = await api.post('/users', { name: 'John', email: 'john@example.com' });
 *
 * // With authentication
 * const data = await api.get('/protected', withAuth(token));
 *
 * // Error handling
 * try {
 *   const data = await api.get('/users');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('API Error:', error.status, error.message);
 *   }
 * }
 */
