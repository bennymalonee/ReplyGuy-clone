# Ultimate Multimodal — UGC Media Studio Platform

Part of [ReplyGuy-clone](https://github.com/cameronking4/ReplyGuy-clone) — use alongside BuzzDaddy to scrape social posts and generate UGC video/image ads for your product.

A self-hosted generative media studio powered by [MuAPI](https://muapi.ai) and [Generative-Media-Skills](https://github.com/SamurAIGPT/Generative-Media-Skills).

## Features

- **UGC Studio** — Video Factory, Ads Workflow, Lifestyle Try-On pipelines
- **Image & Video Studios** — Generate with 100+ MuAPI models
- **Workflow Browser** — 41+ recipes from Generative-Media-Skills
- **Admin Dashboard** — Job queue, projects, API settings, credit balance
- **Dual design system** — Skillshare-style creator UI (DESIGN1) + Officevibe-style dashboard (DESIGN2)

## Quick Start

```bash
# Install dependencies
npm install

# Configure API key
cp .env.example .env.local
# Add MUAPI_API_KEY=your_key_here

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the creator studio.
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the admin dashboard.

## Project Structure

```
├── skills/           # Generative-Media-Skills (cloned)
├── platform/         # Next.js 15 app
├── packages/
│   ├── muapi-client/     # MuAPI REST wrapper
│   ├── workflow-engine/  # SKILL.md parser + UGC pipelines
│   └── shared/           # Shared types
├── DESIGN1.md        # Creator frontend design spec
└── DESIGN2.md        # Dashboard design spec
```

## Prerequisites

- Node.js 20+
- MuAPI API key from [muapi.ai/dashboard](https://muapi.ai/dashboard)

## License

MIT
