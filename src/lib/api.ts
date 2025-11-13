/* eslint-disable */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  //   withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt');
      // Optionally redirect to login page
      console.warn('Token expired — logging out.');
    }
    return Promise.reject(error);
  },
);

// Generic helper functions
export const get = async <T>(url: string, params?: any): Promise<T> => {
  const res = await api.get(url, { params });
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${url}`);

  return res.data;
};

export const post = async <T>(url: string, data?: any): Promise<T> => {
  const res = await api.post(url, data);
  return res.data;
};

export const put = async <T>(url: string, data?: any): Promise<T> => {
  const res = await api.put(url, data);
  return res.data;
};

export const del = async <T>(url: string): Promise<T> => {
  const res = await api.delete(url);
  return res.data;
};
