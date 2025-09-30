
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import type { AuthUser } from '@/context/auth-provider';

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  timestamp: Timestamp;
}

export async function sendPublicMessage(text: string, user: AuthUser) {
  try {
    if (!user) throw new Error("User not authenticated");

    await addDoc(collection(db, 'communityChat'), {
      text,
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      authorAvatarUrl: user.photoURL || `https://avatar.vercel.sh/${user.uid}`,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending public message: ", error);
    throw error;
  }
}

export async function sendFriendMessage(text: string, user: AuthUser) {
    try {
      if (!user || !user.friends) throw new Error("User not authenticated or has no friends list.");
  
      await addDoc(collection(db, 'friendChats'), {
        text,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatarUrl: user.photoURL || `https://avatar.vercel.sh/${user.uid}`,
        timestamp: serverTimestamp(),
        // Store an array of IDs that should see this message.
        // The sender is included to see their own messages.
        friendIds: [...user.friends, user.uid],
      });
    } catch (error) {
      console.error("Error sending friend message: ", error);
      throw error;
    }
  }

export function usePublicChatMessages(messageLimit = 50) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'communityChat'),
        orderBy('timestamp', 'desc'),
        limit(messageLimit)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newMessages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        setMessages(newMessages.reverse());
        setLoading(false);
      }, (err) => {
        console.error("Error fetching public chat messages: ", err);
        setError(err);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up public chat subscription: ", err);
      setError(err as Error);
      setLoading(false);
    }
  }, [messageLimit]);

  return { messages, loading, error };
}

export function useFriendChatMessages(user: AuthUser | null, messageLimit = 50) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      if (!user) {
        setMessages([]);
        setLoading(false);
        return;
      }
  
      try {
        const q = query(
          collection(db, 'friendChats'),
          // Use 'array-contains' to find messages where the current user's ID is in the friendIds array.
          where('friendIds', 'array-contains', user.uid),
          orderBy('timestamp', 'desc'),
          limit(messageLimit)
        );
  
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const newMessages: ChatMessage[] = [];
          querySnapshot.forEach((doc) => {
            newMessages.push({ id: doc.id, ...doc.data() } as ChatMessage);
          });
          setMessages(newMessages.reverse());
          setLoading(false);
        }, (err) => {
          console.error("Error fetching friend chat messages: ", err);
          setError(err);
          setLoading(false);
        });
  
        return () => unsubscribe();
      } catch (err) {
        console.error("Error setting up friend chat subscription: ", err);
        setError(err as Error);
        setLoading(false);
      }
    }, [user, messageLimit]);
  
    return { messages, loading, error };
  }
