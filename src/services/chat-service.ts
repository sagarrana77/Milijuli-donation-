
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
  Timestamp
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

export async function sendMessage(text: string, user: AuthUser) {
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
    console.error("Error sending message: ", error);
    throw error;
  }
}

export function useChatMessages(messageLimit = 50) {
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
        console.error("Error fetching chat messages: ", err);
        setError(err);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up chat subscription: ", err);
      setError(err as Error);
      setLoading(false);
    }
  }, [messageLimit]);

  return { messages, loading, error };
}
