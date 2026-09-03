# Heaven Furniture Mart — Design Direction

## Three stylistic approaches

### Theme Name: Atelier Nocturne
Very dark, cinematic interior-studio atmosphere with warm brass glints, editorial serif typography, and quiet parallax depth.
**Probability:** 0.07

### Theme Name: Sunlit Material Library
A tactile, high-key showroom language built from limestone, woven textures, soft daylight, and restrained clay accents.
**Probability:** 0.04

### Theme Name: Bauhaus Salon
A more architectural direction using ink, parchment, modular geometry, and a sculptural furniture silhouette system.
**Probability:** 0.08

## Selected approach: Atelier Nocturne

### Design Movement
Contemporary editorial luxury with references to **mid-century interiors, boutique hospitality, and the cinematic restraint of an atelier**. The site should feel like entering a private design studio after hours: quiet, deliberate, and materially rich.

### Core Principles
1. **Curated restraint:** fewer, stronger elements; no marketplace density, badges, or noisy promotional language.
2. **Material intimacy:** surfaces should suggest smoked oak, hand-finished brass, boucle, and charcoal plaster through texture and lighting.
3. **Asymmetrical confidence:** content sits on a deliberate vertical axis while the visual composition drifts, creating a gallery-like sense of discovery.
4. **Depth through light:** motion should feel like a slow camera move through a room, not a collection of UI effects.

### Color Philosophy
Charcoal-teal is the grounding color because it feels architectural and calm without becoming flat black. Muted brass is used sparingly as a signal of craft and attention, while warm parchment provides human contrast for copy and secondary surfaces. The palette should feel lit by a low evening sun, not digitally glowing.

### Layout Paradigm
A full-viewport hero with a left-anchored editorial content column and a right-biased sculptural room image. Supporting metadata floats in the negative space like a gallery wall label. The page should reveal the next section through a narrow horizontal rail rather than an obvious stacked card grid.

### Signature Elements
- A slim brass measurement rule with micro-labels, echoing a furniture maker’s drawing.
- A softly inset “room study” image frame with a movable glass lens and parallax drift.
- A vertical studio index marker and understated scroll cue.

### Interaction Philosophy
Interactions should feel like handling a well-made object: responsive, slightly weighty, and never flashy. CTAs respond with a subtle magnetic lift and brass halo; the hero image tilts only a few degrees and follows the pointer with a long, damped ease. Keyboard focus remains visible as a brass keyline.

### Animation
Entrance is a 1.2–1.6 second staged camera reveal: background light blooms first, the image frame settles from a slightly closer scale, then the editorial label, headline, copy, and CTA cascade in 70–100ms intervals. Hover motion uses transform and opacity only. The brass rule draws from 0 to full length. Ambient background shapes drift on an 18–26 second loop, paused under reduced motion.

### Typography System
- **Display:** Cormorant Garamond, with 500 weight for the headline and italic emphasis on “Around”.
- **Utility/body:** Manrope, with 400–700 weights for navigation, metadata, buttons, and paragraphs.
- Headline hierarchy favors oversized, tight leading, and intentional line breaks; body copy stays narrow at 42–52ch; utility copy uses generous tracking and uppercase labels.

### Brand Essence
A bespoke furniture and interior styling studio for people in Chattogram who want pieces made around the way they live — not items selected from a catalog.

**Personality:** intimate, assured, material-led.

### Brand Voice
Headlines sound like a confident design editor. CTAs are direct and considered. Microcopy is warm but never salesy.

- “A room begins with the way you live in it.”
- “Tell us how the space should feel.”

### Wordmark & Logo
The symbol is a small architectural arch nested inside a softened square, referencing a doorway into a room and the letterform rhythm of an H. The wordmark is set in a custom-spaced serif with a single brass hairline under “MART”; the symbol should also work independently as a favicon.

### Signature Brand Color
**Studio Brass — #B79A6B.** A muted, aged brass that reads as craft and warmth rather than shine.

## Implementation guardrails

- Use the generated room-study asset only for the hero visual; do not repeat it elsewhere.
- Keep the hero high-contrast and text-safe with a controlled overlay; never place parchment copy directly over a bright region.
- Avoid excessive rounded cards, purple gradients, default Inter styling, or dense e-commerce UI.
- Keep animation tasteful and gate non-essential effects behind `prefers-reduced-motion`.
