'use client';

import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService, User, AuthState } from '@/lib/auth';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (nickname: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = AuthService.getStoredUser();
        if (storedUser) {
            setAuthState({
                user: storedUser,
                isAuthenticated: true
            });
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const result = await AuthService.login(email, password);

        if (result.success && result.user) {
            setAuthState({
                user: result.user,
                isAuthenticated: true
            });
            return { success: true };
        }

        return { success: false, error: result.error };
    };

    const register = async (nickname: string, email: string, password: string) => {
        const result = await AuthService.register(nickname, email, password);

        if (result.success && result.user) {
            setAuthState({
                user: result.user,
                isAuthenticated: true
            });
            return { success: true };
        }

        return { success: false, error: result.error };
    };

    const logout = () => {
        AuthService.logout();
        setAuthState({
            user: null,
            isAuthenticated: false
        });
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            register,
            logout,
            loading
        }}>
            {children}
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
