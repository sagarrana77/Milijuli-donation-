import { config } from 'dotenv';
config();

import '@/ai/flows/generate-donor-friendly-reports.ts';
import '@/ai/flows/send-thank-you-email.ts';
import '@/ai/flows/generate-wishes.ts';
import '@/ai/flows/generate-social-media-post.ts';
import '@/ai/flows/generate-seo-suggestions.ts';
import '@/ai/flows/summarize-project.ts';
import '@/ai/flows/generate-campaign-story.ts';
