import { notFound } from 'next/navigation';
import { getTeamMember } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const member = getTeamMember(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <Avatar className="h-32 w-32 border-4 border-primary">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <p className="text-xl text-primary">{member.role}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
               {member.socials.twitter && (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={member.socials.twitter} target="_blank">
                        <TwitterIcon className="h-5 w-5" />
                    </Link>
                </Button>
               )}
                {member.socials.linkedin && (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={member.socials.linkedin} target="_blank">
                        <LinkedInIcon className="h-5 w-5" />
                    </Link>
                </Button>
               )}
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>About {member.name.split(' ')[0]}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="whitespace-pre-wrap text-lg text-muted-foreground">{member.bio}</p>
        </CardContent>
      </Card>
    </div>
  );
}

    