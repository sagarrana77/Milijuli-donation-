

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { users, currentUser } from '@/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Search, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';


export default function FriendsPage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [friends, setFriends] = useState(currentUser?.friends || []);
    const [pendingFriends, setPendingFriends] = useState<string[]>([]);

    const handleToggleFriend = (userId: string) => {
        if (!currentUser) return;

        const isFriend = friends.includes(userId);
        const isPending = pendingFriends.includes(userId);
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        if (isFriend || isPending) {
            // For this simulation, we won't handle removing friends here
            // to keep the "Add -> Pending -> Friend" flow clear.
            return;
        }

        // Add to pending state
        setPendingFriends(prev => [...prev, userId]);
        toast({
            title: 'Friend Request Sent',
            description: `Your friend request to ${user.name} has been sent.`,
        });

        // Simulate the friend accepting after a delay
        setTimeout(() => {
            const updatedFriends = [...friends, userId];
            setFriends(updatedFriends);
            setPendingFriends(prev => prev.filter(id => id !== userId));
            
            if(currentUser.friends) {
                currentUser.friends = updatedFriends;
            }

            toast({
                title: 'Friend Request Accepted',
                description: `${user.name} has accepted your friend request.`,
            });
        }, 3000);
    };
    
    const filteredUsers = users.filter(user => 
        user.id !== currentUser?.id && 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <Users className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Find Friends</h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          Connect with other users on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Browse Users</CardTitle>
          <CardDescription>
            Search for users and add them to your network.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          <div className="space-y-4">
            {filteredUsers.map(user => {
              const isFriend = friends.includes(user.id);
              const isPending = pendingFriends.includes(user.id);
              return (
                <div key={user.id} className="flex items-center justify-between rounded-md border p-4">
                  <Link href={user.profileUrl} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>
                    </div>
                  </Link>
                  <Button
                    variant={isFriend ? 'outline' : isPending ? 'secondary' : 'default'}
                    onClick={() => handleToggleFriend(user.id)}
                    disabled={isFriend || isPending}
                    className={cn("w-[140px]", !isFriend && !isPending && "bg-green-600 hover:bg-green-700 text-white")}
                  >
                    {isFriend ? <UserCheck className="mr-2 h-4 w-4" /> : isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {isFriend ? 'Friend' : isPending ? 'Pending' : 'Add Friend'}
                  </Button>
                </div>
              );
            })}
             {filteredUsers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                    No users found matching your search.
                </p>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
