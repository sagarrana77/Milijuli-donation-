
'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/context/chat-provider';
import { useAuth } from '@/context/auth-provider';
import { sendPublicMessage, usePublicChatMessages, sendFriendMessage, useFriendChatMessages, type ChatMessage } from '@/services/chat-service';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessagesSquare, Users } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").max(500, "Message is too long."),
});

type ChatFormData = z.infer<typeof chatSchema>;

function ChatRoom({ messages, loading, user, isPublic }: { messages: ChatMessage[], loading: boolean, user: any, isPublic: boolean }) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            setTimeout(() => {
                const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
            }, 100);
        }
    }, [messages]);

    if (loading) {
        return <div className="p-4 space-y-4">{[...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 w-3/4" />)}</div>
    }

    if (!user && !isPublic) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                 <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold">Friends Chat</h3>
                <p className="text-muted-foreground text-sm">This is a private space for you and your friends. Please log in to participate.</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
                <AnimatePresence>
                {messages.map((msg, index) => (
                    <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={`flex items-start gap-3 ${msg.authorId === user?.uid ? 'justify-end' : ''}`}
                    >
                        {msg.authorId !== user?.uid && (
                            <Link href={`/profile/${msg.authorId}`}>
                                <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={msg.authorAvatarUrl} />
                                    <AvatarFallback>{msg.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Link>
                        )}
                        <div className={`flex flex-col ${msg.authorId === user?.uid ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-baseline gap-2">
                                {msg.authorId !== user?.uid && (
                                    <Link href={`/profile/${msg.authorId}`} className="text-sm font-semibold hover:underline">
                                        {msg.authorName}
                                    </Link>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {msg.timestamp ? formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true }) : 'just now'}
                                </span>
                            </div>
                            <div className={`p-3 rounded-2xl max-w-sm md:max-w-md ${msg.authorId === user?.uid ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                        {msg.authorId === user?.uid && (
                             <Link href={`/profile/${msg.authorId}`}>
                                <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={msg.authorAvatarUrl} />
                                    <AvatarFallback>{msg.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                             </Link>
                        )}
                    </motion.div>
                ))}
                </AnimatePresence>
                 {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                        <MessagesSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-semibold">It's quiet in here...</h3>
                        <p className="text-muted-foreground text-sm">Be the first to start the conversation!</p>
                    </div>
                 )}
            </div>
        </ScrollArea>
    );
}

export function CommunityChat() {
  const { isChatOpen, closeChat, newPublicMessages, newFriendMessages, clearPublicNotifications, clearFriendNotifications } = useChat();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('public');
  
  const { messages: publicMessages, loading: publicLoading } = usePublicChatMessages();
  const { messages: friendMessages, loading: friendLoading } = useFriendChatMessages(user);

  useEffect(() => {
    if (isChatOpen) {
        if (activeTab === 'public') {
            clearPublicNotifications();
        } else if (activeTab === 'friends') {
            clearFriendNotifications();
        }
    }
  }, [activeTab, isChatOpen, clearPublicNotifications, clearFriendNotifications]);

  const form = useForm<ChatFormData>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });

  const onSubmit = async (data: ChatFormData) => {
    if (!user) return;
    try {
      if (activeTab === 'public') {
        await sendPublicMessage(data.message, user);
      } else {
        await sendFriendMessage(data.message, user);
      }
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Sheet open={isChatOpen} onOpenChange={(open) => !open && closeChat()}>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <MessagesSquare className="h-6 w-6" /> Community Chat
          </SheetTitle>
           <SheetDescription>
            Talk with other donors and supporters in real-time.
          </SheetDescription>
        </SheetHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 sticky top-0 bg-background z-10 px-4 pt-4">
                <TabsTrigger value="public" className="relative data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                    Public
                    {newPublicMessages > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 bg-red-600 text-white">{newPublicMessages}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="friends" className="relative data-[state=active]:bg-green-600 data-[state=active]:text-white">
                    Friends
                     {newFriendMessages > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 bg-red-600 text-white">{newFriendMessages}</Badge>}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="public" className="flex-1 min-h-0 mt-0">
                <ChatRoom messages={publicMessages} loading={publicLoading} user={user} isPublic={true} />
            </TabsContent>
            <TabsContent value="friends" className="flex-1 min-h-0 mt-0">
                <ChatRoom messages={friendMessages} loading={friendLoading} user={user} isPublic={false} />
            </TabsContent>
        </Tabs>
        <div className="p-4 border-t bg-background">
          {user ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Message in ${activeTab} chat...`} {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Please <button onClick={() => closeChat()} className="text-primary underline">log in</button> to join the chat.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
