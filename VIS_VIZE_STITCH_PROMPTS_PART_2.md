# VİS VİZE — Stitch UI/UX Prompts, Part 2

**Brand:** VİS VİZE RANDEVU HİZMETLERİ  
**Scope:** Screens 21–38  
**Primary canvas:** Desktop 1440px  
**Responsive targets:** 1280px, 1024px, 768px, and mobile 390px  
**Purpose:** Complete the public legal template and the full administration platform.

---

## Shared Design System for Screens 21–38

Use these rules consistently unless an individual screen explicitly overrides them.

### Brand Tokens

- Brand Navy: `#0C2448`
- Deep Navy: `#071A35`
- Brand Gold: `#B88522`
- Gold Hover: `#9D7018`
- Soft Champagne: `#E0C99A`
- Warm Gold Surface: `#F7F0E2`
- Admin Background: `#F5F7FA`
- Public Background: `#F7F9FC`
- White: `#FFFFFF`
- Primary Text: `#10213D`
- Secondary Text: `#59677A`
- Muted Text: `#7A8797`
- Border: `#D9E0EA`
- Light Border: `#E8EDF3`
- Success: `#16845B`
- Warning: `#C77912`
- Error: `#C63D45`
- Info: `#2F6FBB`
- Critical: `#9F1239`

Use **Manrope** for headings, buttons, navigation, tabs, badges, and important UI labels. Use **Inter** for body copy, descriptions, helper text, metadata, dates, and long-form content.

### Public Legal and Trust Rule

VİS VİZE is a private consultancy. Never imply that it is a government institution, embassy, consulate, or official visa application center. Never promise guaranteed visa approval, appointment, processing time, document acceptance, unsupported success rates, or official affiliation.

Use this statement where relevant:

> VİS VİZE özel bir danışmanlık hizmetidir. Konsolosluk, büyükelçilik, resmî vize başvuru merkezi veya devlet kurumu değildir. Nihai vize kararları ilgili resmî makamlar tarafından verilir.

### Shared Admin Shell

All admin screens must use:

- Deep-navy left sidebar
- White sticky top header
- Uploaded VİS VİZE logo
- Global admin search
- Notification center
- User profile menu
- Role-aware navigation
- Secure logout
- Breadcrumbs
- Clear page title
- Permission-aware actions
- Loading, empty, error, offline, and restricted states
- Server-side authorization
- Audit logging
- `noindex` and `nofollow`

### Shared Workflow

Use separate **workflow status** and **public status** wherever content can be published.

Workflow states:

1. Draft
2. Editing
3. Ready for Review
4. In Review
5. Changes Requested
6. Approved
7. Scheduled
8. Published
9. Needs Update
10. Archived

For published content, editing must create a new draft version. Never edit the live version directly.

### Shared Security Rules

- Use server-side authentication and authorization.
- Never rely on hidden buttons as security.
- Use field-level and record-level permissions.
- Protect sensitive values with masking.
- Require reauthentication for high-risk actions.
- Do not expose secrets, tokens, session IDs, API keys, or private credentials.
- Prevent insecure direct object references.
- Use CSRF-safe write operations.
- Sanitize rich content.
- Validate URLs and file uploads.
- Record immutable audit events.
- Keep previews secure, expiring, and non-indexable.
- Never allow preview or test forms to create production leads.

### Shared Responsive Rules

At mobile 390px:

- Replace sidebar with drawer.
- Use 16px horizontal padding.
- Stack headers and actions.
- Use cards instead of wide tables.
- Open advanced filters in a full-height bottom sheet.
- Use full-screen editors and previews.
- Keep primary actions accessible.
- Respect safe-area insets.
- Avoid horizontal overflow.
- Do not show public floating WhatsApp inside admin screens.

---

## Screen Index

21. Legal Page Template  
22. Admin Login  
23. Admin Dashboard  
24. Leads List  
25. Lead Detail  
26. Lead Pipeline  
27. Country CMS  
28. Country Landing Page Editor  
29. Service CMS  
30. Blog CMS  
31. FAQ CMS  
32. Form Builder  
33. Homepage Editor  
34. Navigation and Footer  
35. Tracking Settings  
36. General Site Settings  
37. Users and Roles  
38. Audit Log

---

# Screen 21 — Legal Page Template

**Recommended route:** `/[legal-slug]`

## Screen Objective

Design a reusable responsive public legal-page template for all required legal and policy documents. The page must be readable, trustworthy, easy to navigate, legally neutral, and fully CMS-managed.

## Required Layout and Content

### Public Header and Breadcrumb

Use the standard public header. Show a compact breadcrumb such as “Ana Sayfa / Yasal / Gizlilik Politikası”. Keep conversion controls secondary on legal pages.

### Legal Hero

Include document category, H1, short explanation, effective date, last meaningful update, legal owner, and optional print/download actions. Do not imply legal advice.

### Table of Contents

Create a sticky desktop table of contents and mobile accordion or drawer. Generate anchors from H2 and H3 headings and highlight the active section.

### Legal Content Body

Use a centered readable column with structured headings, paragraphs, lists, tables, definition callouts, contact blocks, and internal legal links. Support long documents without visual fatigue.

### Version and Update Notice

Show current version, effective date, previous-version access where appropriate, and a concise change summary. Do not silently overwrite accepted historical consent versions.

### Contact and Rights Section

Provide the correct legal contact source from General Settings, optional data-subject request instructions, related forms, and required company information.

### SEO, Print, and Mobile

Support page-specific SEO, canonical URL, robots settings, accessible print stylesheet, and a single-column mobile reading layout with collapsible contents.

## Required Reusable Components

- Public legal header
- Breadcrumb
- Legal hero
- Sticky table of contents
- Structured legal content renderer
- Version notice
- Legal contact block
- Related legal links
- Print action
- Mobile contents drawer

## Required Interaction and System States

- Default
- Long document
- Active contents item
- Previous version available
- Unpublished
- Missing effective date
- Print view
- Mobile contents
- Loading
- Not found

## Data Model and API Expectations

Legal-page records should contain stable ID, legal type, title, slug, summary, structured sections, effective date, meaningful update date, version, legal owner, reviewer, related legal pages, contact source, SEO metadata, public status, draft version, published version, and version history.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Legal Page Template** without becoming a generic template or unsafe no-code interface.


# Screen 22 — Admin Login

**Recommended route:** `/admin/giris`

## Screen Objective

Design a secure, premium admin-login experience for authorized VİS VİZE staff. It must support password login, MFA, password reset, invitation acceptance, session-expired messages, and security warnings.

## Required Layout and Content

### Desktop Layout

Use a two-panel layout. Left: restrained brand panel with logo, secure-system message, and abstract route illustration. Right: focused login card.

### Login Card

Fields: business email and password. Include show-password control, remember-me only if policy allows, “Şifremi Unuttum”, and “Güvenli Giriş Yap”.

### Security Messaging

Show “Yalnızca yetkili kullanıcılar içindir”, secure connection indicator, support link, and a notice that activity may be audited.

### MFA Flow

Support authenticator code, security key or passkey, backup code, recovery path, rate limiting, and expiration states.

### Invitation and Reset

Allow invitation acceptance, password creation, policy acceptance, MFA setup, password-reset request, expiring token, invalid-token state, and completion.

### Error States

Support invalid credentials, too many attempts, suspended account, expired invitation, MFA required, session expired, maintenance, and offline using safe generic messages.

## Required Reusable Components

- Admin login shell
- Brand panel
- Login card
- Password field
- MFA challenge
- Passkey action
- Invitation flow
- Password reset flow
- Security notice
- Session-expired banner

## Required Interaction and System States

- Default
- Invalid credentials
- Rate limited
- Suspended
- MFA challenge
- MFA failed
- Invitation accepted
- Invitation expired
- Password reset sent
- Session expired
- Offline
- Mobile

## Data Model and API Expectations

Authentication records should support user ID, email, account state, invitation state, MFA policy, allowed methods, failed-attempt count, lockout time, session policy, and security-event references. Use secure server-side sessions and single-use expiring tokens.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Admin Login** without becoming a generic template or unsafe no-code interface.


# Screen 23 — Admin Dashboard

**Recommended route:** `/admin`

## Screen Objective

Design the main operational dashboard for authorized staff. Summarize leads, follow-ups, pipeline movement, content review tasks, form health, publication work, system warnings, and the current user’s responsibilities without exposing more data than the role permits.

## Required Layout and Content

### Dashboard Header

Show greeting, date, role, selected date range, refresh, quick-create, and role-aware actions.

### Operational Metrics

Cards may include new leads, awaiting response, overdue follow-ups, appointments, unassigned, content reviews, form errors, and system warnings. Use real values only.

### My Work

Show assigned leads, due follow-ups, review tasks, scheduled publications, unresolved comments, and security actions requiring the current user.

### Lead Snapshot

Compact recent-leads table with reference, applicant, country, service, status, assignee, next action, and time. Mask contact data.

### Pipeline Overview

Use a restrained stage summary or compact funnel with actionable links.

### Content, Forms, and System Health

Show drafts awaiting review, stale content, broken relationships, active forms, routing issues, consent issues, and maintenance state.

### Activity and Customization

Show role-filtered recent activity and allow safe widget layout preferences. Mandatory security warnings cannot be hidden.

## Required Reusable Components

- Dashboard shell
- Metric card
- My-work queue
- Recent leads table
- Pipeline summary
- Content review card
- Form-health card
- System alert
- Recent activity feed
- Widget manager

## Required Interaction and System States

- Default
- No assigned work
- Critical warning
- Partial widget error
- Loading widget
- Permission-restricted widget
- Custom layout
- Mobile stacked dashboard

## Data Model and API Expectations

Dashboard APIs should return role-filtered aggregates, not unrestricted raw datasets. Support date range, team scope, country scope, service scope, cached aggregates, widget preferences, and deep links. Never leak inaccessible counts.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Admin Dashboard** without becoming a generic template or unsafe no-code interface.


# Screen 24 — Leads List

**Recommended route:** `/admin/leads`

## Screen Objective

Design a dense but readable lead-management list for visa enquiries and appointment requests. It must help staff search, filter, assign, prioritize, review, export, archive, and safely open leads while protecting personal information.

## Required Layout and Content

### Header and Metrics

Show totals for new, unassigned, due today, overdue, high priority, appointment requests, closed, and archived.

### Search and Filters

Search by reference, applicant, masked phone/email, country, service, source, campaign, assignee, and note keywords according to permission. Filter status, pipeline, stage, country, service, priority, source, team, follow-up, date, duplicate, consent, and archive.

### Lead Table

Columns: selection, reference/applicant, country/service, source, status/stage, priority, assignee/team, next follow-up, last activity, created, actions.

### Data Masking

Show masked phone and email by default. Full reveal requires permission, reason where configured, and audit logging.

### Bulk Actions

Assign, move stage, change priority, schedule follow-up, add tag, export permitted fields, archive, and mark duplicate.

### Saved Views and Risk

Provide saved views and indicators for duplicates, invalid contact, consent issues, suspicious activity, and overdue work.

### Import and Export

Use permission-aware, masked, asynchronous, expiring, audited exports and validated reviewable imports.

## Required Reusable Components

- Lead metrics
- Lead search
- Advanced filters
- Saved views
- Lead table
- Masked contact cell
- Priority badge
- Assignee selector
- Bulk action bar
- Export wizard
- Duplicate indicator
- Pagination

## Required Interaction and System States

- Default
- Filtered
- Selected rows
- Bulk active
- Sensitive reveal
- Duplicate suspected
- Overdue
- No results
- Loading
- Partial error
- Restricted
- Mobile cards

## Data Model and API Expectations

Lead list payloads should contain only summary fields: lead ID, reference, masked identity, country, service, source, campaign, status, stage, priority, assignee, team, follow-up, last activity, created date, and flags.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Leads List** without becoming a generic template or unsafe no-code interface.


# Screen 25 — Lead Detail

**Recommended route:** `/admin/leads/[leadId]`

## Screen Objective

Design a complete lead-detail workspace that gives authorized staff a safe 360-degree view of one enquiry, including applicant information, journey, assignments, follow-ups, notes, consent, files, communications, timeline, and related records.

## Required Layout and Content

### Lead Header

Show reference, applicant display name, country, service, status, stage, priority, assignee, team, duplicate warning, created time, and next follow-up.

### Applicant Information

Show masked contact data, preferred contact, language, applicant status, purpose, travel dates, previous rejection summary, and applicant count. Separate submitted and staff-entered data.

### Lead Journey

Show source, landing page, campaign, form/version, submitted time, consent version, thank-you behavior, and routing result.

### Pipeline and Follow-ups

Controlled status/stage transitions with reason, follow-up manager, reminders, outcome, owner, and overdue state.

### Notes, Files, Communications

Internal notes with mentions and edit history; private scanned files; approved email/call/WhatsApp history with delivery state.

### Consent and Privacy

Consent type, version, accepted time, source, withdrawal, retention, and lawful operational communication state.

### Timeline and Related Records

Immutable chronological activity timeline, duplicates, linked leads, merges, appointments, and service records according to access.

## Required Reusable Components

- Lead detail header
- Masked identity panel
- Reveal dialog
- Status selector
- Pipeline selector
- Assignment panel
- Follow-up manager
- Notes editor
- File manager
- Communication timeline
- Consent panel
- Related records
- Activity timeline

## Required Interaction and System States

- Default
- Reveal approved
- Reveal denied
- Status changed
- Stage changed
- Overdue
- Duplicate warning
- File blocked
- Consent withdrawn
- Archived
- Concurrent edit
- Mobile

## Data Model and API Expectations

Lead detail data should include stable lead ID, reference, submitted and normalized values, masked contact fields, country, service, visa type, status, stage, priority, assignments, tasks, notes, files, communications, consent, attribution, related records, retention state, and audit references.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Lead Detail** without becoming a generic template or unsafe no-code interface.


# Screen 26 — Lead Pipeline

**Recommended route:** `/admin/pipeline`

## Screen Objective

Design a visual yet operational pipeline board for managing visa-service leads through configured stages. Support drag-and-drop with keyboard alternatives, stage capacity, assignments, due follow-ups, bulk actions, filters, and safe transition validation.

## Required Layout and Content

### Header and Selector

Show selected pipeline, date range, team, country/service scope, totals, unassigned, overdue, and refresh state.

### Kanban Columns

Each stage shows name, count, rules, capacity warning, and cards. Example stages: New, Contacted, Initial Review, Information Requested, Consultation, Waiting, Completed, Lost.

### Lead Card

Reference, masked applicant, country, service, priority, assignee, source, next follow-up, age in stage, and warning flags.

### Transitions

Validate destination, permission, required fields, reason, ownership, terminal rules, and side effects. Provide keyboard move actions and confirmation dialogs.

### Filters and Bulk Actions

Filter by country, service, source, priority, assignee, team, age, follow-up, duplicate, and campaign. Support safe bulk moves.

### Stage Settings and List View

Authorized link to stage configuration and an accessible table alternative.

## Required Reusable Components

- Pipeline selector
- Pipeline metrics
- Kanban board
- Stage column
- Lead card
- Drag handle
- Keyboard move menu
- Transition dialog
- Filter drawer
- Bulk action bar
- List view

## Required Interaction and System States

- Default
- Dragging
- Invalid transition
- Confirmation
- Capacity warning
- Overdue card
- Empty stage
- Filtered
- Loading
- Partial error
- Mobile board
- List view

## Data Model and API Expectations

Pipeline data should include pipeline ID, stage definitions, ordered stages, transition rules, role permissions, lead summaries, stage entry time, assignments, follow-up, priority, and flags. Moves must be transactional and audited.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Lead Pipeline** without becoming a generic template or unsafe no-code interface.


# Screen 27 — Country CMS

**Recommended route:** `/admin/ulkeler`

## Screen Objective

Design the central country-management CMS for creating, organizing, reviewing, publishing, and monitoring visa destination records.

## Required Layout and Content

### Country Summary

Show total, published, draft, review, update required, unsupported, temporarily unavailable, and archived.

### Search, Filters, and Table

Search country, slug, region, code, visa type, form, and page status. Table: country, region, support, public status, visa types, appointment state, form, health, SEO, owner, update, actions.

### Identity and Support Status

Use flag plus text, public Turkish name, English/internal name, ISO code, slug, region, and statuses: supported, limited, information-only, unavailable, unsupported, coming soon, archived.

### Create and Edit

Wizard for identity, region, support, visa types, appointment behavior, forms/routing, page template, owner/reviewer. Tabs for General, Visa Types, Operations, Appointments, Forms, Relationships, SEO, Publishing, Versions.

### Operational Configuration

Manage request acceptance, team, owner, supported services, temporary closure, fallback, and review frequency.

### Content Health and Bulk Actions

Check hero, visa types, documents, process, fees, appointments, FAQ, form, legal, SEO, and sources. Bulk publish eligible records, change status/owner/form, schedule review, feature, archive, and export.

## Required Reusable Components

- Country metrics
- Country search
- Country filters
- Country table
- Country identity cell
- Support badge
- Publication badge
- Appointment indicator
- Form indicator
- Content health drawer
- New-country wizard
- Country tabs
- Visa-type manager

## Required Interaction and System States

- Default
- Draft
- Published
- Unavailable
- Unsupported
- Missing form
- SEO warning
- Bulk publish
- Archive confirmation
- No results
- Mobile cards

## Data Model and API Expectations

Country records should contain stable ID, Turkish and English names, ISO codes, slug, region, flag/media, support status, public status, visa types, appointment configuration, operational ownership, forms, services, relationships, SEO, review dates, versions, and history.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Country CMS** without becoming a generic template or unsafe no-code interface.


# Screen 28 — Country Landing Page Editor

**Recommended route:** `/admin/ulke-sayfalari/[countryId]`

## Screen Objective

Design a structured three-panel editor for a country-specific public landing page. Use Germany as the sample. Manage all public sections, sources, relationships, forms, legal claims, SEO, preview, review, publishing, and version history.

## Required Layout and Content

### Sticky Header and Layout

Show country identity, route, workflow, live/draft versions, save state, owner, preview, review, and publish. Left: structure; center: editor; right: preview/checks.

### Editor Modes

Content, Preview, Compare, Settings, and Checks.

### Page Structure

Hero, quick facts, visa types, applicant statuses, documents, process, appointments, fees/service scope, mistakes, rejection, FAQ, services, guides, related countries, bottom form, CTA, legal notice.

### Hero and Quick Facts

Country eyebrow, H1, summary, trust points, CTA, phone, form, image, availability notice, capital, region, visa framework, appointment dependency, service availability, and review date.

### Visa Types, Applicants, Documents

Structured relationships and tabs for employees, employers, students, retirees, self-employed, unemployed, and sponsored applicants with cautious wording.

### Appointments, Fees, Sources

Explain official-system dependency and seasonality; separate official fees from consultancy fees; attach source, URL, type, verified date, verifier, next review, and confidence.

### Claims, Forms, SEO, Publishing

Flag guarantees and official-affiliation claims; configure active form/version, routing, consent, test preview, SEO, schema, checklist, comments, scheduling, comparison, restore-as-new-draft, and audit history.

## Required Reusable Components

- Country editor shell
- Sticky editor header
- Section tree
- Structured section editor
- Hero editor
- Quick facts
- Visa cards
- Applicant editor
- Document editor
- Appointment editor
- Fee editor
- Source verification
- Claim warning
- Form selector
- Live preview
- SEO editor
- Checklist
- Version history

## Required Interaction and System States

- Default
- Section selected
- Reordered
- Draft preview
- Mobile preview
- Source outdated
- Risky claim
- Form test mode
- Comment added
- Review requested
- Publish blocked
- Published
- Concurrent
- Offline

## Data Model and API Expectations

Use stable section IDs and structured section payloads. Store content, relationships, sources, verification, CTAs, forms, SEO, comments, workflow, schedule, draft/live versions, and audit references.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Country Landing Page Editor** without becoming a generic template or unsafe no-code interface.


# Screen 29 — Service CMS

**Recommended route:** `/admin/hizmetler`

## Screen Objective

Manage service records, categories, availability, country relationships, forms, pricing, scope, SEO, workflows, and versions.

## Required Layout and Content

### Service Overview

Summary metrics for total, published, drafts, review, incomplete, update required, unavailable, and archived.

### Search, Filters, and Table

Search by service name, slug, code, category, country, form, and SEO. Filter by publication, availability, pricing, form, relationship, health, owner, and date. Table columns: service, category, availability, public status, countries, form, pricing, health, SEO, owner, update, actions.

### Create and Edit

Wizard for identity, availability, country and visa-type scope, pricing mode, form and routing, page template, owner, and reviewer. Dedicated tabs for General, Operations, Countries, Pricing, Form, Relationships, SEO, Publishing, Versions.

### Pricing and Scope

Separate consultancy fee from official/external costs. Support fixed, starting, range, quote, hidden, and free. Manage included and excluded services and validity date.

### Country Overrides

Global availability with selected-country overrides for form, pricing, team, public copy, start/end date, and CTA.

### Content and Publishing

Structured service-page sections, content health, risky claim checks, secure preview, review workflow, publish checklist, versions, archive and dependency report.

## Required Reusable Components

- Service CMS shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Service CMS** without becoming a generic template or unsafe no-code interface.


# Screen 30 — Blog CMS

**Recommended route:** `/admin/blog`

## Screen Objective

Manage articles, guides, categories, tags, authors, reviewers, structured content, sources, freshness, SEO, relationships, publishing, and versions.

## Required Layout and Content

### Editorial Overview

Metrics for total, published, draft, review, scheduled, update needed, SEO missing, and archived.

### Search and Filters

Filter by category, country, visa type, author, reviewer, workflow, public status, health, date, broken links, and featured state.

### Article Table

Article identity, type, category, country/visa type, author, workflow, public status, health, SEO, review, published/updated dates, actions.

### Structured Editor

Three-panel outline, structured blocks, editorial sidebar, hero, quick answer, headings, tables, checklists, documents, warnings, FAQ, CTA, media, sources, internal links, and related content.

### Editorial Controls

Author/reviewer assignment, inline comments, risky-claim detection, source verification, broken-link checks, meaningful update date, review cycle, schedule, preview, versions, redirect, and archive.

### SEO and Featured Placement

SEO fields, article schema, social previews, featured placements, important-update expiration, content freshness, and replacement behavior.

## Required Reusable Components

- Blog CMS shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Blog CMS** without becoming a generic template or unsafe no-code interface.


# Screen 31 — FAQ CMS

**Recommended route:** `/admin/sss`

## Screen Objective

Manage FAQ questions, answers, categories, scope, relationships, duplicates, conflicts, feedback, schema eligibility, review, publication, and versions.

## Required Layout and Content

### FAQ Overview

Metrics for total, published, drafts, review, update required, duplicate suspicion, unrelated, and archived.

### Search and Filters

Question/answer search; filters by category, country, service, visa type, workflow, public status, review, health, feedback, and schema eligibility.

### FAQ Table

Question preview, category, relationships, workflow, public status, health, feedback, schema, last update, reviewer, actions.

### Create and Edit

Wizard for identity, scope, relationships, structured answer, visibility, ownership, and review. Tabs for Question/Answer, Relationships, Visibility, Sources, SEO, Feedback, Publishing, Versions.

### Quality Controls

Duplicate-intent detection, side-by-side merge review, conflicting-answer detection, risky-answer checks, source verification, last verified date, and conditional variants.

### Feedback and Schema

Helpful/not helpful aggregation, reasons, low-sample safeguards, quick-answer eligibility, FAQ schema eligibility, context previews, and user-submitted question queue.

## Required Reusable Components

- FAQ CMS shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **FAQ CMS** without becoming a generic template or unsafe no-code interface.


# Screen 32 — Form Builder

**Recommended route:** `/admin/formlar`

## Screen Objective

Create, configure, test, version, and activate public forms with structured fields, multi-step flow, logic, consent, routing, notifications, success behavior, and health monitoring.

## Required Layout and Content

### Forms Overview

Metrics, search, filters, forms table with type, usage, status, fields/steps, routing, consent, health, submissions, update, actions.

### Builder Layout

Sticky header; left field palette and structure; center canvas; right selected-field settings. Modes: Fields, Logic, Design, Routing, Notifications, Consent, Success, Checks, Preview.

### Fields and Steps

Basic, application, content, consent, and advanced fields; stable IDs; labels, keys, validation, privacy classification, data mapping, accessibility, widths, steps, sections, and progress.

### Conditional Logic

Visual rule builder for visibility, required state, values, options, step behavior, and routing. Detect circular, conflicting, hidden-required, and unreachable states.

### Consent and Privacy

Locked KVKK notice, separate optional marketing consent, communication permission, versioning, privacy classifications, secure uploads, retention, and publication blocking on critical errors.

### Routing and Notifications

Pipeline, stage, team, assignee, priority, conditional routing, fallback, duplicate detection, internal notifications, applicant confirmation, safe variables, retries, and test simulator.

### Testing and Activation

Preview and test mode never create production leads. Show payload mapping, routing, notification preview, success/error states, validation, accessibility checks, health, versions, activation, scheduling, and rollback.

## Required Reusable Components

- Form Builder shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Form Builder** without becoming a generic template or unsafe no-code interface.


# Screen 33 — Homepage Editor

**Recommended route:** `/admin/ana-sayfa`

## Screen Objective

Edit the complete homepage through structured sections, relationships, forms, SEO, mobile preview, review, publication, and versioning.

## Required Layout and Content

### Editor Header and Layout

Sticky identity, workflow/live versions, save state, preview, review, publish. Three panels: section structure, active editor, live preview/checks.

### Homepage Sections

Hero, trust messages, popular countries, services, process, why VİS VİZE, appointment support, guides, FAQ, phone CTA, bottom form, legal disclaimer, announcement, and campaign sections.

### Structured Editing

Approved layout variants, media, CTAs, dynamic source modes (manual, automatic, hybrid), fallback behavior, section schedule, visibility, order, comments, and validation.

### Hero and Forms

Manage H1, supporting copy, trust points, phone source, primary/secondary CTA, hero form, active version, consent, routing, test behavior, visual, and mobile crop.

### Relationships

Only published and eligible countries, services, articles, FAQs, and forms. Warn on unavailable, archived, stale, draft, or test-mode dependencies.

### SEO and Publishing

Homepage SEO, social preview, structured data, content health, risky-claim detection, desktop/mobile preview, draft/live comparison, review, schedule, version history, and emergency rollback.

## Required Reusable Components

- Homepage Editor shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Homepage Editor** without becoming a generic template or unsafe no-code interface.


# Screen 34 — Navigation and Footer

**Recommended route:** `/admin/navigasyon`

## Screen Objective

Manage desktop navigation, dropdowns, mega menus, mobile menu, header CTAs, footer columns, contact, legal links, social links, announcements, schedules, previews, and versions.

## Required Layout and Content

### Editor Layout

Sticky version header; left navigation areas; center structure tree; right item settings and preview. Modes: Structure, Preview, Link Check, Settings, Compare.

### Menu Structure

Stable item IDs, nesting, drag and keyboard reorder, internal destinations, approved external links, phone, email, form actions, no-link parents, dropdown headings, and mega-menu cards.

### Responsive Navigation

Desktop dropdown and mega-menu settings, mobile inheritance/customization, accordion behavior, mobile fixed actions, safe areas, width and overflow checks.

### Footer

Brand block, description, contact, popular countries, services, quick links, legal links, social accounts, copyright, disclaimer, optional newsletter, and mobile accordion behavior.

### Safety and Validation

Server-side link checks, unpublished/archived destinations, redirect chains, unsafe protocols, required legal-link locks, accessibility, focus behavior, and public form actions disabled in preview.

### Workflow

Schedules, draft/live versions, compare, review, publish checklist, version history, rollback, templates, safe import/export.

## Required Reusable Components

- Navigation and Footer shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Navigation and Footer** without becoming a generic template or unsafe no-code interface.


# Screen 35 — Tracking Settings

**Recommended route:** `/admin/takip-ayarlari`

## Screen Objective

Configure privacy-aware analytics and conversion tracking, providers, events, forms, consent, UTM attribution, test mode, health, publishing, and rollback.

## Required Layout and Content

### Overview and Providers

Environment, live/draft versions, active providers, event count, conversion count, forms, warnings, consent status, test mode. Provider cards for GTM, GA4, Google Ads, Meta, and approved systems.

### Event Dictionary

Internal snake_case events, triggers, stable element IDs, provider mappings, conversions, consent requirements, parameters, privacy classification, health, and ownership.

### Privacy Rules

Block names, phone, email, passport, message text, address, files, and raw form values. Map each provider to necessary, analytics, advertising, functional, or preference consent.

### Form and Conversion Tracking

Map view, start, step, submit, success, error, and optional abandonment. Conversion fires after server success, not button click. Deduplicate client/server events.

### UTM and Attribution

UTM, click IDs, referrer, landing page, first/last touch, retention, consent dependence, sanitization, and fake-data preview.

### Test and Debug

Isolated test sessions, consent scenarios, real-time debug stream, sent/blocked/deduplicated/failed states, safe parameter detail, and no production contamination.

### Health and Publishing

Provider validation, environment mismatch, duplicate events, consent gaps, missing mappings, personal-data risk, form mismatch, review, publish checklist, pause, emergency shutdown, versions, and rollback.

## Required Reusable Components

- Tracking Settings shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Tracking Settings** without becoming a generic template or unsafe no-code interface.


# Screen 36 — General Site Settings

**Recommended route:** `/admin/genel-ayarlar`

## Screen Objective

Manage all global site identity, contact, company, legal, forms, CTAs, locale, SEO, social, email, media, lead defaults, feature flags, maintenance, security behavior, and versions.

## Required Layout and Content

### Settings Navigation

General, Brand, Contact, Hours, Company, Global CTA/Forms, Locale, SEO, Social, Legal, Email, Search, Media, Leads, Features, Maintenance, Security, Integrations, Checks, Versions.

### Brand and Domain

Site names, primary/canonical domain, www preference, HTTPS, environment indexing, logos, favicon, app icons, brand colors, typography references, descriptions, and usage.

### Contact and Company

Reusable phone/email/WhatsApp channels, business hours, holiday exceptions, address, map, legal company fields, public-field mapping, validation, and usage impact.

### Global CTA and Forms

Reusable CTA definitions, phone/form destinations, usage map, default forms and versions, health, consent, routing, and fallback lead defaults.

### Locale and SEO

Language, locale, timezone, formats, currency, multilingual fallback, SEO patterns, canonical defaults, OG defaults, robots behavior, sitemap, and social preview.

### Legal and Notifications

Locked private-consultancy disclaimer, required legal pages, consent versions, legal ownership, email sender references, notification defaults, and verification status.

### Operations and Safety

Search privacy, media/file rules, lead reference format, review defaults, feature flags with dependencies, maintenance modes, form pause, security behavior, integration references, dependency checker, impact preview, review, publish, versions, rollback.

## Required Reusable Components

- General Site Settings shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **General Site Settings** without becoming a generic template or unsafe no-code interface.


# Screen 37 — Users and Roles

**Recommended route:** `/admin/kullanicilar`

## Screen Objective

Manage users, invitations, roles, granular permissions, scopes, teams, MFA, sessions, temporary access, access reviews, security policies, and immutable history.

## Required Layout and Content

### Users Overview

Metrics, security banner, tabs for Users, Roles, Permissions, Teams, Invitations, Sessions, Reviews, Policies, History. Search and filter by role, status, team, scope, MFA, and review.

### Users Table

User, business email, role, team, access scope, status, MFA, last login, sessions, access review, actions. Mask restricted security metadata.

### Invitation Flow

Identity, role, least-privilege scope, MFA, temporary expiration, review, approval for high-risk roles, secure expiring single-use invitation.

### Roles and Permissions

System/custom roles, module permissions, sensitive permissions, masking levels, permission sources, explicit deny, dependencies, conflicts, self-approval prevention, risk classification, role preview, duplication, and deprecation.

### Scopes and Teams

Own/team/all records, selected countries, services, pipelines, modules, review queues, team memberships, manager roles, and inherited access visibility.

### Security

MFA policy, reset flow, active sessions, suspicious sessions, session revocation, account suspension/deactivation/archive, reauthentication, no secret display.

### Temporary Access and Reviews

Mandatory expiration, approval, auto-revoke, access certification, inactive-user review, privilege elevation workflow, permission simulation, safe exports, audit history.

## Required Reusable Components

- Users and Roles shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Users and Roles** without becoming a generic template or unsafe no-code interface.


# Screen 38 — Audit Log

**Recommended route:** `/admin/denetim-kayitlari`

## Screen Objective

Provide an immutable, searchable, forensic audit workspace for all security, user, lead, content, form, settings, export, authentication, and system events.

## Required Layout and Content

### Overview

Date range, metrics for total, critical, security, permission changes, exports, failures, unreviewed, investigations, and critical alert banner.

### Search and Filters

Search actor, target, event, module, event ID, correlation ID, reason, and safe metadata. Filter actor, module, action, severity, result, environment, source, sensitive access, export, review, and investigation.

### Audit Table

Time, severity, event, actor at event time, target, module, result, source, review status, actions. No edit or delete actions.

### Event Detail

Summary, actor, target, structured previous/new-value diff, request context, security context, related events, correlation workflow, review annotations, and integrity information.

### Sensitive Events

Masked values by default, permission and reason required to reveal, reveal creates new audit event. Include exports, file access, contact reveals, role changes, MFA changes, and session activity.

### Investigations

Create cases, group events, assign owner/team, findings, evidence references, containment actions, timeline, resolution, confidentiality, and legal hold.

### Integrity and Retention

Append-only status, verification, retention class, legal hold, ingestion health, missing audit coverage, immutable original events, separate annotations.

### Exports and Live Stream

Approval-based expiring masked exports, purpose, record counts, formats, self-auditing, live stream with pause/filter, no unbounded client history.

### Scale and Security

Cursor pagination, server search, indexed fields, lazy details/diffs, risk rules, grouped repeated events, permission-aware fields, and self-auditing of audit-log access.

## Required Reusable Components

- Audit Log shell
- Page header
- Summary metrics
- Search and filters
- Status badges
- Primary table or editor
- Detail drawer
- Validation panel
- Review dialog
- Publication checklist
- Version history
- Permission guard
- Loading and error states
- Mobile cards or editor

## Required Interaction and System States

- Default
- Search active
- Filters active
- Selected item
- Validation warning
- Permission restricted
- Review requested
- Changes requested
- Approved
- Publish or activation blocked
- Success
- Loading
- Partial error
- Offline
- Mobile

## Data Model and API Expectations

Use stable IDs, versioned configuration, role-aware relationships, workflow status, public status where relevant, owners, reviewers, created/updated timestamps, and immutable audit references. APIs must support server-side search, filters, sorting, pagination or cursor loading, validation, review workflow, secure preview/test behavior, version comparison, restore-as-new-draft, and audited high-risk actions.

## Security, Accessibility, and Performance

- Use server-side search, filters, sorting, pagination, validation, and permission checks.
- Use keyboard-accessible tables, tabs, drawers, dialogs, drag-and-drop alternatives, and visible focus states.
- Do not communicate state by color alone.
- Use skeleton loading rather than blocking full-page spinners.
- Use targeted autosave and targeted cache invalidation.
- Keep list payloads lightweight and lazy-load details, versions, relationships, and logs.
- All admin routes must be `noindex` and excluded from public sitemaps.
- Do not expose raw database, provider, or authentication errors.

## Final Design Rule

The result must feel premium, structured, production-ready, secure, permission-aware, and completely consistent with the VİS VİZE design system. It must solve the operational purpose of **Audit Log** without becoming a generic template or unsafe no-code interface.


---

# End of Part 2

This file contains the complete prompt set for Screens 21–38 of the VİS VİZE website and administration platform.
