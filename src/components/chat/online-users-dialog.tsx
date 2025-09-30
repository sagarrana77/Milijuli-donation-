'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
import type { User as AppUser, AuthUser } from '@/context/auth-provider';

interface OnlineUsersDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onlineUsers: AppUser[];
    currentUser: AuthUser | null;
}

function UserList({ users }: { users: AppUser[] }) {
    if (users.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No users in this category are online.</p>
    }
    return (
        <div className="space-y-2">
            {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <Link href={user.profileUrl} className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                        </div>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{user.bio}</p>
                        </div>
                    </Link>
                    <Button variant="ghost" size="icon">
                        <UserPlus className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    )
}

export function OnlineUsersDialog({ isOpen, onOpenChange, onlineUsers, currentUser }: OnlineUsersDialogProps) {

    const { friends, others } = useMemo(() => {
        if (!currentUser) return { friends: [], others: onlineUsers };

        const friendIds = currentUser.friends || [];
        const friends = onlineUsers.filter(u => u.id !== currentUser.uid && friendIds.includes(u.id));
        const others = onlineUsers.filter(u => u.id !== currentUser.uid && !friendIds.includes(u.id));

        return { friends, others };
    }, [onlineUsers, currentUser]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md h-[70vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Online Users ({onlineUsers.length})</DialogTitle>
                    <DialogDescription>
                        See who is currently active on the platform.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="all" className="flex-1 min-h-0 flex flex-col">
                    <div className="px-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="all">Public ({others.length})</TabsTrigger>
                            <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
                        </TabsList>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <TabsContent value="all" className="m-0">
                                <UserList users={others} />
                            </TabsContent>
                            <TabsContent value="friends" className="m-0">
                                <UserList users={friends} />
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}