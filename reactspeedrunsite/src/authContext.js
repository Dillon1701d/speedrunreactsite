
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebaseConfig";
// Create a context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Stop loading when auth state is resolved
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Provide user and loading state to children
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children} {/* Render children only after loading is done */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
