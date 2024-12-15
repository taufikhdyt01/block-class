import { NextRouter } from 'next/router';

const isClient = typeof window !== 'undefined';

export const setToken = (token: string) => {
  if (isClient) {
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  if (isClient) {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = () => {
  if (isClient) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const isAuthenticated = () => {
  return !!getToken() && !!localStorage.getItem('user');
};

export const getCurrentUser = () => {
  if (isClient) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
};

export const handleLogout = (router: NextRouter) => {
    removeToken();
    router.push('/login');
};

