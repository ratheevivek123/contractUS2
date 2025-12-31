// src/context/UserContext.js
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create context
const UserContext = createContext();

// Create provider
export const UserProvider = ({ children }) => {
  const [User, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Optional loading state

  const fetchUser = async () => {
    try {
      
      const res = await axios.get("http://localhost:3000/api/auth/token", { withCredentials: true });
      setUser(res.data.user);
     
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null); // or redirect to login if unauthorized
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ User, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Export custom hook
export const useUser = () => useContext(UserContext);
