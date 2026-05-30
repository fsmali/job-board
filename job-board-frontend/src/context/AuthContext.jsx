import { createContext, useContext, useState, useEffect } from 'react';

import api from '../api/axios';

const AuthContext = createContext();
// Children represents the wrapped components
// (e.g. <App />) that will have access
// to the authentication context.
export function AuthProvider({ children }) {
  // Keep user logged in after refresh
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) return;

      try {
        //Who is currently logged in?
        const { data } = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(data);
      } catch (error) {
        console.log(error);

        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    };

    fetchCurrentUser();
    //
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
