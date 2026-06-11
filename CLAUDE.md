# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---



# PROJECT: Future Healthcare Experience

## Project Vision

Future Healthcare Experience is an independent concept study exploring how healthcare could evolve when patient needs become the starting point of every interaction.

This is not a clinic website.

This is not a healthcare SaaS.

This is not a patient portal.

This project explores a future where healthcare systems are designed around people rather than organizational structures.

The project investigates how design, digital guidance and intelligent systems can reduce uncertainty and improve the patient experience.

---

# Core Philosophy

Most patients do not think in:

* departments
* specialties
* clinical pathways
* healthcare administration

Patients think in:

* symptoms
* concerns
* questions
* outcomes

Current healthcare systems are often optimized around internal structures.

Future Healthcare Experience explores what happens when healthcare is optimized around the patient journey instead.

---

# Main Concept

Healthcare designed around people.

The central problem addressed by the project is uncertainty.

Patients often do not know:

* which specialist they need
* where to begin
* what happens next
* which documents are required
* how treatment will unfold

The purpose of the concept is to move patients from:

Uncertainty → Clarity

Anxiety → Confidence

Confusion → Guidance

Fragmentation → Continuity

---

# Emotional Design Principles

Every screen should feel:

* calm
* intelligent
* premium
* reassuring
* human-centered
* trustworthy

The project should never feel:

* corporate
* bureaucratic
* intimidating
* clinical
* robotic
* overwhelming

Design should reduce cognitive load.

The patient should feel guided rather than instructed.

---

# Design References

Primary references:

* Apple
* IDEO
* Linear
* Stripe
* Modern luxury healthcare brands
* Concierge medicine experiences

Avoid:

* traditional hospital websites
* enterprise dashboards
* generic chatbot interfaces
* SaaS marketing pages

---

# Visual Language

Use:

* large whitespace
* premium typography
* subtle gradients
* soft shadows
* restrained animations
* elegant motion
* calm visual hierarchy

The visual experience should feel closer to Apple Health than hospital administration software.

---

# Project Structure

The project is a journey.

Each page represents a chapter in the future healthcare experience.

---

## Chapter 1

Homepage

Purpose:

Introduce the vision.

Key message:

Healthcare designed around people.

Homepage answers:

Why should healthcare change?

---

## Chapter 2

AI Medical Concierge

Purpose:

Create a new entry point into healthcare.

Patients begin with symptoms rather than departments.

The concierge acts as a healthcare navigator.

Important:

It does not diagnose.

It guides.

Core message:

Healthcare should begin with understanding.

AI Concierge answers:

How does future healthcare begin?

---

## Chapter 3

Doctor Experience

Purpose:

Build trust before the first appointment.

Patients should understand:

* who the doctor is
* how they think
* what conditions they treat
* what to expect

Focus on:

Human connection.

Not credentials alone.

Doctor Experience answers:

Who will help me?

---

## Chapter 4

Booking Experience

Purpose:

Remove friction.

The booking process should feel effortless.

Avoid:

* complex forms
* confusing scheduling systems
* administrative burden

Booking Experience answers:

How do I take the next step?

---

## Chapter 5

Patient Dashboard

Purpose:

Extend care beyond the appointment.

Focus on:

* recovery
* follow-up
* continuity
* communication
* progress tracking

Patient Dashboard answers:

What happens after treatment begins?

---

# AI Medical Concierge Principles

This is the most important page in the entire project.

The concierge is not a chatbot.

The concierge is not ChatGPT.

The concierge is not a virtual doctor.

The concierge is a healthcare navigation experience.

Patient enters:

"I have neck pain and headaches."

The concierge:

* asks relevant questions
* reduces uncertainty
* identifies possible care pathways
* recommends specialists
* prepares the patient for the next step

The concierge never diagnoses.

The concierge organizes care.

---

# International Patient Experience

Many premium clinics serve international patients.

The project should demonstrate:

* multilingual support
* medical document upload
* translation assistance
* treatment planning before travel
* coordinated care journeys

The experience should feel effortless.

---

# Storytelling Framework

Every page should follow:

1. Problem
2. Friction
3. Human Need
4. Better Experience
5. Future Vision

Never jump directly into features.

Always begin with the patient.

---

# Writing Style

Tone:

* intelligent
* calm
* optimistic
* sophisticated
* human

Avoid:

* hype
* AI buzzwords
* startup language
* technical jargon
* corporate clichés

Preferred language:

"guidance"

"clarity"

"confidence"

"support"

"continuity"

"understanding"

Avoid overusing:

"AI"

"machine learning"

"automation"

"disruption"

---

# Homepage Hero

Headline:

Healthcare designed around people.

Supporting message:

Most patients don't think in specialties, departments or clinical pathways.

They think in symptoms, concerns and outcomes.

This concept explores what healthcare could look like if the system adapted to people instead — guiding them from uncertainty to clarity through one connected experience.

---

# Ultimate Goal

The visitor should leave the experience with a single thought:

"I would feel calmer if healthcare worked this way."

Every design decision, interaction, animation and piece of copy should support that outcome.

---

# TECHNOLOGY STACK

Framework:

Next.js 14+ App Router

Language:

TypeScript

Styling:

Tailwind CSS

Animations:

Framer Motion

Icons:

Lucide React

Fonts:

Inter

или

Geist

Deployment:

Netlify

SEO:

Next Metadata API

Responsive:

Mobile First

---

# GLOBAL DESIGN SYSTEM

Background
Основной фон:
very light neutral
HEX:
#F8F8F6
или
rgb(248,248,246)

Сайт НЕ использует чистый белый фон.

Primary Text
HEX:
#111111

Font Weight:
500-700
Secondary Text
HEX:
#6B7280

Accent Color
Медицинский мягкий зелёный:
HEX:
#6EE7B7
Дополнительные оттенки:
#34D399
#10B981

Border Color
HEX:
rgba(0,0,0,0.08)

Radius
Все элементы:
border-radius: 24px

Карточки:
20px–32px
Shadows

Очень мягкие:
box-shadow:
0 8px 40px rgba(0,0,0,0.06)

LAYOUT
Максимальная ширина контента:
1280px
Container:
max-width: 1280px
margin: auto
padding-inline: 32px

На мобильных:
padding-inline: 20px
HEADER
Sticky Header

Высота:
80px
Backdrop Blur
background:
rgba(248,248,246,0.8)
backdrop-filter:
blur(20px)

Navigation:
Vision
Journey
Concierge

Справа:
CTA Button
"Explore Experience"

