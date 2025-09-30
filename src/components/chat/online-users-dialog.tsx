
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import type { User as AppUser, AuthUser } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { users } from '@/lib/data';

interface UserListProps {
    users: AppUser[];
    currentUser: AuthUser | null;
    friends: string[];
    onToggleFriend: (userId: string) => void;
}


function UserList({ users, currentUser, friends, onToggleFriend }: UserListProps) {
    if (users.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No users in this category are online.</p>
    }
    return (
        <div className="space-y-2">
            {users.map(user => {
                 const isFriend = friends.includes(user.id);
                 const isSelf = user.id === currentUser?.uid;

                 if (isSelf) return null;

                return (
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
                    <Button
                        variant={isFriend ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => onToggleFriend(user.id)}
                        className={cn("w-[120px]", !isFriend && "bg-green-600 hover:bg-green-700 text-white")}
                    >
                        {isFriend ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {isFriend ? 'Friend' : 'Add Friend'}
                    </Button>
                </div>
            )})}
        </div>
    )
}

interface OnlineUsersDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onlineUsers: AppUser[];
    currentUser: AuthUser | null;
}

export function OnlineUsersDialog({ isOpen, onOpenChange, onlineUsers, currentUser }: OnlineUsersDialogProps) {
    const { toast } = useToast();
    const [friends, setFriends] = useState(currentUser?.friends || []);
    
    const handleToggleFriend = (userId: string) => {
        if (!currentUser) return;
        
        const isFriend = friends.includes(userId);
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        let updatedFriends;
        if (isFriend) {
            updatedFriends = friends.filter(id => id !== userId);
            toast({
                title: 'Friend Removed',
                description: `${user.name} has been removed from your friends list.`,
            });
        } else {
            updatedFriends = [...friends, userId];
            toast({
                title: 'Friend Added!',
                description: `${user.name} has been added to your friends list.`,
            });
        }
        
        setFriends(updatedFriends);
        
        // This is where you'd update the database in a real app.
        // For our mock data, we'll update the in-memory user object.
        currentUser.friends = updatedFriends;
    };


    const { friendUsers, otherUsers } = useMemo(() => {
        if (!currentUser) return { friendUsers: [], otherUsers: onlineUsers };

        const friendUsers = onlineUsers.filter(u => u.id !== currentUser.uid && friends.includes(u.id));
        const otherUsers = onlineUsers.filter(u => u.id !== currentUser.uid && !friends.includes(u.id));

        return { friendUsers, otherUsers };
    }, [onlineUsers, currentUser, friends]);

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
                            <TabsTrigger value="all">Public ({otherUsers.length})</TabsTrigger>
                            <TabsTrigger value="friends">Friends ({friendUsers.length})</TabsTrigger>
                        </TabsList>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <TabsContent value="all" className="m-0">
                                <UserList users={otherUsers} currentUser={currentUser} friends={friends} onToggleFriend={handleToggleFriend} />
                            </TabsContent>
                            <TabsContent value="friends" className="m-0">
                                <UserList users={friendUsers} currentUser={currentUser} friends={friends} onToggleFriend={handleToggleFriend} />
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
