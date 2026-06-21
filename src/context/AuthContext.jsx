import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, try to restore session via refresh token
  useEffect(() => {
    const restore = async () => {
      const storedUser = localStorage.getItem('pb_user');
      const storedToken = localStorage.getItem('pb_token');
      if (storedUser && storedToken) {
        try {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: JSON.parse(storedUser), accessToken: storedToken },
          });
        } catch {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    restore();
  }, []);

  const login = (user, accessToken) => {
    localStorage.setItem('pb_user', JSON.stringify(user));
    localStorage.setItem('pb_token', accessToken);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, accessToken } });
  };

  const logout = async () => {
    try { await api.post('/api/auth/logout'); } catch {}
    localStorage.removeItem('pb_user');
    localStorage.removeItem('pb_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    localStorage.setItem('pb_user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
