## Design System – Job Notification App

This folder contains the **foundational design system** for the Job Notification App. It is technology-aligned with a MERN stack but intentionally **feature-agnostic** – only primitives, no product flows.

### Design Philosophy

- **Calm, intentional, coherent, confident**
- No gradients, no glassmorphism, no neon, no noisy animations
- Serious B2C SaaS aesthetic, not a student or hackathon project

### Core Principles

- **Color**
  - Background: `#F7F6F3` (off‑white, global app background)
  - Primary text: `#111111`
  - Accent: `#8B0000` (deep red, used for primary CTAs, key highlights)
  - Success: muted green (`#2F6F4E`)
  - Warning: muted amber (`#AD7A1A`)
  - Palette is deliberately small and desaturated to keep the UI calm and coherent.

- **Typography**
  - Headings: serif stack (configured in CSS), large and confident with generous spacing
  - Body: clean sans-serif, base size 16–18px, line-height 1.6–1.8
  - Max readable text width: 720px
  - No decorative fonts, no random font sizes

- **Spacing**
  - Scale: **8px, 16px, 24px, 40px, 64px**
  - All layout, padding, and gaps respect this scale only.

- **Interaction**
  - Transitions: 150–200ms, `ease-in-out`
  - No bounce, no parallax, no distracting motion

### Global Layout Structure

Every page is composed using the `AppShell` layout:

1. **Top Bar**
   - Left: app name (`Job Notification App`)
   - Center: progress indicator (`Step X / Y`)
   - Right: status badge (`Not Started` / `In Progress` / `Shipped`)
2. **Context Header**
   - Large serif headline
   - One-line subtext with clear purpose, no hype language
3. **Primary Workspace (70%)**
   - Clean cards, subtle borders, predictable components
   - No heavy shadows, no crowding
4. **Secondary Panel (30%)**
   - Step explanation
   - Copyable prompt box
   - Consistent buttons
5. **Proof Footer**
   - Checklist style:
     - □ UI Built
     - □ Logic Working
     - □ Test Passed
     - □ Deployed

### Components Provided

In `src/components`:

- `AppShell` – enforces the global layout structure
- `Button` – primary (`accent` solid) and secondary (outlined) variants
- `Card` – subtle bordered container, no shadow
- `InputField` – labeled text input with clear focus state
- `StatusBadge` – status pill for the top bar
- `ProgressIndicator` – `Step X / Y`
- `CopyBox` – read-only, copyable block for prompts/instructions
- `ChecklistFooter` – proof footer with the four checklist items
- `EmptyState` – guided empty state with title, description, and next action
- `ErrorState` – clear explanation of what went wrong and how to fix it

### Styling

In `src/styles`:

- `tokens.css` – CSS variables for color, spacing, typography, radius, and motion
- `base.css` – global body styles, typography defaults, layout helpers

### Usage in the MERN Stack

- **Frontend (React)**:
  - Import `tokens.css` and `base.css` once at the root of your React app.
  - Use `AppShell` as the top-level layout for each major page/step.
  - Compose features with the provided primitives (`Card`, `Button`, `InputField`, etc.).
- **Backend (Node/Express)**:
  - No direct coupling; this design system is purely frontend, but it is tuned for SaaS flows you will build on top of your MERN APIs.

This design system is the foundation only. **No product-specific pages, flows, or business logic are implemented yet.**

