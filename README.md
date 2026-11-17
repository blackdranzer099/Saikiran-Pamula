# Sai Pamula — Portfolio

A cinematic personal portfolio built with Next.js, TypeScript, React Three Fiber, Three.js, GSAP, ScrollTrigger, Lenis, and Tailwind CSS.

## Requirements

- Node.js 20.9+
- pnpm (recommended; the repository includes a pnpm lockfile)

## Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Production build

```bash
pnpm build
pnpm start
```

## Architecture

- `app/`: Next.js App Router entry points and global styles.
- `components/portfolio-experience.tsx`: portfolio sections, navigation, preloader, project case studies, and interactive skills network.
- `public/`: static icons and assets.

## Content and assets

The case-study descriptions are anonymized capability narratives, not claims of published client deliverables or measured outcomes. Update them only with approved, verified information.

The hero portrait and depth map currently use externally hosted image URLs inherited from the initial concept. For long-term production reliability, replace these with approved optimized assets in `public/images/` and update the constants in the portfolio component.

The LinkedIn destination is intentionally omitted until the verified profile URL is supplied.

## Deployment

Connect this repository to Vercel and deploy the `main` branch for production. Use `development` for preview work. No environment variables are required by the current implementation.
