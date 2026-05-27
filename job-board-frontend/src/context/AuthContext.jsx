import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) return;

      try {
        const { data } = await axios.get('http://localhost:3000/me', {
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
