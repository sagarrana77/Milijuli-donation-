
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/context/notification-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsPage() {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;


  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <CardTitle className="text-2xl">All Notifications</CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
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
                     {isClient ? (
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                        </p>
                     ) : (
                        <Skeleton className="h-3 w-20" />
                     )}
                  </div>
                  {!notification.read && (
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" title="Unread" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex h-48 items-center justify-center p-4">
                <p className="text-muted-foreground">You have no notifications.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
