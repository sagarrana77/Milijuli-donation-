
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import type { Project, User } from '@/lib/data';
import { allDonations, users as allUsersData } from '@/lib/data';
import Link from 'next/link';
import { Reply, Award } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';

type Comment = Project['discussion'][0];

interface DiscussionSectionProps {
  comments: Comment[];
  projectId: string;
}

const formSchema = z.object({
  comment: z.string().min(3, {
    message: 'Comment must be at least 3 characters long.',
  }).max(500, {
      message: 'Comment must not be longer than 500 characters.'
  }),
});

export function DiscussionSection({
  comments: initialComments,
  projectId,
}: DiscussionSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [mentionQuery, setMentionQuery] = useState('');
  const [isMentionPopoverOpen, setIsMentionPopoverOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const topDonorIds = useMemo(() => {
    const donationTotals: Record<string, number> = {};
    allDonations.forEach(donation => {
        if (!donation.donor || donation.donor.id === 'user-anonymous') return;
        if (donationTotals[donation.donor.id]) {
            donationTotals[donation.donor.id] += donation.amount;
        } else {
            donationTotals[donation.donor.id] = donation.amount;
        }
    });
    const sortedDonors = Object.keys(donationTotals).sort((a, b) => donationTotals[b] - donationTotals[a]);
    return sortedDonors.slice(0, 5);
  }, []);
  
  const sortedUsers = useMemo(() => {
    return [...allUsersData].sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  
  const filteredUsers = useMemo(() => {
    if (!mentionQuery) return sortedUsers;
    return sortedUsers.filter(user =>
      user.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  }, [mentionQuery, sortedUsers]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
    },
  });

  // In a real app, this would be an API call.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'Current User', // This would come from auth
      authorId: 'aayush-kc', // This would come from auth
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop',
      profileUrl: '/profile/current-user',
      date: new Date().toISOString(),
      text: values.comment,
      replyTo: replyTo,
    };

    // Simulate optimistic update
    setComments((prev) => [newComment, ...prev]);
    form.reset();
    setReplyTo(undefined);
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    form.setValue('comment', text);

    const match = text.match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setIsMentionPopoverOpen(true);
    } else {
      setIsMentionPopoverOpen(false);
      setMentionQuery('');
    }
  };

  const handleUserSelect = (user: User) => {
    const currentText = form.getValues('comment');
    const newText = currentText.replace(/@(\w*)$/, `@${user.name} `);
    form.setValue('comment', newText);
    setIsMentionPopoverOpen(false);
    setMentionQuery('');
    textareaRef.current?.focus();
  };

  const handleReply = (authorName: string) => {
    setReplyTo(authorName);
    form.setValue('comment', `@${authorName} `);
    textareaRef.current?.focus();
  };


  return (
    <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Community Discussion</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop" alt="Current User" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
            <Popover open={isMentionPopoverOpen} onOpenChange={setIsMentionPopoverOpen}>
                <PopoverTrigger asChild>
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Textarea
                                placeholder={replyTo ? `Replying to @${replyTo}...` : "Share your thoughts or ask a question... Use @ to mention a user."}
                                rows={3}
                                {...field}
                                ref={textareaRef}
                                onChange={handleTextChange}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </PopoverTrigger>
                 {(filteredUsers.length > 0 && isMentionPopoverOpen) && (
                    <PopoverContent className="p-0 w-80">
                        <ScrollArea className="max-h-60">
                             <div className="space-y-1 p-2">
                                {filteredUsers.map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className="w-full text-left p-2 rounded-md hover:bg-accent flex items-center gap-2"
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </PopoverContent>
                 )}
            </Popover>
              <div className="flex justify-end gap-2">
                 {replyTo && (
                    <Button variant="ghost" size="sm" onClick={() => setReplyTo(undefined)}>Cancel Reply</Button>
                )}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Post Comment
                </Button>
              </div>
            </div>
          </form>
        </Form>
        
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const isTopDonor = topDonorIds.includes(comment.authorId);
              return (
                <div key={comment.id} className="flex items-start gap-4 group">
                   <Link href={comment.profileUrl} className="relative inline-block">
                      <Avatar className="h-10 w-10 border">
                          <AvatarImage src={comment.avatarUrl} alt={comment.author} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                       {isTopDonor && (
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-0.5 text-white border border-background">
                              <Award className="h-3 w-3" />
                          </div>
                      )}
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <Link href={comment.profileUrl} className="font-semibold hover:underline">
                          {comment.author}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                      </p>
                    </div>
                      {comment.replyTo && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Reply className="h-3 w-3" />
                              Replying to <span className="font-medium text-primary/80">@{comment.replyTo}</span>
                          </p>
                      )}
                    <p className="mt-1 text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                   <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                        onClick={() => handleReply(comment.author)}
                        >
                        <Reply className="h-4 w-4" />
                        <span className="sr-only">Reply</span>
                    </Button>
                </div>
              )
            })
          ) : (
            <p className="text-muted-foreground text-center py-4">Be the first to start the discussion!</p>
          )}
        </div>
      </CardContent>
  );
}
