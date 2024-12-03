"use client"
import api from '@/services/api';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthmeProps = {
  email: string;
  matricula?: string;
  name?: string;
  id?: number;
  situation?: string;
}

export interface AuthData {
  user?: AuthmeProps;
  role: string;
  token: string;
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
  const [authData, setAuthDataState] = useState<AuthData | null>(null);

  // Função para salvar no localStorage
  const saveAuthData = (data: AuthData | null) => {
    if (data) {
      localStorage.setItem('authData', JSON.stringify(data));
    } else {
      localStorage.removeItem('authData');
    }
    setAuthDataState(data);
  };

  // Função para limpar dados de autenticação
  const clearAuthData = () => saveAuthData(null);

  // Recupera os dados do localStorage ao carregar o componente
  useEffect(() => {
    const storedData = localStorage.getItem('authData');
    console.log(storedData)
    if (storedData) {
      setAuthDataState(JSON.parse(storedData));
    }
  }, []);

  // Atualiza os dados do usuário, se necessário
  useEffect(() => {
    if (authData?.user?.email) {
      api
        .post<AuthmeProps>('/auth/me', { email: authData?.user?.email }, {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        })
        .then((res) => {
          if (authData) {
            saveAuthData({ ...authData, user: res.data });
          }
        })
        .catch(() => clearAuthData());
    }
  }, [authData?.token]);

  return (
    <AuthContext.Provider value={{ authData, setAuthData: saveAuthData, clearAuthData }}>
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
