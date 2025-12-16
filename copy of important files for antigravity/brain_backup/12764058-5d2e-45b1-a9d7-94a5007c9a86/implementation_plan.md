# Implementation Plan - Antigravity Refresh

## Goal Description
Completely overhaul the current styling to match the "Antigravity" homepage aesthetic: extremely clean, white-dominant, with interactive floating particles. The "GovAssist" identity will be maintained via subtle particle coloration (Tricolor) but the layout will strict follow the provided references.

## User Review Required
> [!IMPORTANT]
> **CSS Wipe**: `App.css` and `index.css` will be reset. Any previous custom style overrides will be lost.
> **Layout Change**: The Hero section will be completely replaced with `AntigravityHero.tsx`.

## Proposed Changes

### Styles
#### [MODIFY] [index.css](file:///c:/Users/Rushi/Desktop/GovAssist/frontend/src/index.css)
- Reset to just Tailwind directives.
- Add `Outfit` or `Inter` font import.

#### [MODIFY] [App.css](file:///c:/Users/Rushi/Desktop/GovAssist/frontend/src/App.css)
- Reset/Empty to remove old global styles.

#### [MODIFY] [tailwind.config.js](file:///c:/Users/Rushi/Desktop/GovAssist/frontend/tailwind.config.js)
- Define `font-sans` as `['Inter', 'sans-serif']`.
- Define "Antigravity" specific colors (Off-black `#202124`, Google Blue (or Indian Saffron/Green variants)).

### Components

#### [NEW] [InteractiveParticles.tsx](file:///c:/Users/Rushi/Desktop/GovAssist/frontend/src/components/Hero/InteractiveParticles.tsx)
- Use `@react-three/fiber` `Points`.
- Create a field of dot particles.
- **Interaction**: Particles gently float. On mouse move, they repel or attract slightly.
- **Color**: Mix of Saffron, White, Green (Subtle).

#### [NEW] [AntigravityHero.tsx](file:///c:/Users/Rushi/Desktop/GovAssist/frontend/src/components/Hero/AntigravityHero.tsx)
- **Layout**: Centered massive heading.
- **Background**: Full screen (or large container) `InteractiveParticles`.
- **Content**:
  - H1: "Experience intelligent governance" (Large, Black).
  - Sub: "GovAssist AI helps you navigate..."
  - Buttons: Black pill "Get Started", White pill "Learn more".

#### [MODIFY] [HomePage.jsx](file:///c:/Users/Rushi/Desktop/GovAssist/frontend/src/pages/HomePage.jsx)
- Swap `<Hero />` with `<AntigravityHero />`.
- Update feature sections to match the clean white "Card" aesthetic (Image 1 tabs).

## Verification Plan
- **Verification**: `npm run dev` and visual check.
- **Performance**: Ensure particle count is optimized (e.g., 2000 particles max for low-end devices).
