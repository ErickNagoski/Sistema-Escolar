"use client"
import api from '@/services/api';
import { redirect } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthmeProps = {
  email: string;
  matricula?: string;
  name?: string;
  id?: number;
  situation?: string;
}


// Define o tipo para os dados de autenticação
export interface AuthData {
  user?: AuthmeProps;
  role: string;
  token: string
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

  useEffect(() => {
    if (authData?.user?.email) {
      api.post<AuthmeProps>('/auth/me', { email: authData?.user?.email }, {
        headers: {
          Authorization: `Bearer ${authData?.token}`
        }
      }).then(res => {
        if (authData) {
          setAuthData({ ...authData, user: res.data })
        }
      })
    }
  }, [authData?.token])

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
