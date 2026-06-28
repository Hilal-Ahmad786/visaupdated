---
name: Elite Consulate Aesthetic
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#4a5e86'
  primary: '#000f29'
  on-primary: '#ffffff'
  primary-container: '#0c2448'
  on-primary-container: '#778cb6'
  inverse-primary: '#b2c7f4'
  secondary: '#7e5700'
  on-secondary: '#ffffff'
  secondary-container: '#fdc25b'
  on-secondary-container: '#734f00'
  tertiary: '#160e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f2303'
  on-tertiary-container: '#9d8a5f'
  error: '#C63D45'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#b2c7f4'
  on-primary-fixed: '#011b3f'
  on-primary-fixed-variant: '#32476c'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#f7bd56'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#5f4100'
  tertiary-fixed: '#f8e0af'
  tertiary-fixed-dim: '#dbc495'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#544521'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
  deep-navy: '#071A35'
  gold-hover: '#9D7018'
  warm-gold-surface: '#F7F0E2'
  text-primary: '#10213D'
  text-secondary: '#59677A'
  text-muted: '#7C8797'
  border-base: '#D9E0EA'
  success: '#16845B'
  warning: '#C77912'
typography:
  display-hero:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-h1:
    fontFamily: Manrope
    fontSize: 46px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-h1-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-h2:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-h3:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '650'
    lineHeight: 34px
  headline-h4:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '650'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '650'
    lineHeight: 18px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-desktop: 80px
  section-mobile: 56px
  gutter: 24px
  container-max: 1240px
---

## Brand & Style

This design system embodies an **established, professional, and international** personality, specifically tailored for premium visa and travel services. It avoids the cold, bureaucratic feel of government websites in favor of a high-end consultancy aesthetic that feels both authoritative and human.

The chosen style is **Corporate / Modern** with a focus on **Tonal Layers**. It prioritizes a "conversion-first" UX, where the interface remains clean and unobtrusive to ensure that action-oriented elements—like application forms and contact triggers—receive maximum prominence. The visual language uses a deep, trustworthy navy base contrasted with sophisticated gold accents to signal premium service quality and reliability.

## Colors

The palette is strategically divided between **Authority** (Navies) and **Action** (Golds). 

- **Primary & Dark tones** (`brand-navy`, `deep-navy`) are reserved for structural elements like headers, footers, and primary headings to establish a foundation of trust.
- **Secondary & Action tones** (`brand-gold`, `gold-hover`) are strictly used for interactive elements, call-to-actions (CTAs), and progress indicators.
- **Surface colors** (`warm-gold-surface`, `page-bg`) provide a soft, premium alternative to stark white, reducing eye strain and reinforcing the boutique service feel.
- **Functional colors** follow international standards for success and error states but are slightly desaturated to maintain the professional atmosphere.

## Typography

This system employs a dual-font strategy to balance character with utility. 

**Manrope** is used for all "structural" text—headings, labels, and buttons. Its modern, geometric construction provides the "Established" and "Professional" personality the brand requires. 

**Inter** is used exclusively for body copy and descriptions. Its exceptional legibility at small sizes ensures that complex visa requirements and instructions are easily digestible for the user.

- **Scale:** Maintain a generous line-height for body text to improve readability.
- **Emphasis:** Use font weight rather than color to create hierarchy within text blocks.
- **Labels:** Form labels and small navigation items should utilize the slightly tighter letter-spacing and heavier weight of Manrope for better "at-a-glance" recognition.

## Layout & Spacing

The design system is built on a strict **8-point linear scale** to ensure mathematical harmony across all components.

- **Grid Model:** A 12-column fluid grid for desktop with 24px gutters. For mobile, transition to a 4-column grid with 16px side margins.
- **Rhythm:** Use `section-desktop` (80px) padding between major content blocks to create breathability. 
- **The "Form-First" Rule:** Conversion forms should be centered or placed in a high-focus right-hand column (spanning 4-5 columns) with increased padding (`xl`) to elevate their perceived importance.
- **Reflow:** On mobile devices, ensure the "Sticky Conversion Bar" appears at the bottom of the viewport, providing immediate access to primary actions regardless of scroll depth.

## Elevation & Depth

Visual hierarchy is achieved through **Ambient Shadows** and **Tonal Layers**. The design avoids harsh borders, opting for depth that feels soft and integrated.

- **Surface Levels:** 
    - **L0 (Background):** `page-bg` (#F7F9FC).
    - **L1 (Standard Cards):** White background with a subtle, wide-dispersion shadow (e.g., 0px 4px 20px rgba(16, 33, 61, 0.05)).
    - **L2 (Form Cards/Modals):** High-priority focus areas. These use a more pronounced shadow and larger corner radius to "float" higher above the background.
- **Glassmorphism:** Use sparingly for navigation headers only. A 10px backdrop-blur on a white surface at 80% opacity allows the content to scroll beneath while maintaining legibility.
- **Interaction:** Upon hover, interactive cards should slightly "lift" by increasing shadow spread and decreasing opacity.

## Shapes

The shape language is consistently **Rounded** to evoke a "human" and "approachable" feel.

- **Inputs & Buttons:** Fixed at 10px radius to provide a modern, crisp appearance without being overly "bubbly."
- **Standard Cards:** 16px radius for general content blocks.
- **Form Cards:** 20px radius to distinguish them from standard informational content.
- **Icons:** Use a consistent 1.75pt - 2pt stroke weight with rounded caps and joins to match the component radius.

## Components

### Buttons
- **Primary:** `brand-gold` background, white text, 10px radius. On hover, transition to `gold-hover`.
- **Secondary:** `brand-navy` background, white text. Used for secondary navigation or alternative actions.
- **Ghost:** Transparent background with `brand-navy` text and 1.5px border.

### Form Inputs
- **Style:** 10px radius, `border-base` stroke, white background.
- **Focus State:** 2px stroke using `brand-gold` or `brand-navy` with a very soft outer glow.
- **Labels:** Always use Manrope (Label role) above the field.

### Cards
- **Standard:** 16px radius, white background, L1 shadow.
- **Action/Form Card:** 20px radius, white background, L2 shadow. Often features a `brand-navy` header strip or `warm-gold-surface` top section.

### Chips & Badges
- **Status Chips:** Used for application stages. Use pill-shaped (999px) rounding with light tints of `success`, `error`, or `warning` colors and high-contrast text.

### The Sticky Conversion Bar (Mobile)
- A persistent footer element containing two primary actions: "Call Now" (Ghost style) and "Apply Now" (Primary Gold style). This is a mandatory component for mobile conversion optimization.