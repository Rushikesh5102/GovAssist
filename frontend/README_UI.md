# Futuristic UI Overhaul - GovAssist AI

This directory contains the new UI implementation for GovAssist AI, featuring a modern, responsive, and accessible design.

## Key Features

### 1. Design System
- **Theme**: Neon/Glassmorphism with India-inspired colors (Saffron, Green, Blue).
- **Tokens**: Defined in `src/styles/design-tokens.ts`.
- **Dark Mode**: Fully supported with `class` strategy.

### 2. Components
- **AppLayout**: Responsive shell with fixed topbar and sidebar support.
- **ChatWindow**: Advanced chat interface with:
  - Streaming response simulation (`StreamingRenderer`).
  - Markdown & Code highlighting.
  - File & Voice input controls.
  - Message actions (Copy, Regenerate, Feedback).
- **Onboarding**: `OnboardWizard` for new users.
- **Settings**: `SettingsModal` for preferences.

### 3. Animations
- Powered by `framer-motion`.
- `ScrollReveal` for page entry animations.
- Micro-interactions on buttons and inputs.

## Development

### Commands
- `npm run dev`: Start development server.
- `npm run build`: Build for production (includes lazy loading).

### Customization
- Edit `src/styles/design-tokens.ts` to change colors or spacing.
- Update `tailwind.config.js` to extend the theme further.

## Structure
- `src/components/Nav`: Topbar and navigation.
- `src/components/ChatWindow`: Chat-specific components.
- `src/components/Onboarding`: Wizard components.
- `src/components/Settings`: Settings modal.
- `src/components/Animations`: Reusable animation wrappers.
