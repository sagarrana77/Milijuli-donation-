

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teamMembers as initialTeamMembers, values as initialValues, aboutContent as initialAboutContent } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, Eye, LineChart, ListChecks, LucideIcon, Repeat, Wand2, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { Button } from '@/components/ui/button';
import { usePricingDialog } from '@/context/pricing-dialog-provider';
import { AnimatedLogo } from '@/components/layout/animated-logo';

function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
}

const features: { title: string; description: string; icon: LucideIcon, link?: string }[] = [
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
    {
        title: 'AI-Powered Features',
        description: 'Generate simple, donor-friendly summaries and create compelling campaign stories with a single click, making complex data easy to understand and share.',
        icon: Wand2,
    },
    {
        title: 'Flexible Fund Relocation',
        description: 'To maximize impact, surplus funds from over-funded or cancelled campaigns may be relocated to other projects in need. This is always done with donor consent and full transparency.',
        icon: Repeat,
        link: '/fund-relocation-policy'
    }
];

export default function AboutPage() {
  const { openPhoto } = usePhotoDialog();
  const { openDialog: openPricingDialog } = usePricingDialog();
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [values, setValues] = useState(initialValues);
  const [aboutContent, setAboutContent] = useState<typeof initialAboutContent | null>(null);

  useEffect(() => {
    setAboutContent(initialAboutContent);
    setTeamMembers(initialTeamMembers);
    setValues(initialValues);
  }, []);

  const teamPhotoUrl = getImageUrl('team-photo');

  if (!aboutContent) {
    return (
      <div className="flex h-96 items-center justify-center">
        <AnimatedLogo />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <ScrollFadeIn>
        <section className="relative h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={teamPhotoUrl}
            alt="Our Team"
            fill
            objectFit="cover"
            className="brightness-75 cursor-pointer"
            onClick={() => openPhoto({ imageUrl: teamPhotoUrl, title: 'Our Team' })}
            data-ai-hint="team photo"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold md:text-5xl">About milijuli donation sewa</h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg">
                {aboutContent.tagline}
              </p>
            </div>
          </div>
        </section>
      </ScrollFadeIn>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
            <ScrollFadeIn asChild>
                <section>
                <Card>
                    <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-base md:text-lg text-muted-foreground">
                        {aboutContent.mission}
                    </p>
                    </CardContent>
                </Card>
                </section>
            </ScrollFadeIn>
            
            <ScrollFadeIn asChild>
                <section>
                <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold">How We Practice Transparency</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            {feature.link && (
                                <Link href={feature.link} className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                                    Learn More &rarr;
                                </Link>
                            )}
                        </CardContent>
                        </Card>
                    </ScrollFadeIn>
                    ))}
                </div>
                </section>
            </ScrollFadeIn>
            
            <ScrollFadeIn asChild>
                 <section>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                                <Star className="h-7 w-7 text-primary" />
                                Pro Membership & AI Credits
                            </CardTitle>
                            <CardDescription>
                                Supercharge your fundraising with our Pro Membership and AI credits.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                While milijuli donation sewa is free to use, our Pro Membership and AI credits provide powerful tools to enhance your campaigns. Pro members get exclusive benefits, and AI credits can be used to generate compelling stories, summaries, and social media posts.
                            </p>
                            <Button onClick={openPricingDialog}>View Pricing & Benefits</Button>
                        </CardContent>
                    </Card>
                </section>
            </ScrollFadeIn>

            <ScrollFadeIn asChild>
                <section>
                <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold">Meet Our Team</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
        </div>
        <div className="lg:col-span-1">
             <ScrollFadeIn asChild>
                <aside className="sticky top-24 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl">Our Core Values</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             {values.map((value) => (
                                <div key={value.title}>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                                        <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold">{value.title}</h3>
                                    </div>
                                    <p className="mt-2 text-muted-foreground">{value.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </aside>
            </ScrollFadeIn>
        </div>
      </div>
    </div>
  );
}
