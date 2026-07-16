---
name: Levantine Health Intelligence
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#555f71'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f6'
  on-secondary-container: '#596376'
  tertiary: '#4b0005'
  on-tertiary: '#ffffff'
  tertiary-container: '#73000c'
  on-tertiary-container: '#ff736c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d9e3f9'
  secondary-fixed-dim: '#bdc7dc'
  on-secondary-fixed: '#121c2c'
  on-secondary-fixed-variant: '#3d4759'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#faf9fd'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e6'
typography:
  display-lg:
    fontFamily: Noto Kufi Arabic
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Kufi Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Noto Kufi Arabic
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Noto Kufi Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Noto Kufi Arabic
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Noto Kufi Arabic
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Noto Kufi Arabic
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 280px
  overlay_margin: 1.5rem
  gutter: 1rem
  card_padding: 1.25rem
  touch_target: 44px
---

## Brand & Style

The design system is engineered for high-stakes medical logistics and geographic information systems (GIS). It prioritizes **clarity, speed of cognition, and professional trust**. The target audience includes health officials, NGOs, and emergency responders operating within Syria, requiring a tool that remains legible under varying lighting conditions and high-stress scenarios.

The visual style is **Corporate Modern with a "Pretty and Clear" finish**. It utilizes a light-themed, airy interface to ensure that complex map data—the primary focal point—is not overwhelmed by the surrounding UI. Subtle depth through soft shadows and semi-transparent overlays creates a structured hierarchy without the visual clutter of heavy borders.

## Colors

The palette is anchored by **Deep Blue (#1A365D)**, conveying institutional reliability and authority. **Medical Teal-Grey (#2D3748)** is used for secondary UI elements and sidebars to maintain a neutral, professional environment.

Critical data points use high-significance accent colors:
- **Emergency Red (#E53E3E):** Reserved exclusively for critical alerts, high-casualty incidents, or depleted medical stock.
- **Ambulance Amber (#F6AD55):** Used for transit statuses, moderate warnings, and active logistics.
- **Neutral Background (#F7FAFC):** A clean, cool-white canvas that allows map layers (satellite or topographic) to pop.

## Typography

The design system utilizes **Noto Kufi Arabic** for its exceptional legibility at small sizes and its neutral, systematic character. 

For the GIS dashboard, **Tabular Numerals (`tnum`)** are enabled for all data-heavy components (coordinates, casualty counts, and timestamps) to ensure vertical alignment in tables and maps. "Label-caps" are used for sidebar category headers to provide clear structural distinction without increasing font size.

## Layout & Spacing

This design system uses a **Hybrid Dashboard Layout**. 
- **The Sidebar:** Fixed at 280px on the left, housing filters, administrative boundaries, and layer toggles. 
- **The Main Canvas:** A fluid, full-viewport GIS map area.
- **Floating Overlays:** Content cards (Legend, Stat Summaries) float 24px (1.5rem) from the screen edges with a high z-index.

**Mobile Adaptivity:** On smaller screens, the sidebar collapses into a bottom sheet, and map overlays transition to a stacked "Information Bar" at the top of the viewport to maximize the visible map area.

## Elevation & Depth

To maintain the "Pretty and Clear" aesthetic, the design system avoids heavy borders in favor of **Ambient Shadows**.

1.  **Level 0 (Map):** The base layer.
2.  **Level 1 (Panels):** Sidebars and toolbars use a subtle `0px 1px 3px rgba(0,0,0,0.1)` shadow.
3.  **Level 2 (Floating Cards/Markers):** Map overlays and tooltips use a more diffused `0px 10px 15px -3px rgba(0,0,0,0.1)` shadow to appear physically lifted above the geographic data.
4.  **Backdrop Blur:** All floating overlays utilize a `blur(8px)` effect on their background to maintain legibility against complex map textures.

## Shapes

The design system adopts a **Rounded (Level 2)** aesthetic to soften the technical nature of medical data.
- **Standard UI Elements:** 0.5rem (8px) corner radius.
- **Floating Map Cards:** 1rem (16px) corner radius.
- **Map Markers:** Circular for general locations; teardrop for specific facilities.

## Components

### Map Markers & Pins
Markers for hospitals use a medical cross icon within a rounded square. Emergency incidents use pulsing circular glows in **Emergency Red** to denote real-time activity.

### Action Buttons
Primary actions (e.g., "Export Report") use the Deep Blue background with white text. Secondary actions (e.g., "Recenter Map") use a "Ghost" style: transparent background with a subtle Teal-Grey outline.

### Data Overlays
Information cards that float over the map must feature a "Glassmorphism" effect: a white surface at 90% opacity with a backdrop blur. This ensures that while the card is readable, the user retains a sense of the map underneath.

### Status Chips
Status indicators (e.g., "Operational," "Under Capacity," "Critical") use a subtle tinted background of the status color with high-contrast text of the same hue (e.g., Light Red background with Deep Red text).

### Filter Lists
Use a "Checked" state that highlights the entire row in a soft blue tint (#EBF8FF) to show active map layers clearly.
