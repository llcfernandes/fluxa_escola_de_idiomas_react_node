import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AuthState, LoginCredentials, RegisterData, User } from '@/types';
import { authService } from '@/services/api.service';

// ─── CONSTANTS ────────────────────────────────────────────────────
const ACCESS_TOKEN_KEY  = 'fluxa_access_token';
const REFRESH_TOKEN_KEY = 'fluxa_refresh_token';

// ─── STATE ────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  isAuthenticated: false,
  isLoading: true,
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return { ...initialState, accessToken: null, refreshToken: null, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// ─── CONTEXT ──────────────────────────────────────────────────────
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── PROVIDER ─────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Verifica token salvo ao carregar
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const { data } = await authService.me();
        if (!data.data?.user) { dispatch({ type: 'LOGOUT' }); return; }
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.data.user,
            accessToken: token,
            refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || '',
          },
        });
      } catch {
        dispatch({ type: 'LOGOUT' });
      }
    };
    verify();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { data } = await authService.login(credentials);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });
  }, []);

  const register = useCallback(async (registerData: RegisterData) => {
    const { data } = await authService.register(registerData);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── HOOK ─────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
