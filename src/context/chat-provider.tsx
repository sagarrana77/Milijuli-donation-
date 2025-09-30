
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CommunityChat } from '@/components/chat/community-chat';

interface ChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);

  const value = {
    isChatOpen,
    openChat,
    closeChat,
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
