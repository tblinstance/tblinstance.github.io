"use client";

import React, { createContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Zap } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
         <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="p-3 bg-primary rounded-full">
                <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Loading AuthFlow...</p>
          </div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
