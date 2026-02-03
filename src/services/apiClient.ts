interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ApiError extends Error {
  shouldRetry: boolean;

  constructor(message: string, shouldRetry: boolean) {
    super(message);
    this.shouldRetry = shouldRetry;
    this.name = "ApiError";
  }
}

/**
 * A wrapper around the native fetch API with automatic retry logic.
 */
export const fetchClient = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  let attempt = 0;

  while (attempt <= retries) {
    try {
      const url = endpoint.startsWith("http")
        ? endpoint
        : `${BASE_URL}${endpoint}`;
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          throw new ApiError(
            `API Error: ${response.status} ${response.statusText}`,
            false,
          );
        }
        throw new ApiError(
          `Server Error: ${response.status} ${response.statusText}`,
          true,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError && !error.shouldRetry) {
        throw error;
      }

      attempt++;
      if (attempt > retries) {
        throw error;
      }
      console.warn(
        `[fetchClient] Request failed, retrying (${attempt}/${retries})...`,
        error,
      );
      // Exponential backoff
      await wait(retryDelay * Math.pow(2, attempt - 1));
    }
  }

  throw new Error("Max retries exceeded");
};
