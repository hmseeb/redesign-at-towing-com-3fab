# AT Towing — Website Redesign

A complete, from-scratch redesign of the AT Towing website (Benicia, CA & the greater Bay Area),
built as a fast, responsive, single-page site in vanilla HTML, CSS and JavaScript.

## Business

- **AT Towing** — heavy & light duty towing, vehicle recovery and auto/truck transportation since 2002
- **Phone (24/7):** [925-395-6178](tel:925-395-6178)
- **Address:** 51 Oak Rd, Benicia, California, 94510
- **Instagram:** [@at_towing24.7](https://instagram.com/at_towing24.7)

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point — all page content, semantic markup, meta/OG tags, LocalBusiness + FAQPage JSON-LD |
| `styles.css` | Full design system: custom properties, layout, components, responsive breakpoints |
| `script.js` | Mobile nav, sticky header, scroll reveal, scroll-spy nav, FAQ accordion, gallery lightbox, form validation |

No build step and no dependencies — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Sections

Hero · Welcome / About · Why AT Towing · Services (Heavy Duty Towing, Car Lockouts, Jumpstarts,
Luxury Auto Towing, 24 Hour Roadside Assistance) · CTA banner · Gallery · Areas We Serve (14 cities)
· FAQ (10 questions) · Contact + request form · Footer

## Design

- Near-black steel (`#0d0f12`) with a safety-amber accent (`#ffb400`)
- Bold, tightly-tracked display headings against generous whitespace
- Mobile-first responsive layout with a sticky "Call Now" bar under 900px
- Accessible: skip link, focus-visible rings, ARIA labelling, `prefers-reduced-motion` support

## Images

Authentic AT Towing photography (tow truck and recovery shots, company logo) is reused from the
original site. Generic stock photos inherited from the old site were replaced with section-specific
Pexels imagery for the Car Lockouts, Jumpstarts, Luxury Auto Towing and Roadside Assistance cards.
