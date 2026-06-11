# Future Healthcare Experience

An independent **concept study** exploring how healthcare could evolve when patient
needs become the starting point of every interaction.

> This is not a clinic website, a healthcare SaaS, or a patient portal.
> It explores a future where healthcare systems are designed around people —
> guiding them from **uncertainty to clarity** through one connected experience.

The visitor should leave with a single thought:
*“I'd feel calmer if healthcare worked this way.”*

---

## The journey — five chapters

The project is a journey. Each page is a chapter that answers one human question.

| # | Chapter | File | Answers |
|---|---------|------|---------|
| 01 | **Vision** | [index.html](index.html) | Why should healthcare change? |
| 02 | **AI Medical Concierge** | [concierge.html](concierge.html) | How does future healthcare begin? |
| 03 | **Doctor Experience** | [doctors.html](doctors.html) | Who will help me? |
| 04 | **Booking Experience** | [booking.html](booking.html) | How do I take the next step? |
| 05 | **Patient Dashboard** | [dashboard.html](dashboard.html) | What happens after treatment begins? |

The **AI Medical Concierge** (Chapter 02) is the heart of the project — an interactive,
guided navigation experience. Describe a concern in plain words ("I have neck pain and
headaches") and it asks gentle questions, identifies possible care pathways and prepares
the next step. **It guides; it never diagnoses.**

---

## Viewing it

No build step, no dependencies — it's a self-contained static site.

**Simplest:** open `index.html` in any modern browser.

**Recommended (so internal links behave perfectly):** serve it locally.

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

The only external dependency is the **Inter** and **Newsreader** webfonts, loaded from
Google Fonts (an internet connection makes the typography render as intended; it falls
back gracefully to system fonts if offline).

---

## How it's built

Plain, durable web technology — chosen so the experience simply opens and works.

```
site_with_presentation/
├── index.html        · Chapter 01 — Vision (homepage)
├── concierge.html    · Chapter 02 — AI Medical Concierge
├── doctors.html      · Chapter 03 — Doctor Experience
├── booking.html      · Chapter 04 — Booking Experience
├── dashboard.html    · Chapter 05 — Patient Dashboard
├── styles.css        · design system — tokens, type, layout, motion
├── pages.css         · page-specific components
├── main.js           · shared behaviour (nav, scroll-reveal, mobile menu)
├── concierge.js      · the interactive concierge conversation
├── booking.js        · the interactive booking flow
└── CLAUDE.md         · the original project brief
```

### Design language
- Warm paper canvas, deep ink, a single calm jade accent
- Serif display (*Newsreader*) paired with a clean sans (*Inter*)
- Large whitespace, soft shadows, subtle gradients
- Restrained, elegant motion — reveal-on-scroll that respects
  `prefers-reduced-motion`
- Every page follows the storytelling arc: *Problem → Friction → Human Need →
  Better Experience → Future Vision*

---

## A note on scope

This is a **design and concept exploration**, not a medical product.
Doctors, messages, progress data and appointments are illustrative and fictional.
Nothing here provides medical advice or makes a real booking.
