
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, Edit, UserPlus, CircleHelp, Settings, List, Briefcase, Server, Cloud } from 'lucide-react';
import Link from 'next/link';

const guideSections = [
    {
        icon: List,
        title: 'Manage Projects',
        link: '/admin',
        linkText: 'Go to Projects Tab',
        description: 'To create a new fundraising campaign, go to the "Projects" tab on the main admin dashboard and click "Add Project". Fill out all the required details, including descriptions, fundraising goals, and a header image. New projects will instantly appear on the homepage and the main projects page.'
    },
    {
        icon: Briefcase,
        title: 'Update Operational Costs',
        link: '/admin',
        linkText: 'Go to Operational Costs Tab',
        description: 'To maintain transparency, you can log all operational costs. Use the "Operational Costs" tab to add salaries, equipment purchases, and other miscellaneous expenses. This information will be publicly visible on the "Operational Costs" page.'
    },
    {
        icon: Edit,
        title: 'Edit "About Us" Content',
        link: '/admin/about',
        linkText: 'Go to About Page Editor',
        description: 'You can change the mission statement, hero tagline, team members, and core values directly from the "Edit About Page" section. Changes are reflected on the public "About" page as soon as you save them.'
    },
    {
        icon: UserPlus,
        title: 'Manage Careers',
        link: '/admin/careers',
        linkText: 'Go to Careers Manager',
        description: 'Post new job or volunteer openings using the "Manage Careers" page. You can add, edit, feature, and remove positions. All active openings will be listed on the public "Careers" page.'
    },
    {
        icon: CircleHelp,
        title: 'Manage Help & FAQs',
        link: '/admin/help',
        linkText: 'Go to Help Page Editor',
        description: 'Update the Frequently Asked Questions (FAQs) and contact information from the "Manage Help Page". This helps users find answers quickly and know how to reach you.'
    },
    {
        icon: Settings,
        title: 'Configure Platform Settings',
        link: '/admin',
        linkText: 'Go to Platform Settings Tab',
        description: 'In the "Platform Settings" tab, you can configure payment gateways, manage API credentials for services like Stripe and PayPal, and update the social media links for the floating contact button.'
    },
    {
        icon: Server,
        title: 'Running Your App Locally',
        link: 'https://github.com/FirebaseExtended/clarity-chain#readme', 
        linkText: 'View README for full instructions',
        description: 'To run this project locally, first, get the code. Then, run `npm install` to install dependencies. Create a `.env` file and add your `GEMINI_API_KEY=YOUR_API_KEY`. Finally, run `npm run dev` for the Next.js app and `npm run genkit:dev` for the AI flows in separate terminals.'
    },
    {
        icon: Cloud,
        title: 'Deploying Live (Free Options)',
        link: 'https://vercel.com/new',
        linkText: 'Deploy with Vercel',
        description: 'To deploy your app live for free, use services like Vercel (recommended) or Netlify. Connect your Git repository, configure the environment variables (like your GEMINI_API_KEY), and the service will automatically build and deploy your application.'
    },
];

export default function AdminSetupGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <BookOpen className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Setup Guide</h1>
          <p className="text-muted-foreground">
            Your step-by-step guide to managing the ClarityChain platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guideSections.map((section, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-start gap-4">
                    <section.icon className="h-8 w-8 text-primary mt-1" />
                    <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Link href={section.link} className="text-sm font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        {section.linkText} &rarr;
                    </Link>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
