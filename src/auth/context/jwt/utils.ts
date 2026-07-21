import axios, { endpoints } from '../../../lib/axios';

import { ACCESS_KEY, REFRESH_KEY, TIMEOUT, MESSAGE } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const jsonString = new TextDecoder('utf-8').decode(bytes);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
  if (!accessToken) return false;

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

function compareInsensitiveString(str1: string, str2: string) {
  if (str1 === null && str2 === null) return true;
  if (str1 && str2 === null) return false;
  if (str1 === null && str2) return false;
  return str1.toLowerCase() === str2.toLowerCase();
}

export interface UserInfo {
  userName: string;
  firstName: string;
  lastName: string;
  isStaff: boolean | string | number;
}

export function isValidUser(accessToken: string, userInfo: UserInfo) {
  if (!accessToken) return false;

  try {
    const decoded = jwtDecode(accessToken);
    if (!decoded) return false;

    if (!('username' in decoded) || !compareInsensitiveString(decoded.username, userInfo.userName))
      return false;
    if (!('firstname' in decoded) || !compareInsensitiveString(decoded.firstname, userInfo.firstName))
      return false;
    if (!('lastname' in decoded) || !compareInsensitiveString(decoded.lastname, userInfo.lastName))
      return false;
    if (!('isstaff' in decoded) || decoded.isstaff !== userInfo.isStaff.toString()) return false;

    return true;
  } catch (error) {
    console.error('Error during user validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  const previousTimeout = sessionStorage.getItem(TIMEOUT);
  if (previousTimeout) clearTimeout(Number(previousTimeout));

  const timeout = setTimeout(() => {
    try {
      sessionStorage.setItem(MESSAGE, 'Token Expired!');
      sessionStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
      window.location.href = '/';
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);

  sessionStorage.setItem(TIMEOUT, timeout.toString());
}

// ----------------------------------------------------------------------

export function tokenRefresh(refreshToken: string) {
  const decodedToken = jwtDecode(refreshToken);

  if (decodedToken && 'exp' in decodedToken && 'refreshtoken' in decodedToken) {
    const currentTime = Date.now();
    const timeLeft = decodedToken.exp * 1000 - currentTime;
    const token = decodedToken.refreshtoken;

    const previousTimeout = sessionStorage.getItem(TIMEOUT);
    if (previousTimeout) clearTimeout(Number(previousTimeout));

    const timeout = setTimeout(async () => {
      await renewToken(token);
    }, timeLeft);

    sessionStorage.setItem(TIMEOUT, timeout.toString());
  }
}

export async function renewToken(token: string): Promise<void> {
  try {
    const params = { refreshToken: token };
    const res = await axios.post(endpoints.auth.refresh, params);
    const { accessToken, refreshToken } = res.data;

    if (accessToken) setSession(accessToken, refreshToken);
    else setSession(sessionStorage.getItem(ACCESS_KEY));
  } catch (error) {
    console.error('Error during token refresh:', error);
    setSession(sessionStorage.getItem(ACCESS_KEY));
  }
}

// ----------------------------------------------------------------------

export async function setSession(accessToken: string | null, refreshToken?: string | null) {
  try {
    if (accessToken) {
      sessionStorage.setItem(ACCESS_KEY, accessToken);
      if (refreshToken) sessionStorage.setItem(REFRESH_KEY, refreshToken);
      else sessionStorage.removeItem(REFRESH_KEY);

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const decodedToken = jwtDecode(accessToken);

      if (decodedToken && 'exp' in decodedToken) {
        if (refreshToken) tokenRefresh(refreshToken);
        else tokenExpired(decodedToken.exp);
      } else {
        throw new Error('Invalid access token!');
      }
    } else {
      const previousTimeout = sessionStorage.getItem(TIMEOUT);
      if (previousTimeout) clearTimeout(Number(previousTimeout));
      sessionStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}
