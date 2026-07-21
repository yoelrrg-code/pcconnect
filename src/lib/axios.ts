import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.errors) {
      const message = Object.entries(error.response.data.errors)
        .map(([, v]) => `${v}`)
        .join(', ');
      return Promise.reject(new Error(message));
    } else {
      const message =
        error?.response?.data?.message || error?.message || 'Something went wrong!';
      return Promise.reject(new Error(message));
    }
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];
    const res = await axiosInstance.get<T>(url, config);
    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/user',
    signIn: '/api/jwt/login',
    reset: '/api/jwt/reset',
    update: '/api/jwt/update',
    refresh: '/api/jwt/refresh',
  },
};
