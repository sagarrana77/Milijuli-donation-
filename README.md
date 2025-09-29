# milijuli sewa - A Transparent Fundraising Platform

This is a Next.js starter project built in Firebase Studio. It demonstrates a transparent fundraising platform with a public-facing site and a comprehensive admin dashboard for managing content and finances. The project uses Genkit for AI-powered features.

## Features

- **Real-time Dashboard**: A homepage with live stats on funds raised, spent, and on hand, including a real-time ledger of donations and an expense breakdown chart.
- **Project Management**: Create, manage, and display fundraising projects with progress tracking, updates, and discussion forums.
- **Operational Cost Transparency**: Publicly log and display salaries, equipment, and miscellaneous costs to ensure full accountability.
- **Comprehensive Admin Panel**: A secure, role-based admin section to manage all site content, including:
    - Fund and expense management.
    - Project creation and editing.
    - Public-facing content management for the "About," "Careers," and "Help" pages.
    - Platform settings for payment gateways and social media links.
- **AI-Powered Features**:
  - Automatically generate donor-friendly reports from financial data.
  - Send personalized thank-you emails to donors after a successful contribution.
- **User and Team Profiles**: Public profiles for donors and team members to foster a sense of community.
- **Careers and Job Openings**: A dedicated section to post and manage job and volunteer opportunities.
- **Help & Support Center**: A fully manageable FAQ section and contact information page.
- **Fully Functional UI**: Built with Next.js, React, ShadCN UI, and Tailwind CSS, featuring a responsive design that works on all devices.
- **Detailed Setup Guide**: An in-app guide for administrators covering local setup, deployment, and platform management.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Installation Instructions

Follow these steps to get your development environment set up and running.

### 1. Clone the Repository

First, clone this repository to your local machine. If you've downloaded the code, you can skip this step.

```bash
git clone https://github.com/your-repo/milijuli-sewa.git
cd milijuli-sewa
```

### 2. Install Dependencies

Install all the required npm packages using the following command. This will download and install all the libraries listed in `package.json`.

```bash
npm install
```

### 3. Set Up Environment Variables

The AI features in this application are powered by Google's Gemini model through Genkit. To use them, you need a Gemini API key.

1.  Create a new file named `.env` in the root directory of your project.
2.  Add your Gemini API key to this file. You can get a key from [Google AI Studio](https://aistudio.google.com/).

```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### 4. Run the Application

This application requires two separate development servers to be running simultaneously: one for the Next.js frontend and another for the Genkit AI flows.

**Terminal 1: Run the Next.js App**

This command starts the main web application on `http://localhost:3000`.

```bash
npm run dev
```

**Terminal 2: Run the Genkit AI Flows**

This command starts the Genkit development server, which handles the AI-powered features like report generation and thank-you emails.

```bash
npm run genkit:dev
```

Once both servers are running, you can open your browser and navigate to `http://localhost:3000` to see the application in action.

## Deployment Instructions

To deploy your app live for free, we recommend using a service like [Vercel](https://vercel.com), which is built by the creators of Next.js.

### 1. Push to a Git Repository

Make sure your project is in a GitHub, GitLab, or Bitbucket repository. If you initialized the project locally, create a new repository on your preferred platform and push your code.

```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

### 2. Connect Your Repository to Vercel

1.  Sign up for a free Vercel account and connect it to your Git provider (GitHub, GitLab, etc.).
2.  Click "Add New... > Project" from your Vercel dashboard.
3.  Select your project repository to import it.

### 3. Configure Environment Variables

In the Vercel project settings, find the "Environment Variables" section. You must add your `GEMINI_API_KEY` here. This keeps your key secure and allows the live application to use its AI features.

-   **Name:** `GEMINI_API_KEY`
-   **Value:** Paste your actual Gemini API key here.

### 4. Deploy

Vercel will automatically detect that you're using Next.js and configure the build settings. Simply click "Deploy". Your app will be live in minutes, and Vercel will automatically redeploy whenever you push new changes to your repository.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server after a build.
- `npm run lint`: Lints the codebase for errors.
