

# PrepTalkAI Frontend Implementation Plan

## 🎨 Theme & Design System
- Update the color scheme to purple/violet primary colors with bold gradients
- Add custom gradient keyframe animations for the hero section
- Set up vibrant accent colors (violet, indigo, fuchsia tones)

## 📄 Pages to Build

### 1. Landing Page (`/`)
- Hero section with animated gradient background, bold headline, and CTA buttons
- Features section with 4 icon cards (AI Interviews, Group Discussions, Analytics, Instant Feedback)
- "How It Works" 3-step visual section
- Testimonials section with student quotes
- Footer with branding and links

### 2. Auth Pages (`/login`, `/signup`)
- Login page with email/password form, purple gradient card design
- Signup page with name, email, password fields
- Link between login ↔ signup
- UI-only, no backend

### 3. Dashboard (`/dashboard`)
- Sidebar layout with navigation (Dashboard, AI Interview, Group Discussion, Settings)
- Welcome banner with greeting
- Quick action cards: Start Interview, Join Discussion
- Stats cards: Sessions completed, average score, practice streak
- Recent sessions table with mock data

### 4. AI Interview Practice (`/interview`)
- Setup screen: choose interview type, difficulty, and topic
- Chat-style interview UI with AI questions and user response area
- Feedback/results panel with score breakdown and improvement tips
- All using mock/static data

### 5. Group Discussion Room (`/discussion`)
- Session browser listing available rooms with topic, participants, and join button
- Discussion room UI with participant avatars, topic header, timer
- Mock participant data and session cards

## 🧭 Navigation & Layout
- Public navbar component for landing/auth pages (logo + Sign In / Sign Up)
- Sidebar layout component for authenticated pages using shadcn Sidebar
- React Router setup for all routes
- Responsive design for mobile and desktop

## 📦 Components to Create
- `Navbar` — public top navigation
- `AppSidebar` — sidebar for dashboard pages
- `DashboardLayout` — layout wrapper with sidebar
- Page components for each route
- Reusable cards for features, stats, sessions, and discussion rooms

