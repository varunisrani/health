# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is a React + TypeScript + Vite application built with shadcn/ui components and TailwindCSS. The project is a health/consultant platform called "Mended Minds" with authentication, dashboard, and therapy/consultant features.

### Key Technologies
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: TailwindCSS with custom design system
- **UI Components**: shadcn/ui (Radix-based components)
- **State Management**: React Query for server state, Context for auth
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with Zod validation

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── dashboard/      # Dashboard-specific components
│   └── *.tsx           # Feature components (HeroSection, AuthModal, etc.)
├── pages/              # Route components
│   ├── auth/           # Authentication pages
│   └── *.tsx           # Main pages (Dashboard, Library, Sessions, etc.)
├── context/            # React contexts (AuthContext)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx            # App entry point
```

### Routing Structure
- `/` - Landing page (Index)
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/dashboard` - Main dashboard (protected)
- `/therapists/:id` - Therapist profile (protected)
- `/sessions` - Sessions management (protected)
- `/library` - Consultant library (protected)

### Authentication
- Uses React Context (`AuthContext`) for auth state management
- Protected routes wrapped with `ProtectedRoute` component
- Auth pages handle login/signup flows

### Styling Guidelines
- Custom color palette defined in Tailwind config:
  - `hc-primary`: Medical Navy Blue
  - `hc-secondary`: Soft Gray-Blue
  - `hc-tertiary`: Light Sage Green
  - `hc-surface`: Clean Off-White
  - `hc-accent`: Muted Medical Teal
- Uses Inter and Open Sans fonts
- Custom animations: fade-in, slide-up, hover-lift

### Component Architecture
- All UI components follow shadcn/ui patterns
- Components use TypeScript with proper typing
- Forms use React Hook Form with Zod validation
- Toast notifications via Sonner and shadcn/ui toaster

### Development Notes
- Vite dev server runs on port 8080
- Path aliases: `@/*` maps to `./src/*`
- TypeScript config has relaxed settings (noImplicitAny: false, etc.)
- Uses Lovable tagger in development mode for component tracking