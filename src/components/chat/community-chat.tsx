
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
import { sendMessage, useChatMessages, type ChatMessage } from '@/services/chat-service';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessagesSquare } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").max(500, "Message is too long."),
});

type ChatFormData = z.infer<typeof chatSchema>;

export function CommunityChat() {
  const { isChatOpen, closeChat } = useChat();
  const { user, loading: authLoading } = useAuth();
  const { messages, loading: messagesLoading } = useChatMessages();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormData>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });

  const onSubmit = async (data: ChatFormData) => {
    if (!user) return;
    try {
      await sendMessage(data.message, user);
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages, isChatOpen]);

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
        <div className="flex-1 min-h-0">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                    {messagesLoading ? (
                        [...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 w-3/4" />)
                    ) : (
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
                    )}
                </div>
            </ScrollArea>
        </div>
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
                        <Input placeholder="Type your message..." {...field} autoComplete="off" />
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
              Please <Link href="/login" className="text-primary underline">log in</Link> to join the chat.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
