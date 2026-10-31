import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  loginAsDemo: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "demo-user",
    name: "Демо-пользователь",
  });

  function loginAsDemo() {
    setUser({ id: "demo-user", name: "Демо-пользователь" });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }

  return context;
}