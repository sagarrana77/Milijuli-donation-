# ClarityChain - A Transparent Fundraising Platform

This is a Next.js starter project built in Firebase Studio. It demonstrates a transparent fundraising platform with a public-facing site and a comprehensive admin dashboard for managing content and finances. The project uses Genkit for AI-powered features.

## Features

- **Real-time Dashboard**: A homepage with live stats on funds raised, spent, and on hand.
- **Project Management**: Create, manage, and display fundraising projects with progress tracking.
- **Operational Cost Transparency**: Publicly log and display salaries, equipment, and miscellaneous costs.
- **Admin Panel**: A secure, role-based admin section to manage all site content.
- **AI-Powered Features**:
  - Automatically generate donor-friendly reports from financial data.
  - Send personalized thank-you emails to donors after a successful contribution.
- **Fully Functional UI**: Built with Next.js, React, ShadCN UI, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation Instructions

Follow these steps to get your development environment set up and running.

### 1. Clone the Repository

First, clone this repository to your local machine. If you've downloaded the code, you can skip this step.

```bash
git clone https://github.com/your-repo/clarity-chain.git
cd clarity-chain
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

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server after a build.
- `npm run lint`: Lints the codebase for errors.
