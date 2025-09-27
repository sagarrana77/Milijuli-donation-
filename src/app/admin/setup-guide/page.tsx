
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
                    <Link href={section.link} className="text-sm font-medium text-primary hover:underline">
                        {section.linkText} &rarr;
                    </Link>
                </CardContent>
            </Card>
        ))}
      </div>

       <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-start gap-4">
          <Server className="h-8 w-8 text-primary mt-1" />
          <div>
            <CardTitle>Running Your App Locally</CardTitle>
            <CardDescription>
              Follow these steps to get your development environment set up and running on your local machine.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground">1. Install Dependencies</h3>
            <p>Install all the required npm packages using the following command. This will download and install all the libraries listed in `package.json`.</p>
            <pre className="mt-2 rounded-md bg-muted p-2 text-xs"><code>npm install</code></pre>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">2. Set Up Environment Variables</h3>
            <p>The AI features in this application are powered by Google's Gemini model through Genkit. To use them, you need a Gemini API key. Create a new file named `.env` in the root directory and add your key.</p>
             <pre className="mt-2 rounded-md bg-muted p-2 text-xs"><code>GEMINI_API_KEY=YOUR_API_KEY_HERE</code></pre>
             <p className="mt-1">You can get a key from <Link href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</Link>.</p>
          </div>
           <div>
            <h3 className="font-semibold text-foreground">3. Run the Application</h3>
            <p>This application requires two separate development servers. Open two terminal windows for the following commands.</p>
            <h4 className="mt-2 font-medium text-foreground">Terminal 1: Run the Next.js App</h4>
            <p>This command starts the main web application on `http://localhost:3000`.</p>
             <pre className="mt-2 rounded-md bg-muted p-2 text-xs"><code>npm run dev</code></pre>
            <h4 className="mt-2 font-medium text-foreground">Terminal 2: Run the Genkit AI Flows</h4>
             <p>This command starts the Genkit server, which handles AI-powered features.</p>
             <pre className="mt-2 rounded-md bg-muted p-2 text-xs"><code>npm run genkit:dev</code></pre>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-start gap-4">
          <Cloud className="h-8 w-8 text-primary mt-1" />
          <div>
            <CardTitle>Deploying Live (Free Options)</CardTitle>
            <CardDescription>
                To deploy your app live for free, use a service like Vercel (recommended) or Netlify. They offer seamless integration with Next.js.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
                <h3 className="font-semibold text-foreground">1. Push to a Git Repository</h3>
                <p>Make sure your project is in a GitHub, GitLab, or Bitbucket repository. If you haven't done this yet, you can create a new repository on your preferred platform and follow their instructions to upload your code.</p>
            </div>
            <div>
                <h3 className="font-semibold text-foreground">2. Connect Your Repository to Vercel</h3>
                <p>Sign up for a free Vercel account and connect it to your Git provider. Select your project repository to import it.</p>
            </div>
            <div>
                <h3 className="font-semibold text-foreground">3. Configure Environment Variables</h3>
                <p>In the Vercel project settings, find the "Environment Variables" section. You must add your `GEMINI_API_KEY` here, just like you did for your local `.env` file. This keeps your key secure and allows the live application to use the AI features.</p>
                <ul className="mt-2 list-disc pl-5">
                    <li>**Name:** `GEMINI_API_KEY`</li>
                    <li>**Value:** Paste your actual API key here.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-foreground">4. Deploy</h3>
                <p>Vercel will automatically detect that you're using Next.js and configure the build settings. Simply click "Deploy". Your app will be live in minutes, and Vercel will automatically redeploy whenever you push new changes to your repository.</p>
                 <Link href="https://vercel.com/docs/frameworks/nextjs" className="mt-2 inline-block text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    View Vercel's Next.js Deployment Docs &rarr;
                 </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
