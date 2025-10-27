import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin, Tutor, Student } from '@/types';

interface AuthContextType {
  user: User | Admin | Tutor | Student | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Admin | Tutor | Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin login
    if (email === 'admin@gmail.com' && password === 'admin123') {
      const adminUser: Admin = {
        id: 'admin-1',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        fullName: 'Administrador',
        phone: '',
        createdAt: new Date().toISOString(),
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    // Regular user login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      // Check if tutor is approved
      if (foundUser.role === 'tutor' && foundUser.status !== 'approved') {
        return false;
      }
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: any): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some((u: User) => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
    };

    if (userData.role === 'tutor') {
      (newUser as Tutor).status = 'pending';
      (newUser as Tutor).rating = 0;
      (newUser as Tutor).reviewCount = 0;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
