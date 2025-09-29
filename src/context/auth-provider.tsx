'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { users as mockUsers, type User as AppUser } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

// Combine Firebase user with our app-specific user data
export type AuthUser = FirebaseUser & AppUser;

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  // Add other methods like signInWithEmail, signUp, etc.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to fetch/create user profile in Firestore
const getOrCreateUserProfile = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return docSnap.data() as AppUser;
    } else {
        // Find if user exists in mock data to bootstrap profile
        const mockUser = mockUsers.find(u => u.email === firebaseUser.email);
        
        const newUserProfile: AppUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || `https://avatar.vercel.sh/${firebaseUser.uid}`,
            profileUrl: `/profile/${firebaseUser.uid}`,
            bio: mockUser?.bio || 'Welcome to ClarityChain!',
            isAdmin: mockUser?.isAdmin || false,
            canCreateCampaigns: mockUser?.canCreateCampaigns || false,
            friends: mockUser?.friends || [],
            aiCredits: mockUser?.aiCredits || 10, // Give some starter credits
            isProMember: mockUser?.isProMember || false,
        };

        await setDoc(userRef, {
            ...newUserProfile,
            joinedAt: serverTimestamp(),
        });
        
        return newUserProfile;
    }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getOrCreateUserProfile(firebaseUser);
        setUser({ ...firebaseUser, ...userProfile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = { user, loading, signInWithGoogle, signOut };

  return (
    <AuthContext.Provider value={value}>
        {loading ? (
             <div className="flex h-screen w-screen items-center justify-center">
                <div className="w-1/2 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        ) : children}
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
