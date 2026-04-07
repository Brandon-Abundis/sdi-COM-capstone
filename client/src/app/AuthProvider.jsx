import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn("Session restore failed:", err.message);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Login - using local storage with fake user for now, but will call backend later
  const login = async (fakeUser) => {
    setLoading(true);
    try {
      setUser(fakeUser);
      localStorage.setItem("user", JSON.stringify(fakeUser));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Signup - same as login for now
  const signup = async (fakeUser) => {
    setLoading(true);
    try {
      setUser(fakeUser);
      localStorage.setItem("user", JSON.stringify(fakeUser));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
