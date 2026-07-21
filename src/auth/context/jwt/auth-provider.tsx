import type { AuthState } from '../../types';

import { useState, useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from '../../../lib/axios';

import { AuthContext } from '../auth-context';
import { ACCESS_KEY, REFRESH_KEY } from './constant';
import { setSession, isValidUser, isValidToken } from './utils';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  const resetSession = useCallback(() => {
    setState({ user: null, loading: false });
    setSession(null);
  }, []);

  const checkUserSession = useCallback(async () => {
    try {
      await Promise.resolve();
      const accessToken = sessionStorage.getItem(ACCESS_KEY);
      const refreshToken = sessionStorage.getItem(REFRESH_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken, refreshToken);

        const res = await axios.get(endpoints.auth.me);
        const { userName, firstName, lastName, isStaff, showAdmin, showLogs } = res.data;

        if (isValidUser(accessToken, res.data)) {
          setState({
            user: { userName, firstName, lastName, isStaff, showAdmin, showLogs, accessToken },
            loading: false,
          });
        } else {
          resetSession();
        }
      } else {
        resetSession();
      }
    } catch (error) {
      console.error(error);
      resetSession();
    }
  }, [resetSession]);

  useEffect(() => {
    const init = async () => {
      await checkUserSession();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ?? null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
