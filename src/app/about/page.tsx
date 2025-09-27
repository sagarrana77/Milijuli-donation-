
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teamMembers, values, aboutContent } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, Eye, LineChart, ListChecks, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';

function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
}

const features: { title: string; description: string; icon: LucideIcon }[] = [
    {
        title: 'Real-Time Financial Ledger',
        description: 'Every donation and expense is recorded on a public ledger for anyone to see, ensuring a complete and unalterable record of all financial activities.',
        icon: Eye,
    },
    {
        title: 'Detailed Project Breakdowns',
        description: 'Each project page provides granular details on funds raised, expenses with receipts, progress updates, and community discussions.',
        icon: ListChecks,
    },
    {
        title: 'Transparent Operational Costs',
        description: 'We go beyond project spending by openly sharing our operational costs, including salaries, equipment, and administrative expenses.',
        icon: LineChart,
    },
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <ScrollFadeIn>
        <section className="relative h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={getImageUrl('team-photo')}
            alt="Our Team"
            fill
            objectFit="cover"
            className="brightness-75"
            data-ai-hint="team photo"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold md:text-5xl">About ClarityChain</h1>
              <p className="mt-4 max-w-2xl text-lg">
                {aboutContent.tagline}
              </p>
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn asChild>
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                {aboutContent.mission}
              </p>
            </CardContent>
          </Card>
        </section>
      </ScrollFadeIn>
      
      <ScrollFadeIn asChild>
        <section>
          <h2 className="mb-6 text-center text-3xl font-bold">How We Practice Transparency</h2>
           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollFadeIn key={feature.title} delay={index * 100}>
                <Card className="h-full">
                  <CardHeader className="flex-row items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                     <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn asChild>
        <section>
          <h2 className="mb-6 text-center text-3xl font-bold">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <ScrollFadeIn key={member.id} delay={index * 100}>
                <Card className="text-center transition-shadow hover:shadow-lg">
                  <Link href={`/team/${member.id}`}>
                    <CardContent className="p-6">
                      <Avatar className="mx-auto mb-4 h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-primary">{member.role}</p>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                    </CardContent>
                  </Link>
                </Card>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn asChild>
        <section>
          <h2 className="mb-6 text-center text-3xl font-bold">Our Core Values</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <ScrollFadeIn key={value.title} delay={index * 100}>
                <Card>
                  <CardHeader className="flex-row items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </ScrollFadeIn>
    </div>
  );
}
