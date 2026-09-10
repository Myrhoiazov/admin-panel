# CRM Style Standards

## Visual Direction

- Tone: premium clinic luxury (deep green + warm gold + porcelain surfaces)
- Feel: precise, calm, expensive, minimal
- Contrast: high readability for data-heavy screens

## Typography

- Base font: `Manrope`
- Accent font (titles): `Cormorant Garamond`
- Main text token: `--font-m`
- Large title token: `--title-font-l`

## Core Design Tokens

- Primary background: `--bg-color`
- Sidebar surface: `--sidebar-bg-start`, `--sidebar-bg-end`
- Main content surface: `--surface-primary`, `--surface-secondary`
- Primary text: `--text-primary`
- Muted text: `--text-muted`
- Premium accent: `--accent-gold`
- Borders: `--border-soft`, `--border-strong`
- Shadows: `--shadow-light`, `--shadow-accent`, `--shadow-luxury`
- Radius: `--border-radius-s`, `--border-radius-m`, `--border-radius-l`, `--border-radius-pill`
- Layout spacing: `--space-*`, `--layout-side-padding`, `--layout-top-padding`

## Layout Rules

- Top navigation and sidebar use elevated surfaces with soft borders.
- Primary work area (`Page`) always uses rounded card container.
- Interactive controls use subtle lift on hover (`translateY(-1px)` + stronger shadow).

## Usage Rule

When creating new UI, first use existing CSS variables from `variables/global.scss` and theme files.
Add new tokens only when no existing semantic token fits the component purpose.
