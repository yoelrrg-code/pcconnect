// ----------------------------------------------------------------------

export type UserType = {
  userName: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  showAdmin: boolean;
  showLogs: boolean;
  accessToken: string;
} | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
