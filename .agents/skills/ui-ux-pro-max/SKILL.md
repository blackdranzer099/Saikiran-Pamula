---
name: ui-ux-pro-max
description: Apply UI UX Pro Max design intelligence when designing, building, reviewing, or fixing this portfolio's interface, visual system, responsive behavior, accessibility, interaction, typography, color, motion, or stack-specific UI.
---

# UI UX Pro Max — Portfolio Design Workflow

Use this skill for every visual/UI task in this repository. It is a project-level integration guide for the upstream UI UX Pro Max skill by NextLevelBuilder.

## Upstream skill and full engine

Official source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Official license: MIT. The upstream project currently documents 80 searchable styles, 192 product palettes/reasoning profiles, 74 font pairings, 120 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types and 22 technology stacks.

For the full local searchable database and scripts, install the official Codex package from the repository root:
```bash
npx ui-ux-pro-max-cli init --ai codex
```
The npm package is `ui-ux-pro-max-cli`; its command is `uipro`. Do not use the older `uipro-cli` package. If the full skill already exists in `.agents/skills/ui-ux-pro-max/`, do not overwrite it with this guide; merge the portfolio brief below into the existing workflow.

## Project facts — do not guess

- Product: personal engineering / creative technology portfolio.
- Stack detected from package.json: Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Three Fiber, Drei, Three.js, GSAP, Lenis.
- Existing project dependencies should be reused. Do not add another UI or animation framework without a concrete requirement.
- Positioning: Creative Engineer combining integration/data architecture, full-stack engineering and AI-powered product experiments.
- Desired art direction: dark editorial × technical luxury × cinematic 3D.
- Reference inspiration: the Paddock / Lando Norris experience for immersive storytelling, scene transitions and art direction. Do not copy personal branding, logos, proprietary photos or exact assets.

## Mandatory workflow

1. Inspect the existing component, styles, route and current responsive behavior before proposing changes.
2. For a new page or system-wide redesign, run the official design-system generator and save a project-specific MASTER.md. Use the detected Next.js / Three.js stack, not generic defaults.
3. For a focused issue, search the relevant domain (UX, typography, style, color, GSAP, React) and the Next.js or Three.js stack as appropriate. Verify search results fit the task; never fabricate a database match.
4. Establish hierarchy, layout, typography, semantic color tokens, spacing, surfaces, motion and responsive rules before implementation.
5. Make the smallest coherent implementation. Avoid repeating generic card grids, default gradients, meaningless animations, oversized text without art direction, and filler copy.
6. Preserve semantic HTML, keyboard access, visible focus, 4.5:1 normal-text contrast, descriptive accessible names, reduced-motion support and usable touch targets.
7. Test 375px, 768px, 1024px and 1440px. Check overflow, typography wrapping, focus, pointer states, touch interactions, reduced motion and Three.js fallbacks.
8. Run the production build and relevant tests. State clearly which checks were actually executed; never claim browser QA without running it.

## Portfolio art direction

- Use ink/charcoal surfaces, warm-white type and a restrained electric-lime signal accent; avoid generic AI purple/pink gradients.
- Use editorial typography, deliberate line breaks, readable measure, generous negative space and precise micro-spacing.
- Build a technical visual language from contour lines, grids, subtle grain, material depth and controlled lighting.
- Give each chapter one memorable visual signature; do not reuse the same layout pattern everywhere.
- Hero: legible name immediately, confident portrait/object composition, role and one primary action.
- About: editorial biography with verified proof points.
- On Systems / Off Systems: enterprise integration/data engineering contrasted with creative experiments.
- Selected Work: case-study storytelling with problem, architecture, role, constraints and measurable outcomes only where verified.
- Engineering Lab: interactive experiments and shader studies.
- Journey: concise credible timeline.
- Contact: decisive low-friction close.
- Motion must communicate hierarchy or narrative. Use existing GSAP/Lenis; use Three.js only where it materially improves the scene.

## Repository safety

- Work only on `development`; never commit to `main`.
- Do not deploy or modify production settings unless explicitly requested.
- Preserve existing content and design decisions unless the user authorizes a change.
- Do not invent credentials, metrics, client claims or project outcomes.
