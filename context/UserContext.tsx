import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface UserContextType {
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  upgradeToPremium: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Active session user
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eduverse_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Helper to get the "Database" of registered users from localStorage
  const getUsersDB = (): Record<string, User> => {
     try {
         const db = localStorage.getItem('eduverse_users_db');
         return db ? JSON.parse(db) : {};
     } catch (e) {
         return {};
     }
  }

  // Helper to save a user to the "Database"
  const saveToUsersDB = (u: User) => {
     const db = getUsersDB();
     db[u.email] = u;
     localStorage.setItem('eduverse_users_db', JSON.stringify(db));
  }

  // Persist active user to local storage for session persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('eduverse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eduverse_user');
    }
  }, [user]);

  const login = (email: string) => {
    const db = getUsersDB();
    const existingUser = db[email];

    if (existingUser) {
        // Load the saved profile
        setUser(existingUser);
    } else {
        // Fallback for demo if email not found in DB (Simulate new generic user or error)
        // For smoother UX in demo, we'll create a temporary session user
        const sessionUser = {
            name: 'Learner',
            email: email,
            role: UserRole.Student,
            isPremium: false
        };
        setUser(sessionUser);
    }
  };

  const signup = (name: string, email: string) => {
    const newUser: User = {
        name: name,
        email: email,
        isPremium: false
        // Role is undefined initially, will be set in PersonaSelection
    };
    setUser(newUser);
    saveToUsersDB(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        // Sync updates to the "Database" so they persist across logins
        saveToUsersDB(updated); 
        return updated;
    });
  };

  const upgradeToPremium = () => {
    updateUser({ isPremium: true });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateUser,
      upgradeToPremium
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};