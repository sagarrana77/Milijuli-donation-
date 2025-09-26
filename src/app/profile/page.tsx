import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="mx-auto mb-4 h-24 w-24">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop" alt="Current User" />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">Current User</CardTitle>
          <p className="text-muted-foreground">donor@example.com</p>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            This is a placeholder profile page. In a real application, users would be able to view their donation history, manage their personal information, and update their notification settings here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
