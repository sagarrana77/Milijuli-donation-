
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  type AuthError
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { type User as AppUser } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

// Force the auth domain to fix localhost/cloud workstation issues in some environments
if (auth.config.authDomain) {
    auth.config.authDomain = 'clarity-chainfinal2-5492-9f214.firebaseapp.com';
}


// Combine Firebase user with our app-specific user data
export type AuthUser = FirebaseUser & AppUser;

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<AuthError | null>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<AuthError | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to fetch/create user profile in Firestore
const getOrCreateUserProfile = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return {id: docSnap.id, ...docSnap.data()} as AppUser;
    } else {
        const newUserProfile: Omit<AppUser, 'id'> = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || `https://avatar.vercel.sh/${firebaseUser.uid}`,
            profileUrl: `/profile/${firebaseUser.uid}`,
            bio: 'Welcome to milijuli donation sewa!',
            isAdmin: firebaseUser.email === 'aayush.kc@example.com',
            canCreateCampaigns: firebaseUser.email === 'aayush.kc@example.com',
            friends: [],
            aiCredits: 10,
            isProMember: false,
        };

        await setDoc(userRef, {
            ...newUserProfile,
            joinedAt: serverTimestamp(),
        });
        
        return {id: firebaseUser.uid, ...newUserProfile};
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
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        return null;
    } catch (error) {
        return error as AuthError;
    }
  }

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        // The onAuthStateChanged listener will handle creating the Firestore doc
        return null;
      } catch (error) {
          return error as AuthError;
      }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = { user, loading, signInWithGoogle, signOut, signInWithEmail, signUpWithEmail };

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
