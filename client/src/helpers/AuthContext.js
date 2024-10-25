import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ status: false, user: null, id:0, loading: true });

  useEffect(() => {
    // Function to check if the user is authenticated
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/status', { withCredentials: true });


        if (response.data.loggedIn) {
          setAuth({ status: true, user: response.data.user.username, id:response.data.user.id, loading: false });
        } else {
          setAuth({ status: false, user: null, id:0, loading: false });
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setAuth({ status: false, user: null, id:0, loading: false });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};