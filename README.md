# BuzzDaddy (ReplyGuy Clone)
Generate buzz about your product, startup, channel and more with AI generated comments! Set keywords to scrape posts across X, Linkedin & Reddit and respond organically while promoting whatever you want to promote. Use the AI agent to automate your UGC promotion daily. UGC converts better than paid ads!

<a href="https:/buzzdaddy.ai">
  <img alt="SaaS Starter" src="public/og.jpg">
  <h1 align="center"BuzzData</h1>
</a>

## Installation

Clone & create this repo locally with the following command:

```bash
npx create-next-app my-saas-project --example "https://github.com/mickasmt/next-saas-stripe-starter"
```

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Start the development server:

```sh
pnpm dev
```

## UGC Media Studio

This repo includes **Ultimate Multimodal** — a MuAPI-powered UGC media studio mounted **natively inside ReplyGuy** (no iframe, no second server).

### Setup

1. Add your MuAPI key to the main app environment:

```bash
MUAPI_API_KEY=your_key_here
```

Or configure it per-user at `/dashboard/media-studio/settings`.

2. Apply the media studio database tables:

```bash
npx prisma db push
```

3. Start ReplyGuy:

```bash
npm install
npm run dev
```

4. Open the studio at `/dashboard/media-studio`.

### Routes

| Route | Description |
|-------|-------------|
| `/dashboard/media-studio` | Overview |
| `/dashboard/media-studio/image` | Image generation |
| `/dashboard/media-studio/video` | Video generation |
| `/dashboard/media-studio/ugc/*` | UGC workflows |
| `/dashboard/media-studio/settings` | MuAPI key & defaults |
| `/project/media-studio?id={campaignId}` | Project shortcuts (links assets to campaign) |
| `/project?id={campaignId}` | Campaign workspace with media assets panel |

Pass `?campaignId=` (or open from `/project/media-studio?id=`) to auto-link generated outputs to a campaign.

The `media-studio/` folder contains the MuAPI client, workflow engine, and Generative-Media-Skills recipes used by the native routes.

See [media-studio/README.md](media-studio/README.md) for package-level docs.

### VPS deployment (no Vercel)

On your own server (e.g. Hostinger VPS):

```bash
# One-time: clone, env, Node 20+
git clone https://github.com/bennymalonee/ReplyGuy-clone.git
cd ReplyGuy-clone
cp .env.example .env.local   # fill DATABASE_URL, NEXTAUTH_*, MUAPI_API_KEY, etc.

npm install --legacy-peer-deps
bash scripts/vps-deploy.sh
```

Run behind nginx/Caddy with SSL, proxying to `http://127.0.0.1:3000`.

**PM2:** `ecosystem.config.js` is included — deploy script restarts it automatically.

**Cron:** Vercel crons do not apply on VPS. Use `scripts/vps-cron.example` with system crontab to hit `/api/cron/campaign/*`.

**Media studio DB:** `npm run db:push` (or `deploy:vps`) creates `media_studio_*` tables on your Postgres.

> [!NOTE]  
> I use [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) package for update this project.
>
> Use this command for update your project: `ncu -i --format group`

> [!CAUTION]  
> Errors while the build if you update the `resend` & `remark-gfm` packages.

## Roadmap

- [x] ~Fix Vaul drawer for mobile sign in~  
- [x] ~Update OG image~  
- [x] ~Add Server Actions on billing form (stripe)~
- [x] ~Add Server Actions on user name form~
- [ ] Upgrade Auth.js to v5 (working on it)
- [ ] Add resend for success subscriptions 
- [ ] Update documentation
- [ ] Switch subscription plan

## Tech Stack + Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Prisma](https://www.prisma.io/) – Typescript-first ORM for Node.js
- [React Email](https://react.email/) – Versatile email framework for efficient and flexible email development

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [PlanetScale](https://planetscale.com/) – A cutting-edge database platform for seamless, scalable data management
- [Resend](https://resend.com/) – A powerful email framework for streamlined email development

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance
- [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) – Generate dynamic Open Graph images at the edge

### Hooks and Utilities

- `useIntersectionObserver` –  React hook to observe when an element enters or leaves the viewport
- `useLocalStorage` – Persist data in the browser's local storage
- `useScroll` – React hook to observe scroll position ([example](https://github.com/mickasmt/precedent/blob/main/components/layout/navbar.tsx#L12))
- `nFormatter` – Format numbers with suffixes like `1.2k` or `1.2M`
- `capitalize` – Capitalize the first letter of a string
- `truncate` – Truncate a string to a specified length
- [`use-debounce`](https://www.npmjs.com/package/use-debounce) – Debounce a function call / state update

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### Miscellaneous

- [Vercel Analytics](https://vercel.com/analytics) – Track unique visitors, pageviews, and more in a privacy-friendly way

## Author

Started from open source template by [@miickasmt](https://twitter.com/miickasmt) in 2023, released under the [MIT license](https://github.com/shadcn/taxonomy/blob/main/LICENSE.md).

## Credits

This project was inspired by shadcn's [Taxonomy](https://github.com/shadcn-ui/taxonomy), Steven Tey’s [Precedent](https://github.com/steven-tey/precedent), and Antonio Erdeljac's [Next 13 AI SaaS](https://github.com/AntonioErdeljac/next13-ai-saas) and obviously [ReplyGuy](https://replyguy.com)

- Shadcn ([@shadcn](https://twitter.com/shadcn))
- Steven Tey ([@steventey](https://twitter.com/steventey))
- Antonio Erdeljac ([@YTCodeAntonio](https://twitter.com/AntonioErdeljac))

