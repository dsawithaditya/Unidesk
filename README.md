# Unidesk | Next-Gen Campus Operations & Helpdesk Web Application

A state-of-the-art campus issue reporting, tracking, and facilities resolution platform built with a modern **ZEN Agency** design aesthetic, ambient radial glow, dynamic capability pill marquees, smooth scrollytelling word illumination, glassmorphic UI, and instant client-side persistence.

🔗 **Repository**: [https://github.com/dsawithaditya/Unidesk.git](https://github.com/dsawithaditya/Unidesk.git)

---

## 🎨 Design & Aesthetic System
- **Theme**: Inspired by modern WebGL/Agency dark glass styling (ZEN theme)
- **Primary Accent**: Neon Lime (`#a3ff12`)
- **Dark Canvas**: Deep Obsidian (`#080a07`) with ambient radial lime lighting and subtle `56px` engineering grid
- **Card Surfaces**: Ultra-refined backdrop-blur glassmorphism (`rgba(16, 22, 14, 0.72)`) with neon lime glowing borders on hover
- **Typography**: Google Font **Outfit** with monospaced terminal accents (`// UNIDESK OPERATIONS`)
- **Micro-Interactions**: Web Audio API tactile feedback tones, canvas confetti celebration bursts, and keyboard shortcuts (`/` for search, `N` for new report)
- **Brand Assets**: Custom transparent Unidesk brand logo, header mark (`logo-white.svg`), and squircle favicon (`logo-icon.svg`)

---

## ✨ Key Features & Capabilities

### 1. Home (`#/`)
- Dynamic Hero with floating interactive ribbons reacting to cursor coordinates
- Real-time resolution statistics counters (Total, Open, In Progress, Resolved)
- Large-scale cinematic typography and 72px pill wall with optical defocus-to-focus scrollytelling and frosted glass blur transition curtain
- Curated category exploration cards and recent request highlights

### 2. Report Issue (`#/report`)
- **Smart Duplicate Prevention**: Real-time detection alerts students if a similar ticket is already active nearby, letting them upvote instead of creating duplicates.
- **Photo Proof / Media Attachment**: Drag-and-drop or direct mobile camera photo capture with automated client-side canvas compression (`max 640px`, JPEG 0.65) and asynchronous IndexedDB storage.
- Category selector with icon badges (IT & Wi-Fi, Facilities, Hostel & Mess, Classroom AV, Safety, Other).
- Urgency priority selector with neon lime focus rings and designated department routing.
- Real-time client-side validation with character counters and glass confirmation screen.

### 3. Track Requests & Campus Health Matrix (`#/requests`)
- **Campus Facility Status Matrix**: Interactive building matrix (*Central Library, Science & Aryabhatta, Tech Building & AI Lab, Hostel Blocks, Auditorium, Campus Perimeter*) showing live health indicators (🟢 Normal, 🟡 In Progress, 🔴 Urgent) with one-click filtering.
- **Live SLA Timers**: Target resolution countdowns (Urgent: 2h, High: 8h, Medium: 24h, Low: 48h) with visual warning and breach states.
- Full-text instant search by title, ticket ID, location, department, or student contact.
- Instant filtering by status (All, Open, In Progress, Resolved) with animated tab pills.
- Sorting options by newest first, most affected (+1 upvotes), or highest priority.

### 4. Ticket Detail & Clarification Hub (`#/ticket/:id`)
- **High-Res Photo Attachment Lightbox**: Click-to-enlarge full-screen modal zoom.
- **Three-Stage Progression Stepper**: Open → In Progress → Resolved with glowing pulse nodes.
- **Direct Discussion & Updates Thread**: Two-way interactive conversation between students and staff for follow-up details and questions.
- **CSAT Resolution Feedback (5-Star Rating)**: When a ticket is marked *Resolved*, students can rate the turnaround and select feedback tags (*"Fast turnaround", "High quality fix", "Clear updates", "Cleaned area"*).
- Student "+1 Affected" upvote button to signal campus-wide impact.
- Staff action panel to assign lead technicians, update progression status, and publish resolution notes.

### 5. Knowledge Base (`#/help`)
- Categorized FAQ accordions with smooth chevron transitions for fast self-service.

### 6. Directory & Emergency (`#/directory`)
- High-visibility emergency numbers card with alert indicator.
- Department contact directory cards with one-click direct phone dialers.

### 7. Campus Identity & Login (`#/login`)
- **Google Authentication & OAuth**:
  - Direct **"Continue with Google"** and **"Sign up with Google"** buttons with official Google SVG branding.
  - Linked directly to Supabase Auth OAuth (`signInWithOAuth({ provider: 'google' })`).
  - Automatic session detection and profile sync (`name`, `email`, Google avatar picture).
  - Built-in **Backend Setup Guide Modal** with 1-click copy of the project's Authorized Callback URL.
  - 1-click **Campus Google Demo** mode so reviewers and testing can proceed seamlessly.
- **Dual Authentication Modes**:
  - **Live Supabase Auth**: Secure cloud login and registration via Supabase (`signInWithPassword` & `signUp`).
  - **Local Sandbox Auth**: Offline-first instant demo mode with automatic fallback when running without cloud credentials.
- **Role Switching**:
  - **Student Portal**: Access reported issues, track resolutions, and request maintenance.
  - **Campus Staff & Operations**: Authenticates directly with the Staff Portal, bypassing manual PIN entry.
- **1-Click Instant Demo Login**:
  - `Demo Student` (Rohan Verma — Aryabhatta Hostel)
  - `Demo Staff Lead` (Rajesh Kumar — Senior IT Lead)
- **User Profile Dashboard**:
  - Displays user profile picture (from Google) or styled initials, "Google Verified" badge, role badge, email, campus department, reported ticket statistics, and quick navigation.
  - Dynamic header navigation slot displaying current user state, avatar thumbnail, and one-click logout.

### 8. Staff Management Portal (`#/staff`)
- Secure authentication with salted SHA-256 validation, cryptographic session tokens, and brute-force lockout protection (`Demo PIN: 1234`).
- **Student CSAT Metrics**: Live calculation of average student satisfaction rating (e.g. `4.9 ★`).
- **Technician Dispatch Queue**: Inline dropdown to assign specific facility personnel (*Network Lead, AV Specialist, Estate & Plumbing, HVAC & Electrical, Safety Officer*).
- Category breakdown metrics and progress visualization bars.
- One-click CSV export of all campus requests including technician assignment and satisfaction metrics.

---

## 🗄️ Supabase Cloud Backend Integration

Unidesk features plug-and-play **Supabase** cloud database and authentication integration:

- **Client SDK**: Powered by `@supabase/supabase-js@2.48.1`.
- **Live Cloud Sync**: Automatically synchronizes new tickets, upvotes, status transitions, technician assignments, and discussion comments with the remote `public.tickets` table.
- **Google OAuth Authentication**:
  - Live OAuth 2.0 flow integrated via `supabase.auth.signInWithOAuth({ provider: 'google' })`.
  - **Authorized Redirect URI**:
    ```text
    https://xfvpoqfzcsvxfnhrfilf.supabase.co/auth/v1/callback
    ```
  - Configurable via Supabase Dashboard &rarr; **Authentication** &rarr; **Providers** &rarr; **Google**.
- **1-Click SQL Schema Setup**: Remote `public.tickets` schema with Row Level Security:

```sql
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  department TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  location TEXT NOT NULL,
  contact_name TEXT,
  description TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now(),
  timeline JSONB DEFAULT '[]'::jsonb,
  assignee TEXT DEFAULT 'Unassigned',
  comments JSONB DEFAULT '[]'::jsonb,
  rating INTEGER,
  feedback JSONB,
  image TEXT
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access for tickets" ON public.tickets;
CREATE POLICY "Public access for tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);
```

---

## ⚡ Production Optimizations & Hardening

Based on the [Technical Audit & Performance Blueprint](Unidesk_Website_Optimization_Audit.pdf), the application includes the following production-grade upgrades:

1. **Purged CSS & Static Assets**: Replaced the 3.5MB runtime Tailwind Play CDN compiler and 1,180 lines of inline styles with a compiled, minified `< 35KB` static stylesheet (`style.css`), saving 99% bandwidth and eliminating DOM compilation jank.
2. **AudioContext Singleton**: Replaced per-click Web Audio contexts with a lazily initialized persistent singleton with auto-resume, preventing audio muting/crashes in modern browsers.
3. **Asynchronous IndexedDB Storage**: Replaced blocking 5MB LocalStorage quota limits with asynchronous IndexedDB (`UnideskDB`), accommodating high-resolution photo proofs with graceful degradation and defensive quota error handling.
4. **Targeted DOM Updates**: State actions (upvotes, discussions, CSAT ratings, assignments) perform in-place component updates rather than full-page DOM teardowns, preserving scroll positions, inputs, and focus.
5. **Event Delegation & CSP Compliance**: Eliminated inline `onclick` handlers, passing data via `data-action` attributes to prevent XSS injection and enable strict Content Security Policies.
6. **Accessibility (WCAG 2.1 AA)**: Upgraded contrast tokens to `> 4.5:1`, bound form errors via `aria-describedby` and `role="alert"`, debounced duplicate ticket matching (250ms), and trapped focus within image lightbox dialogs with Escape dismissal.
7. **PWA & Offline First**: Added `manifest.json` and a Cache-First / Stale-While-Revalidate Service Worker (`sw.js`) for full home screen installation and 100% offline access.

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>/</kbd> | Instant focus to global search on Track page |
| <kbd>N</kbd> | Navigate to Report an Issue page |
| <kbd>Esc</kbd> | Dismiss photo lightbox modal |

---

## 🚀 Running Locally

Unidesk requires no complex build step. You can run it immediately with any static server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js npx serve
npx -y serve .
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.
