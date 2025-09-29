import { config } from 'dotenv';
config();

import '@/ai/flows/generate-donor-friendly-reports.ts';
import '@/ai/flows/send-thank-you-email.ts';
import '@/ai/flows/generate-wishes.ts';
