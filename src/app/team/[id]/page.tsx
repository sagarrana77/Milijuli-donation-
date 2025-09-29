

import { notFound } from 'next/navigation';
import { getTeamMember } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const member = getTeamMember(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
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
                    <Link href={member.socials.twitter} target="_blank" rel="noopener noreferrer">
                        <TwitterIcon className="h-5 w-5 text-sky-500" />
                    </Link>
                </Button>
               )}
                {member.socials.linkedin && (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={member.socials.linkedin} target="_blank" rel="noopener noreferrer">
                        <LinkedInIcon className="h-5 w-5 text-blue-700" />
                    </Link>
                </Button>
               )}
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600"><User className="h-5 w-5" />About {member.name.split(' ')[0]}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap text-base text-muted-foreground">{member.bio}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700"><Briefcase className="h-5 w-5" /> Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {member.experience.map((exp, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-700" />
                            <div>
                                <h3 className="font-semibold">{exp.role}</h3>
                                <p className="text-muted-foreground">{exp.company}</p>
                                <p className="text-sm text-muted-foreground/80">{exp.duration}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600"><GraduationCap className="h-5 w-5" /> Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {member.education.map((edu, index) => (
                        <div key={index} className="flex gap-4">
                           <div className="mt-1 h-2 w-2 rounded-full bg-orange-600" />
                            <div>
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="text-muted-foreground">{edu.institution}</p>
                                <p className="text-sm text-muted-foreground/80">{edu.year}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <aside className="lg:col-span-1 lg:sticky top-24 self-start">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600"><Star className="h-5 w-5" /> Key Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {member.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">{skill}</Badge>
                    ))}
                </CardContent>
            </Card>
        </aside>
      </div>
    </div>
  );
}
