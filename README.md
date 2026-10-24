# Unidesk | Campus Helpdesk Web Application

A state-of-the-art campus issue reporting, tracking, and facilities resolution platform built with a modern **ZEN Agency** design aesthetic, ambient radial glow, dynamic capability pill marquees, Venetian shutter transitions, glassmorphic UI, and instant client-side persistence.

🔗 **Repository**: [https://github.com/dsawithaditya/Unidesk.git](https://github.com/dsawithaditya/Unidesk.git)

---

## 🎨 Design & Aesthetic System
- **Theme**: Inspired by modern WebGL/Agency dark glass styling (ZEN theme)
- **Primary Accent**: Neon Lime (`#a3ff12`)
- **Dark Canvas**: Deep Obsidian (`#080a07`) with ambient radial lime lighting and subtle `56px` engineering grid
- **Card Surfaces**: Ultra-refined backdrop-blur glassmorphism (`rgba(16, 22, 14, 0.72)`) with neon lime glowing borders on hover
- **Typography**: Google Font **Outfit** with monospaced terminal accents (`// UNIDESK OPERATIONS`)
- **Brand Assets**: Custom transparent Unidesk brand logo, header mark (`logo-white.png`), and squircle favicon (`logo-icon.png`)

---

## ✨ Key Features & Pages

1. **Home (`#/`)**:
   - Dynamic Hero with floating interactive ribbons reacting to cursor coordinates
   - Real-time resolution statistics counters (Total, Open, In Progress, Resolved)
   - Continuous multi-lane infinite capability pill marquees
   - Interactive scroll-linked Venetian shutter transition with depth blur scrubbing
   - Curated category exploration cards and recent request highlights

2. **Report Issue (`#/report`)**:
   - Category selector with icon badges (IT & Wi-Fi, Facilities, Hostel & Mess, Classroom AV, Safety, Other)
   - Urgency priority selector with neon lime focus rings
   - Real-time client-side validation with character counters
   - Glassmorphism confirmation card displaying the generated ticket reference ID

3. **Track Requests (`#/requests`)**:
   - Full-text search by title, ticket ID, location, or student contact
   - Instant filtering by status (All, Open, In Progress, Resolved) with animated tab pills
   - Sorting options by newest first, most affected (+1 upvotes), or highest priority
   - One-click "+ Demo Data" generator for quick testing

4. **Ticket Detail & Resolution Timeline (`#/ticket/:id`)**:
   - Three-stage status progression stepper (Open → In Progress → Resolved)
   - Complete audit activity timeline with glowing lime pulse nodes
   - Student "+1 Affected" upvote button to signal campus-wide impact
   - Staff action panel to update statuses and publish resolution notes

5. **Knowledge Base (`#/help`)**:
   - Categorized FAQ accordions with smooth chevron transitions for fast self-service

6. **Directory & Emergency (`#/directory`)**:
   - High-visibility emergency numbers card with alert indicator
   - Department contact directory cards with one-click direct phone dialers

7. **Staff Management Portal (`#/staff`)**:
   - PIN-protected authentication (`Demo PIN: 1234`)
   - Category breakdown metrics and progress visualization bars
   - Live queue management with inline status dispatch dropdowns
   - One-click CSV export of all campus requests

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
