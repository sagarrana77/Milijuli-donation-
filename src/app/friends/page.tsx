

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { users, currentUser } from '@/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Search, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';


export default function FriendsPage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [friends, setFriends] = useState(currentUser?.friends || []);

    const handleToggleFriend = (userId: string) => {
        const isFriend = friends.includes(userId);
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        if (isFriend) {
            // Simulate removing a friend
            setFriends(prev => prev.filter(id => id !== userId));
            toast({
                title: 'Friend Removed',
                description: `${user.name} has been removed from your friends list.`,
            });
        } else {
            // Simulate adding a friend
            setFriends(prev => [...prev, userId]);
            toast({
                title: 'Friend Added!',
                description: `${user.name} has been added to your friends list.`,
            });
        }
        // In a real app, you would make an API call here to update the backend.
        const currentUserData = users.find(u => u.id === currentUser?.id);
        if(currentUserData) {
            currentUserData.friends = isFriend ? friends.filter(id => id !== userId) : [...friends, userId];
        }
    };
    
    const filteredUsers = users.filter(user => 
        user.id !== currentUser?.id && 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <Users className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Find Friends</h1>
        <p className="mt-2 text-lg text-muted-foreground">
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
                    variant={isFriend ? 'outline' : 'default'}
                    onClick={() => handleToggleFriend(user.id)}
                  >
                    {isFriend ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {isFriend ? 'Friend' : 'Add Friend'}
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

