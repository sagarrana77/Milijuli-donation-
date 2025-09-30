
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { CommunityChat } from '@/components/chat/community-chat';
import { usePublicChatMessages, useFriendChatMessages } from '@/services/chat-service';
import { useAuth } from './auth-provider';

interface ChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  newPublicMessages: number;
  newFriendMessages: number;
  clearPublicNotifications: () => void;
  clearFriendNotifications: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newPublicMessages, setNewPublicMessages] = useState(0);
  const [newFriendMessages, setNewFriendMessages] = useState(0);
  const { user } = useAuth();
  
  const { messages: publicMessages } = usePublicChatMessages();
  const { messages: friendMessages } = useFriendChatMessages(user);

  useEffect(() => {
    if (!isChatOpen && publicMessages.length > 0) {
      // This is a simplified logic. A robust solution would compare timestamps.
      setNewPublicMessages(prev => prev + 1);
    }
  }, [publicMessages, isChatOpen]);
  
  useEffect(() => {
    if (!isChatOpen && friendMessages.length > 0) {
      setNewFriendMessages(prev => prev + 1);
    }
  }, [friendMessages, isChatOpen]);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  
  const clearPublicNotifications = useCallback(() => setNewPublicMessages(0), []);
  const clearFriendNotifications = useCallback(() => setNewFriendMessages(0), []);

  const value = {
    isChatOpen,
    openChat,
    closeChat,
    newPublicMessages,
    newFriendMessages,
    clearPublicNotifications,
    clearFriendNotifications,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <CommunityChat />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
