"use server";

import { ApiResult } from "@/services/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, { data: any; expiry: number }>();

/**
 * Makes an API request with caching and error handling.
 *
 * @template T - The expected response data type.
 * @param {Object} params - The parameters for the API request.
 * @param {string} params.endpoint - The API endpoint to request.
 * @param {string} [params.method="GET"] - The HTTP method to use for the request.
 * @param {any} [params.body] - The request body, if any.
 * @param {number} [params.cacheDuration=0] - The duration (in milliseconds) to cache the response.
 * @param {string} [params.api_url=process.env.API_URL] - The base URL for the API.
 * @param {boolean} [params.check_success=true] - Whether to check for a success flag in the response data.
 * @returns {Promise<ApiResult<T>>} A promise that resolves to the API result.
 * @throws {Error} Throws an error if the request fails due to network issues or server errors.
 */
export async function apiRequest<T>({
  endpoint,
  method = "GET",
  body,
  cacheDuration = 0,
  api_url = process.env.API_URL,
  check_success = true,
  token = null,
  bearer = null,
  apikey = null,
}: {
  endpoint: string;
  method?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  cacheDuration?: number;
  api_url?: string;
  check_success?: boolean;
  token?: string | null;
  bearer?: string | null;
  apikey?: string | null;
}): Promise<ApiResult<T>> {
  const cacheKey = `${method}:${api_url}/${endpoint}:${JSON.stringify(body)}`;

  // Check if response exists in cache and is valid
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() < cached.expiry) {
      return {
        success: true,
        data: cached.data as T,
      };
    } else {
      cache.delete(cacheKey);
    }
  }

  const url = `${api_url}/${endpoint}`;

  const headers: HeadersInit = {};

  if (process.env.API_KEY && api_url === process.env.API_URL) {
    headers["X-Api-Key"] = process.env.API_KEY as string;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (apikey) {
    headers["x-api-key"] = apikey;
  }

  try {
    let bodyContent = undefined;

    if (body) {
      bodyContent = body instanceof FormData ? body : JSON.stringify(body);
    }

    if (!(body instanceof FormData) && body) {
      headers["Content-Type"] = "application/json";
    }

    if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }

    const response = await fetch(url, {
      method,
      headers: headers,
      body: bodyContent,
    });

    // Handle the case of 204 No Content
    if (response.status === 204) {
      return {
        success: true,
        data: undefined as unknown as T, // No data returned, but marked as successful
      };
    }

    // If the response is OK, return the data
    if (response.ok) {
      const data = await response.json();

      if (check_success && !data.success) {
        return {
          success: false,
          error: data.message,
          status: response.status,
        };
      }

      // Cache the response if caching is enabled
      if (cacheDuration > 0) {
        if (check_success) {
          cache.set(cacheKey, {
            data: data.data,
            expiry: Date.now() + cacheDuration,
          });
        } else {
          cache.set(cacheKey, {
            data: data,
            expiry: Date.now() + cacheDuration,
          });
        }
      }

      if (check_success) {
        return {
          success: true,
          data: data.data as T,
        };
      } else {
        return {
          success: true,
          data: data as T,
        };
      }
    }

    // If the response is not OK, return an error
    return {
      success: false,
      error: `Error ${method} ${endpoint}: ${response.statusText}`,
      status: response.status,
    };
  } catch (err) {
    console.error("Failed to %s %s:", method, endpoint, err);

    // Handle network errors or unexpected issues
    return {
      success: false,
      error: `Network or server error: ${
        err instanceof Error ? err.message : String(err)
      }`,
      status: 500, // Generic status for network failures
    };
  }
}
