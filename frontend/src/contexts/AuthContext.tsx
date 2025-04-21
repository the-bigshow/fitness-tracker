import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'fitness_tracker_users';
const CURRENT_USER_KEY = 'fitness_tracker_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    },
    signUp: async (email: string, password: string) => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      
      if (users.some((u: User) => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    },
    signOut: async () => {
      setUser(null);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}