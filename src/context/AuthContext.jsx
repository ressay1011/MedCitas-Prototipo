import { createContext, useContext, useReducer, useEffect } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from '../services/localStorage';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });

  // Inicializar desde localStorage
  useEffect(() => {
    const token = getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    const user = getFromStorage(STORAGE_KEYS.USER_DATA);
    
    if (token && user) {
      dispatch({ type: 'LOGIN', payload: { user, token } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = (user, token) => {
    saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
    saveToStorage(STORAGE_KEYS.USER_DATA, user);
    dispatch({ type: 'LOGIN', payload: { user, token } });
  };

  const logout = () => {
    removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER_DATA);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

