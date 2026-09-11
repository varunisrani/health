# Mended Minds

Mended Minds is a browser-based mental-wellness platform prototype for exploring therapists, sessions, mood tracking, and guided self-care content.

## Core features

- Landing, login, signup, and protected dashboard routes.
- Therapist discovery and profile views.
- Session booking, history, webinar, and live-session interfaces.
- Mood entries, history, insights, and export controls.
- Guided meditation, breathing, music, sound, and video content browsing.
- Subscription, trial, notification, consent, privacy, audit, and data-request demonstrations.
- WebRTC-based video-call UI with simulated signalling.
- Responsive components built from Radix UI primitives.

## Technology stack

- React 18 and TypeScript
- Vite 5 with the React SWC plugin
- React Router 6 and TanStack Query
- Tailwind CSS, Radix UI, and shadcn-style components
- Recharts, React Hook Form, Zod, and date-fns
- Browser WebRTC, Web Crypto, `localStorage`, jsPDF, and html2canvas

## Prerequisites

- Node.js compatible with the locked dependencies
- npm

## Local setup

```bash
git clone https://github.com/varunisrani/health.git
cd health
npm ci
npm run dev
```

Build and inspect the production bundle with:

```bash
npm run build
npm run preview
```

Other verified scripts are `npm run build:dev` and `npm run lint`.

## Configuration

No environment variables are referenced by the current source. Prototype data and user state are stored in browser `localStorage`.

## Project structure

- `src/pages/` — landing, authentication, dashboard, therapist, session, and library pages
- `src/components/` — wellness features and reusable UI components
- `src/context/` — authentication, sessions, mood, privacy, subscription, and content state
- `src/hooks/` — mood, session, encryption, and WebRTC hooks
- `src/services/` — mock subscription, audit, and encryption services
- `src/types/` — application domain types

## Status and limitations

This is a front-end demonstration, not a production healthcare, teletherapy, billing, privacy-compliance, or emergency-support system. Authentication, subscriptions, payments, audit records, and most domain data are mocked in the browser. WebRTC signalling is simulated rather than backed by a signalling server, and some referenced local media assets may not be present. Do not use the prototype to store real health or payment information.
