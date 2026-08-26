# CLAUDE.md — XIRPL v2 Visual Refactor

## 1. Mission

Refactor the visual/UI layer of the XIRPL `feat/v2` web application.

The goal is to make the existing XIRPL application visually feel like the reference website:

`https://young-star-cbk0z.sites.repaint.com/`

while preserving the existing content, functionality, routes, APIs, database, authentication, and application behavior.

### Core principle

> **Keep the content and functionality. Replace and improve the visual presentation.**

Do NOT turn the project into a new landing page or a generic SaaS dashboard.

The result should feel like a friendly, playful, colorful, rounded **class portal**, consistent with the reference website.

---

# 2. Non-Negotiable Constraints

## Preserve

The following must remain functional and should not be unnecessarily modified:

- Existing content
- Existing API contracts
- Existing backend
- Existing database schema
- Existing authentication
- Existing storage
- Existing routes
- Existing business logic
- Existing data fetching
- Existing class-management functionality
- Existing album content
- Existing schedule content
- Existing task content
- Existing streak/check-in functionality

The repository already contains application functionality around class management, check-ins, journals/habits, schedules, albums, authentication, storage, and related backend/database infrastructure.

## Do NOT

- Do not rewrite the backend.
- Do not redesign the database.
- Do not change API contracts just for visual purposes.
- Do not remove existing features from the application.
- Do not invent new business features.
- Do not invent new content.
- Do not add unnecessary pages.
- Do not introduce a dark cyberpunk aesthetic.
- Do not turn the site into a corporate SaaS dashboard.
- Do not add a "Projects" section unless the existing application already contains such content.
- Do not add a "Program" section.
- Do not add an "About" section merely because it appeared in an earlier design proposal.
- Do not add a "Class Overview" section to `/`.
- Do not show a Journal section on `/`.
- Do not replace the existing content with placeholder/demo content.

If a visual improvement can be made without touching application logic, prefer that approach.

---

# 3. Reference Visual Direction

The visual reference is:

`https://young-star-cbk0z.sites.repaint.com/`

The target visual language is:

- Playful
- Friendly
- Rounded
- Bright
- Colorful
- School/class-oriented
- Approachable
- Illustration-friendly
- Large expressive typography
- Soft shadows
- Clear borders
- Pastel accent colors
- Large rounded containers
- Strong visual hierarchy

The website should feel like a polished digital home/class portal.

It should NOT feel like:

- A corporate dashboard
- A banking application
- A cyberpunk interface
- A developer IDE
- A dark SaaS admin panel
- A generic Bootstrap template

---

# 4. Design Relationship With the Mascot

The mascot is an existing React SVG component named:

`XiRplMascot`

Use the provided component as the official XIRPL mascot.

Do NOT generate a replacement mascot.

The mascot already contains:

- XI RPL branding
- Blue body
- Yellow accents
- Navy outlines
- Coding elements
- Laptop
- `</>` symbols
- `>_` style face
- Antenna
- Speech bubble
- RPL badge

The mascot's existing colors should influence the site's accent palette.

Important existing mascot colors include:

- Blue: approximately `#1E88E5`
- Yellow: approximately `#FFC93C`
- Navy: approximately `#0A2540`

The component already supports:

```tsx
<XiRplMascot
  size={...}
  className="..."
/>
```

and should be treated as a reusable visual component.

The mascot source supplied to this task defines `XiRplMascot` as an SVG React component with configurable `size` and `className`. Preserve that component rather than recreating it.

---

# 5. Root Route `/`

The root route is an application homepage/class portal.

It is NOT a marketing landing page.

Do NOT create:

- About
- Program
- Projects
- Class Overview
- Journal section

on `/`.

The root should focus on information useful to the user today.

## Root hierarchy

```text
Header
  ↓
Welcome / identity
  ↓
Today's Schedule
  ↓
Recent Album / Memories
  ↓
Tasks
```

---

# 6. Header

The header must be minimal.

## Left

Only:

```text
[Hamburger] [Logo] XIRPL
```

The hamburger opens the sidebar.

Do not put the complete navigation menu in the header.

## Right

Only:

```text
[Streak] [Profile]
```

Example:

```text
☰  XIRPL                                  🔥 7   👤
```

### Header rules

- Clean
- Bright
- Rounded where appropriate
- Thin/clear border
- Soft shadow if needed
- Not excessively tall
- No large navigation row
- No unnecessary CTA buttons

---

# 7. Sidebar

The hamburger opens a sidebar.

The sidebar should follow the same visual style as the reference:

- Light/bright background
- Rounded menu items
- Soft shadows
- Clear borders
- Pastel active state
- Friendly icons
- Comfortable spacing

Suggested navigation structure:

```text
XIRPL
SMK N 1 KANDEMAN

Home
Album
Jadwal
Tugas

Settings

Profile
```

Do not expose Journal as a primary navigation item unless the existing product requirements explicitly require it.

Do not invent additional navigation items.

On mobile:

- Sidebar should overlay the page.
- Include a backdrop.
- Provide an obvious close action.
- Preserve keyboard accessibility.
- Do not rely on hover.

---

# 8. Root Hero / Welcome Area

The root should retain the friendly class identity of the reference.

Use content that already exists in the application.

The visual composition should resemble:

```text
WELCOME TO

XI RPL
SMK N 1 KANDEMAN

              [XiRplMascot]
```

The mascot should be a prominent illustration.

Do not put the mascot inside a tiny generic card.

## Desktop composition

Prefer:

```text
Text                         Mascot
----------------------       ----------------
WELCOME TO
XI RPL
SMK N 1 KANDEMAN
```

with the mascot visually balancing the text.

## Mobile composition

Stack naturally:

```text
WELCOME TO

XI RPL
SMK N 1 KANDEMAN

Mascot
```

Do not simply shrink the desktop composition until it becomes unusable.

---

# 9. Mascot Usage

The mascot is the main visual anchor.

Use it in the root welcome area.

Suggested sizing:

Desktop:

```tsx
<XiRplMascot
  size={460}
  className="w-full max-w-[460px] h-auto"
/>
```

Mobile:

```tsx
<XiRplMascot
  size={320}
  className="w-full max-w-[320px] h-auto"
/>
```

Adjust sizing based on the actual layout.

Do not distort the SVG.

Use:

- `width: 100%`
- `height: auto`
- appropriate `max-width`

Avoid:

- stretching
- arbitrary cropping
- placing it behind unreadable text
- excessive animation

Subtle idle motion is acceptable if it does not distract from content.

---

# 10. Today's Schedule

The schedule displayed on `/` must represent the schedule for the current day.

Do NOT show a generic weekly schedule on the root if the existing application can provide the current day's schedule.

Recommended presentation:

```text
TODAY'S SCHEDULE

Tuesday, 25 August

07:00   Pemrograman Web
09:00   Basis Data
11:00   Istirahat
13:00   UI/UX
```

Use a timeline or friendly rounded rows.

The current/active class may receive a subtle accent treatment if current-time data is already available.

Do not fabricate schedule data.

Use the existing schedule data source.

## Empty state

If there is no schedule today, show a friendly empty state instead of an empty blank section.

Example:

```text
TODAY'S SCHEDULE

No schedule for today.
```

The mascot may be used as a small supporting illustration.

---

# 11. Album

Album content must remain unchanged.

The reference site uses Album as a prominent memory/photo feature.

Preserve existing album names, images, metadata, and data.

On `/`, show a compact preview of recent/relevant album content.

Example visual:

```text
ALBUM

[ Image ] [ Image ]
MPLS       JUARA

[ Image ] [ Image ]
RANDOM     MAULID

View all →
```

Use:

- rounded image corners
- playful aspect ratios where appropriate
- soft borders
- subtle shadows
- clear labels

Do not replace actual images with placeholders.

Do not invent albums.

---

# 12. Tasks

Tasks remain part of the existing application.

On `/`, show an appropriate preview of existing task data.

Example:

```text
TUGAS

[ Database Assignment ]
[ Web Development ]

View all →
```

The exact task content must come from the existing application.

Do not create fake task names.

The visual style should use:

- rounded rows/cards
- clear title
- useful metadata already present
- status indicators if already available
- pastel accents
- readable typography

---

# 13. Journal

The application may already contain journal/habit functionality.

Do NOT delete or break the functionality.

However:

> **Journal must not be displayed as a section on `/`.**

Do not create:

```text
Jurnal Kebiasaan
```

as part of the root homepage.

Do not create a large journal dashboard on `/`.

If the existing application has a dedicated journal route that must remain functional, preserve it unless the current product requirements explicitly say otherwise.

---

# 14. Class Overview

Do NOT create a `Class Overview` section on `/`.

The root should remain focused on:

- Identity
- Today's schedule
- Album
- Tasks

Streak is already represented in the header.

Profile is already represented in the header.

---

# 15. Streak

Streak belongs in the header.

Use a compact pill:

```text
╭─────────╮
│ 🔥 7    │
╰─────────╯
```

Do not create a giant Streak card on `/`.

The existing streak value must come from the existing application/data source.

Do not hardcode example values.

---

# 16. Profile

Profile belongs on the right side of the header.

Use a compact avatar/profile trigger.

Clicking it can use the existing profile behavior/menu.

Do not invent a new authentication/profile system.

---

# 17. Color System

The site should be bright and friendly.

Start from a light base:

```text
Background:
#FFFDF7

Foreground:
#0A2540

Primary Blue:
#1E88E5

Yellow:
#FFC93C
```

Supporting pastel accents can be used carefully:

```text
Pastel Yellow
#FFE8A3

Pastel Blue
#BFDFFF

Pastel Pink
#FFC9DE

Pastel Green
#C8F2D0

Pastel Purple
#D8CCFF
```

These are directional values.

If the existing design system already has suitable tokens, use/extend the existing token system instead of duplicating values unnecessarily.

## Color rules

- Keep the overall background light.
- Use blue/yellow as identity colors.
- Use pastel colors for section accents.
- Avoid making every section a different saturated color.
- Maintain readable contrast.
- Do not introduce a dark-first theme just for visual novelty.

---

# 18. Shape Language

The reference style relies heavily on rounded shapes.

Use:

- Large rounded containers
- Rounded buttons
- Rounded image frames
- Rounded pills
- Friendly borders

Avoid:

- Sharp enterprise cards everywhere
- Excessive glassmorphism
- Excessive shadows
- Excessive gradients

Suggested visual character:

```text
rounded + bordered + lightly elevated
```

rather than:

```text
flat + sharp + corporate
```

---

# 19. Typography

Typography should be friendly and expressive.

Use the existing project's typography system if already established.

If a new typeface is needed, prioritize a modern rounded/geometric sans-serif.

Technical/metadata text may use a monospace font such as JetBrains Mono where appropriate.

Do not turn the entire interface into monospace.

Suggested hierarchy:

```text
Hero:
large + bold

Section title:
bold

Metadata:
small + compact

Technical labels:
monospace
```

---

# 20. Cards

Avoid making every element a card.

Use cards where grouping provides real value.

Good:

```text
Section
  ├── schedule rows
  ├── album grid
  └── task rows
```

Avoid:

```text
Card
  └── Card
      └── Card
          └── Card
```

Use whitespace, typography, borders, and background changes to establish hierarchy.

---

# 21. Responsive Design

The interface must be designed responsively.

Do not simply scale the desktop version down.

## Desktop

```text
Header
Hero: text + mascot
Today's schedule
Album
Tasks
```

## Mobile

```text
Header
Welcome
Mascot
Today's schedule
Album
Tasks
```

The header remains compact.

The sidebar becomes an overlay drawer.

Touch targets should be approximately 44px or larger.

Do not introduce horizontal page scrolling.

---

# 22. Animation

Animation should be subtle and friendly.

Allowed:

- Small hero entrance animation
- Mascot idle movement
- Button hover
- Card hover
- Schedule current-state transition
- Image entrance
- Sidebar slide-in
- Backdrop fade

Avoid:

- Excessive bouncing
- Continuous distracting animation
- Large parallax effects
- Animation on every element

Respect:

```css
prefers-reduced-motion
```

When reduced motion is enabled, provide a useful static experience.

---

# 23. Component Architecture

Prefer reusing existing components.

If the current application already contains components for:

- Header
- Sidebar
- Schedule
- Album
- Tasks
- Profile
- Streak

refactor those components instead of creating duplicate implementations.

Possible visual organization:

```text
components/
├── layout/
│   ├── Header
│   ├── Sidebar
│   └── PageContainer
│
├── mascot/
│   └── XiRplMascot
│
├── schedule/
│   └── TodaySchedule
│
├── album/
│   └── AlbumPreview
│
├── tasks/
│   └── TaskPreview
│
└── ui/
```

These are conceptual names.

Follow the repository's existing organization where practical.

---

# 24. Existing Stack

The project already uses a modern TypeScript/React web stack.

Do not introduce a competing framework.

Prefer the existing project stack and conventions.

In particular:

- React
- Next.js
- Tailwind CSS
- Existing UI component system
- Existing API
- Existing database layer

Use existing `shadcn/ui` components where they fit.

Do not replace the entire UI component library solely for styling.

---

# 25. Data Integrity

Visual refactoring must not break data.

Before changing a component:

1. Identify its current data source.
2. Preserve the existing query/API.
3. Preserve props and data transformations where possible.
4. Change presentation only.
5. Test empty states.
6. Test loading states.
7. Test error states.

Do not replace real data with static examples.

---

# 26. Empty / Loading / Error States

Every major content section should have appropriate states.

## Loading

Use a skeleton consistent with the rounded visual style.

## Empty

Use friendly copy and optional mascot support.

## Error

Use clear, non-technical user-facing messaging.

Do not expose raw stack traces or API errors in the UI.

---

# 27. Accessibility

Preserve accessibility.

Requirements:

- Semantic HTML
- Accessible buttons
- Keyboard navigation
- Visible focus states
- Meaningful `aria-label`s
- Correct image alt text
- Sufficient contrast
- No hover-only interactions
- Sidebar keyboard accessibility
- Escape closes the sidebar where appropriate

The mascot already provides:

```html
role="img"
aria-label="Maskot robot XI RPL"
```

Do not remove meaningful accessibility attributes from the mascot.

---

# 28. Implementation Priority

Implement in this order:

## Phase 1 — Global visual system

- Colors
- Typography
- Border radius
- Shadows
- Spacing
- Button styles
- Surface styles

## Phase 2 — Header

- Hamburger
- XIRPL logo/name
- Streak
- Profile

## Phase 3 — Sidebar

- Navigation
- Mobile drawer
- Overlay
- Active states

## Phase 4 — Root hero

- Existing XIRPL identity content
- XiRplMascot
- Responsive composition

## Phase 5 — Today's Schedule

- Current-day data
- Timeline/list presentation
- Current state
- Empty state

## Phase 6 — Album

- Existing data
- Image grid
- Rounded visual treatment
- Preview behavior

## Phase 7 — Tasks

- Existing data
- Preview
- Status presentation

## Phase 8 — Responsive polish

- Mobile
- Tablet
- Desktop
- Accessibility
- Reduced motion

## Phase 9 — Regression testing

Verify:

- Authentication
- Navigation
- API requests
- Album
- Schedule
- Tasks
- Streak
- Profile
- Existing journal functionality
- Existing routes
- Existing backend functionality

---

# 29. Definition of Done

The refactor is complete when:

- `/` visually resembles the reference site's playful/rounded style.
- Header only contains hamburger + XIRPL identity on the left.
- Streak and profile are on the right.
- Hamburger opens the sidebar.
- `/` does not contain a Journal section.
- `/` does not contain a Class Overview section.
- `/` prominently shows today's schedule.
- Album content remains unchanged.
- Task content remains unchanged.
- Existing functionality continues to work.
- Existing API contracts remain intact.
- Existing database remains intact.
- Existing authentication remains intact.
- The supplied `XiRplMascot` component is used as the main mascot.
- Mascot is responsive and not distorted.
- Mobile layout is intentionally designed rather than simply scaled down.
- No unnecessary new features/content are introduced.
- No cyberpunk/dark-SaaS redesign is introduced.
- The visual language is consistent across pages.

---

# 30. Important Agent Behavior

Before modifying code:

1. Inspect the existing implementation.
2. Identify existing routes/components/data sources.
3. Reuse existing functionality.
4. Make the smallest architectural change necessary.
5. Prefer visual/component refactoring over business-logic changes.

When unsure whether something is content or visual behavior:

> Preserve the existing content and behavior.

When unsure whether a new feature should be added:

> Do not add it.

When the reference design and existing application conflict:

> Preserve the application's existing content/functionality and adapt the reference's visual language to it.

The final product should feel like:

**"The existing XIRPL class portal redesigned in the visual style of the Repaint reference."**

It should NOT feel like:

**"A completely new website inspired by the reference."**
