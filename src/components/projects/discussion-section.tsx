
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/lib/data';
import Link from 'next/link';
import { Reply } from 'lucide-react';

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
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop',
      profileUrl: '/profile/current-user',
      date: new Date(),
      text: values.comment,
    };

    // Simulate optimistic update
    setComments((prev) => [newComment, ...prev]);
    form.reset();
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Community Discussion</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop" alt="Current User" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts or ask a question... Use @ to mention a user."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Post Comment
                </Button>
              </div>
            </div>
          </form>
        </Form>
        
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-4">
                 <Link href={comment.profileUrl}>
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={comment.avatarUrl} alt={comment.author} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <Link href={comment.profileUrl} className="font-semibold hover:underline">
                        {comment.author}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.date, { addSuffix: true })}
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
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">Be the first to start the discussion!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
