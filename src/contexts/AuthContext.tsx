import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

// Я НЕНАВИЖУ КОНТЕКСТ В РЕАКТЕ, НО БЕЗ НЕГО ЭТО БЫЛО БЫ ЕЩЕ ХУЖЕ

interface User {
 id: string;
 name: string;
 phone: string;
 email: string | null;
 dob: string | null;
}

interface AuthContextValue {
 user: User | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
 login: (credentials: { phone: string; password: string }) => Promise<boolean>;
 register: (userData: { phone: string; password: string; name: string; email?: string | null; dob?: string | null }) => Promise<boolean>;
 logout: () => Promise<boolean>;
 clearError: () => void;
}

const AuthContext = createContext<AuthContextValue>({
 user: null,
 isAuthenticated: false,
 isLoading: true,
 error: null,
 login: async () => false,
 register: async () => false,
 logout: async () => false,
 clearError: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 const [user, setUser] = useState<User | null>(null);
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const clearError = useCallback(() => {
  setError(null);
 }, []);

 useEffect(() => {
  const checkAuthStatus = async () => {
   try {
    setIsLoading(true);
    const response = await fetch('/api/auth/status.php');
    if (!response.ok) {
     throw new Error(`HTTP status error: ${response.status}`);
    }
    const data = await response.json();
    if (data.authenticated) {
     setUser(data.user);
     setIsAuthenticated(true);
    } else {
     setUser(null);
     setIsAuthenticated(false);
    }
   } catch (err) {
    console.error('Error checking auth status:', err);
    setUser(null);
    setIsAuthenticated(false);
   } finally {
    setIsLoading(false);
   }
  };
  checkAuthStatus();
 }, []);

 const login = useCallback(
  async (credentials: { phone: string; password: string }): Promise<boolean> => {
   setError(null);
   try {
    const response = await fetch('/api/auth/login.php', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(credentials),
    });
    const data = await response.json();

    if (response.ok && data.success) {
     setUser(data.user);
     setIsAuthenticated(true);
     setError(null);
     return true;
    } else {
     const errorMessage = data.error || 'Login failed. Please check your credentials.';
     setError(errorMessage);
     setUser(null);
     setIsAuthenticated(false);
     return false;
    }
   } catch (err) {
    console.error('Error during login request:', err);
    setError('An error occurred during login.');
    setUser(null);
    setIsAuthenticated(false);
    return false;
   }
  },
  []
 );

 const register = useCallback(async (userData: { phone: string; password: string; name: string; email?: string | null; dob?: string | null }): Promise<boolean> => {
  setError(null);
  try {
   const response = await fetch('/api/auth/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
   });
   const data = await response.json();

   if (response.ok && data.success) {
    setUser(data.user);
    setIsAuthenticated(true);
    setError(null);
    return true;
   } else {
    const errorMessage = data.error || 'Registration failed. Please try again.';
    setError(errorMessage);
    setUser(null);
    setIsAuthenticated(false);
    return false;
   }
  } catch (err) {
   console.error('Error during registration request:', err);
   setError('An error occurred during registration.');
   setUser(null);
   setIsAuthenticated(false);
   return false;
  }
 }, []);

 const logout = useCallback(async (): Promise<boolean> => {
  setError(null);
  try {
   const response = await fetch('/api/auth/logout.php', {
    method: 'POST',
   });
   const data = await response.json();

   if (response.ok && data.success) {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    return true;
   } else {
    const errorMessage = data.error || 'Logout failed.';
    setError(errorMessage);
    return false;
   }
  } catch (err) {
   console.error('Error during logout request:', err);
   setError('An error occurred during logout.');
   return false;
  }
 }, []);

 const contextValue = useMemo(
  () => ({
   user,
   isAuthenticated,
   isLoading,
   error,
   login,
   register,
   logout,
   clearError,
  }),
  [user, isAuthenticated, isLoading, error, login, register, logout, clearError]
 );

 return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
 const context = useContext(AuthContext);
 if (context === undefined) {
  throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};