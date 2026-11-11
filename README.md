# DiasporaPay Agent

DiasporaPay Agent is a warm, multilingual AI-assisted remittance and essentials-purchasing web application built with **PayPal Sandbox + Gemini**. It helps diaspora users send groceries, pay electricity bills, support school & health needs, and send ride vouchers to family in Ethiopia.

## Architecture & Folder Structure

```text
src/
├── components/
│   ├── layout/          # ErrorBoundary, ProgressStepper, MobileBottomNav
│   ├── Header.tsx       # Top bar with Tibeb stripe, 6-language selector, dark mode toggle
│   ├── ChatArea.tsx     # Warm home greeting, recipient card, category tiles, voice input
│   ├── CartDrawer.tsx   # Cart review
│   ├── CheckoutModal.tsx# Safety check, fee transparency, PayPal Sandbox checkout
│   ├── OrdersPage.tsx   # Order history with recipient & category filters
│   └── ...
├── hooks/
│   ├── useTheme.ts      # Light/dark mode with system preference & localStorage
│   └── useLanguage.ts   # Active language, RTL support (Arabic), localStorage
├── i18n/
│   ├── index.ts         # Language metadata, browser detection, translator with EN fallback
│   ├── en.json          # English
│   ├── am.json          # አማርኛ (Amharic)
│   ├── om.json          # Afaan Oromoo (Oromo)
│   ├── ti.json          # ትግርኛ (Tigrinya)
│   ├── ar.json          # العربية (Arabic, RTL)
│   └── fr.json          # Français (French)
├── lib/
│   ├── constants.ts     # Shared constants & single source of truth for cart totals
│   └── formatters.ts    # Intl currency, date, and initials formatters
└── types/               # TypeScript interfaces
```

## Design System

- **Palette**: Deep emerald green (`#0b6e4f`), soft gold (`#d9a441`), warm cream (`#faf8f5`), charcoal text, and muted coral red (`#c94a38`) for warnings. Full dark mode support.
- **Typography**: `Inter`, `Noto Sans Ethiopic` (Amharic & Tigrinya), and `Noto Sans Arabic`.
- **Cultural Detail**: CSS-only Ethiopian **Tibeb-style** geometric stripe in the header.
- **Accessibility**: WCAG AA contrast, visible focus rings, `prefers-reduced-motion` support, and mobile-first bottom navigation with `>= 44px` tap targets.

## Supported Languages & Adding a New Language

Supported languages: **English (`en`)**, **Amharic (`am`)**, **Afaan Oromoo (`om`)**, **Tigrinya (`ti`)**, **Arabic (`ar`, RTL)**, and **French (`fr`)**.

> **Note**: Non-English translations are machine-assisted and should be reviewed by native speakers before production launch.

To add a new language:
1. Create `src/i18n/<code >.json` copying keys from `src/i18n/en.json`.
2. Add the language code to `Language` in `src/types/index.ts`.
3. Register the language in `SUPPORTED_LANGUAGES` and `TRANSLATIONS` in `src/i18n/index.ts`.
