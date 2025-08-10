import { hcWithType } from "server/dist/server/src/client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const baseClient = hcWithType(SERVER_URL);

// Create a wrapper that handles token refresh
const createClientWithInterceptor = () => {
  let isRefreshing = false;
  let refreshPromise: Promise<void> | null = null;

  const refreshToken = async (): Promise<void> => {
    const res = await fetch(`${SERVER_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!res.ok) {
      // Redirect to login if refresh fails
      window.location.href = '/login';
      throw new Error('Refresh failed');
    }
  };

  const interceptResponse = async (originalCall: () => Promise<Response>) => {
    const response = await originalCall();
    
    if (response.status === 401 && !isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
      
      try {
        await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;
        // Retry original request
        return originalCall();
      } catch (error) {
        isRefreshing = false;
        refreshPromise = null;
        throw error;
      }
    } else if (response.status === 401 && isRefreshing && refreshPromise) {
      // Wait for ongoing refresh and retry
      await refreshPromise;
      return originalCall();
    }
    
    return response;
  };

  return baseClient;
};

export const client = createClientWithInterceptor();
