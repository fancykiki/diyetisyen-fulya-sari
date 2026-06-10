# OpenCode Project Instructions — Diyetisyen Fulya Sarı

## Project Context
This is the official website project for Diyetisyen Fulya Sarı. The website is a Turkish dietitian / nutrition consultancy site focused on trust, clarity, healthy lifestyle, online consultation, appointment conversion, and premium visual quality.

The live project should be improved carefully. Avoid large rewrites unless explicitly requested.

## Main Goals
- Improve the hero / slider area without breaking the existing layout.
- Make the UI feel more premium, modern, warm, natural, and trustworthy.
- Improve responsive behavior on desktop, tablet, and mobile.
- Add subtle, performant animations where they improve the experience.
- Improve CTA visibility and conversion: Randevu Al, Programları İncele, WhatsApp ile İletişim.
- Keep the existing brand direction: dark green, cream, beige, warm natural accents.

## Design Direction
Use these references as the preferred design language:
- Clean wellness landing page
- Premium dietitian website
- Soft luxury health brand
- Editorial nutrition layout
- Natural food photography with refined overlays
- Cream/glass cards, rounded corners, refined shadows
- Calm spacing, clear hierarchy, readable typography

## Safe Change Rules
Do:
- Make small, controlled improvements.
- Preserve existing content and page structure when possible.
- Keep code readable and easy to revert.
- Prefer CSS improvements before adding dependencies.
- Keep animations lightweight.
- Add `prefers-reduced-motion` support for motion effects.
- Report all changed files at the end.

Do not:
- Do not redesign the entire website without permission.
- Do not break header, navbar, footer, slider logic, forms, or routing.
- Do not add heavy dependencies unless clearly needed.
- Do not add large 3D scenes, video backgrounds, or performance-heavy effects to the live site.
- Do not make medical guarantees such as guaranteed weight loss.
- Do not use childish or exaggerated animations.
- Do not touch unrelated files.

## Hero / Slider Rules
The current hero has:
- Dark green topbar
- Cream navbar
- Food/vegetable background image
- Large cream/glass hero card
- Badge, title, description, feature pills, CTA buttons
- Slider navigation

Improve it by:
- Making the card more compact and premium.
- Improving typography, line-height, and spacing.
- Making feature pills smaller, aligned, and responsive.
- Improving CTA hierarchy.
- Cleaning slider navigation.
- Adding soft background overlay and slow image zoom only if performance remains good.
- Keeping mobile layout clean with no horizontal overflow.

## Animation Rules
Allowed:
- fade-up
- soft reveal
- text reveal
- smooth hover
- subtle background slow zoom
- slider crossfade
- micro-interactions on cards/buttons

Avoid:
- bouncing effects
- excessive motion
- heavy Three.js scenes
- large video backgrounds
- too many libraries

## Responsive Checklist
Always check:
- 1440px desktop
- 1280px desktop
- 1024px tablet
- 768px tablet/mobile
- 480px mobile
- 375px mobile

No horizontal overflow. No text clipping. Buttons must remain tappable. The hero card must not exceed viewport width on mobile.

## Content Tone
Turkish content should be:
- Professional
- Warm
- Clear
- Trustworthy
- Not exaggerated
- Health/wellness focused

Avoid unrealistic promises and medical claims.
