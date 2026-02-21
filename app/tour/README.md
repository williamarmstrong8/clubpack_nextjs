# Take a Tour — Guided demo

Guided, interactive walkthrough of ClubPack for prospective users. **Mock data only** — no real APIs or databases.

## File structure

```
app/(marketing)/tour/
├── layout.tsx          # Metadata (title, description)
├── page.tsx            # Tour page: overlay + modal; TourProvider wraps content
├── tour-steps.ts       # Step order, copy, and view type per step
├── mock-data.ts        # Static data for club site, admin dashboard, signup form
├── README.md           # This file
├── context/
│   └── tour-context.tsx    # Step index, goNext/goBack, step metadata
└── components/
    ├── tour-modal.tsx        # Centered card with title, description, Back/Next
    ├── tour-background.tsx   # Renders current view (signup | side-by-side | club-focus | admin-*)
    └── tour-create-club-form.tsx  # Read-only replica of create-club form (club name + subdomain)
```

## UX

- **Single interactive surface**: Only the centered modal (Back / Next, final step “Get started”) is interactive. Background is read-only and non-clickable (overlay + `pointer-events-none` on background).
- **Views**: Signup (create club form) → side-by-side (club site + admin) → club focus (club site zoom) → admin dashboard → admin events → admin members. Each step drives which background view is shown.
- **Components reused**: Club site uses `ClubNavbar`, `ClubFooter`, `HeroSection`, `AboutSection`, `EventsSection`, `FaqsSection`, `JoinSection` from `(club-site)`. Admin uses `AdminShell`, `HomeClient`, `EventsClient`, `MembersClient` from `(admin)`. All are fed from `mock-data.ts`; no server/API calls.

## Data

- `mock-data.ts` defines tour club, events, FAQs, admin stats, recent activity, events list, members list, and the pre-filled signup form values. Types align with `(club-site)/[site]/mock-data` and admin client types.

## Route

- Marketing route: **`/tour`** (under `(marketing)`).
