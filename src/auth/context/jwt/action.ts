import axios, { endpoints } from '../../../lib/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };
    const res = await axios.post(endpoints.auth.signIn, params);
    const { accessToken, refreshToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken, refreshToken);
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      throw new Error('The user name or password provided is incorrect.', { cause: error });
    }
    console.error('Error during sign in:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export type ResetPasswordParams = {
  email: string;
  token: string;
};

export const resetPassword = async ({ email, token }: ResetPasswordParams): Promise<boolean> => {
  try {
    const params = { email, token };
    await axios.post(endpoints.auth.reset, params);
    return true;
  } catch (error: unknown) {
    console.error('Error during reset password:', error);
    return false;
  }
};

// ----------------------------------------------------------------------

export type UpdatePasswordParams = {
  email: string;
  password: string;
  code: string;
  token: string;
};

export const updatePassword = async ({
  email,
  password,
  code,
  token,
}: UpdatePasswordParams): Promise<boolean> => {
  try {
    const params = { email, password, code, token };
    await axios.post(endpoints.auth.update, params);
    return true;
  } catch (error: unknown) {
    console.error('Error during update password:', error);
    return false;
  }
};

// ----------------------------------------------------------------------

export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
