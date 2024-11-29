"use client"
import { redirect } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define o tipo para os dados de autenticação
export interface AuthData {
  token: string;
  role: string;
}

// Define o tipo para o contexto
interface AuthContextType {
  authData: AuthData | null;
  setAuthData: (data: AuthData | null) => void;
  clearAuthData: () => void;
}

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor do contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  const clearAuthData = () => setAuthData(null);

  
  return (
    <AuthContext.Provider value={{ authData, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
