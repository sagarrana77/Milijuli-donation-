
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellRing, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/data';

interface NotificationListProps {
  notifications: Notification[];
}

export function NotificationList({ notifications: initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };


  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-72">
          {notifications.length > 0 ? (
            <div className="p-4 space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="mt-1">
                     <BellRing className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.date, { addSuffix: true })}
                    </p>
                  </div>
                   {!notification.read && (
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" title="Unread" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <p className="text-muted-foreground">You have no new notifications.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-2">
        <Button variant="link" className="w-full text-sm" asChild>
            <Link href="/notifications">View all notifications</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
