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
- **Photo Proof / Media Attachment**: Drag-and-drop or direct mobile camera photo capture with automated client-side canvas compression (`max 800px`, JPEG 0.75).
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

### 7. Staff Management Portal (`#/staff`)
- PIN-protected authentication (`Demo PIN: 1234`).
- **Student CSAT Metrics**: Live calculation of average student satisfaction rating (e.g. `4.9 ★`).
- **Technician Dispatch Queue**: Inline dropdown to assign specific facility personnel (*Network Lead, AV Specialist, Estate & Plumbing, HVAC & Electrical, Safety Officer*).
- Category breakdown metrics and progress visualization bars.
- One-click CSV export of all campus requests including technician assignment and satisfaction metrics.

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
