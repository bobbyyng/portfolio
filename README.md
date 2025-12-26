# AI Agent Portfolio Website

A modern, interactive portfolio website built with Next.js, featuring an integrated AI agent powered by XAI. The AI agent can answer questions about your portfolio, professional experience, and projects. The site uses MDX for project documentation and is fully responsive.

## Features

- **AI Agent**: Interactive AI assistant built with XAI (Grok), able to answer questions and assist visitors about the portfolio, experience, and projects.
- **MDX Project Pages**: Dynamic project documentation with rich formatting powered by MDX.
- **Responsive Design**: Layout optimized for all devices.
- **Project Showcase**: Detailed project pages include technologies, descriptions, and key contributions.
- **Work Experience**: Comprehensive work history.
- **Technical Skills**: Categorized skill badges.
- **Vercel Analytics**: Built-in analytics for tracking site performance.
- **Modern UI**: Professional interface via Tailwind CSS & Radix UI.

## Tech Stack

### Frontend
- **Next.js 16** – React framework (App Router)
- **React 19** – UI library
- **TypeScript** – Type safety for JavaScript
- **Tailwind CSS 4** – Utility-first CSS framework
- **Radix UI** – Accessible component primitives
- **Lucide React** – Icon library
- **MDX** – Markdown with JSX support

### AI & Backend
- **Vercel AI SDK** – AI integration
- **XAI (Grok)** – AI agent model
- **LangChain** – AI application framework (future extension)
- **Next.js API Routes** – Server-side endpoints

### Content Management
- **MDX** – Markdown/React components
- **JSON** – Profile/project metadata

### DevOps & Deployment
- **Vercel** – Hosting/deployment
- **Vercel Analytics** – Website analytics
- **Docker** – Containerization (local dev)

## Getting Started

### Prerequisites

- **Node.js** 18+ (or Bun)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-agent-portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` in the root directory:
```env
XAI_API_KEY=your_xai_api_key_here
```

To get an XAI API key:
- Visit [XAI Console](https://console.x.ai/)
- Sign up or log in
- Generate an API key
- Add it to your `.env.local` file

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Configuration

### Customizing Your Profile

Edit `content/profile.json` to update your info:

- **Basic Info**: Name, title, location, experience
- **Summary**: Professional summary
- **Work Experience**: Companies, positions, periods, descriptions
- **Education**: Institutions, degrees, periods
- **Selected Projects**: References to MDX files for homepage
- **Skills**: Organized by category
- **Languages**: Proficiencies
- **Contact**: Email, phone, social, CV

### Adding Projects

1. Create a new MDX file in `content/projects/`
   - Format: `[number].[project-name].mdx`
   - Example: `11.my-new-project.mdx`

2. Add frontmatter:
```mdx
---
title: My New Project
tags: React, TypeScript, Next.js
startDate: 2024
endDate: 2024
sorting: 50
---

# Project Background
Your project description here...
```

3. Optionally, add the project to `selectedProjects` in `profile.json`.

### Project MDX Structure

MDX files support:
- Markdown syntax
- React components
- Frontmatter
- Syntax-highlighted code blocks

Example structure:
```mdx
---
title: Project Name
tags: Technology1, Technology2
startDate: 2024
endDate: 2024
sorting: 50
---

# Project Background
Description...

# My Responsibilities
- Responsibility 1
- Responsibility 2

# Key Contributions
- Contribution 1
- Contribution 2

## Technical Skills Demonstrated
- Skill 1
- Skill 2
```

## Development

### Available Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build
- `npm run start` – Start prod server
- `npm run lint` – Run ESLint

### Code Structure

- **Components**: `components/`
- **Pages**: `app/`
- **API Routes**: `app/api/`
- **Utilities**: `lib/`
- **Content**: `content/`

### AI Agent Chat

The AI agent uses:
- **XAI Grok model** for language understanding
- **Vercel AI SDK** for streaming responses
- **Custom tools** for fetching profile, contact, & projects
- **Discord webhook** for logging (optional)

Agent capabilities:
- Answer experience/project questions
- Search/show project details
- Provide contact info
- Create job inquiry records

### Environment Variables

Required:
- `XAI_API_KEY` – for AI chat agent

Optional:
- Discord webhook URL (see `lib/send-discord-msg.tsx`)

## License

This project is private and not licensed for public use.