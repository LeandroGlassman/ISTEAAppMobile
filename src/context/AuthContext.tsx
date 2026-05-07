import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "@app_users";
const SESSION_KEY = "@app_session_user";

type User = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  currentUser: string | null;
  loading: boolean;
  register: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        if (session) setCurrentUser(session);
      } catch (e) {
        console.error("[AuthContext] error restaurando sesión:", e);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const getUsers = async (): Promise<User[]> => {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const register = async (username: string, password: string) => {
    const u = username.trim();
    if (!u) return { ok: false, error: "El usuario no puede estar vacío" };
    if (password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres" };

    const users = await getUsers();
    if (users.some(x => x.username === u)) {
      return { ok: false, error: "Ese usuario ya está registrado" };
    }
    const updated = [...users, { username: u, password }];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));
    console.log("[AuthContext] usuario registrado:", u);
    return { ok: true };
  };

  const login = async (username: string, password: string) => {
    const users = await getUsers();
    const found = users.find(x => x.username === username.trim() && x.password === password);
    if (!found) return { ok: false, error: "Usuario o contraseña incorrectos" };

    await AsyncStorage.setItem(SESSION_KEY, found.username);
    setCurrentUser(found.username);
    console.log("[AuthContext] login OK:", found.username);
    return { ok: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    console.log("[AuthContext] logout");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: currentUser !== null,
        currentUser,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
