# Frontend Design Comparison

## What is AI slop?

**AI slop** is a derogatory term for **mass-produced AI-generated content with low originality**. It often looks generic, predictable, and repeatedly uses the same familiar patterns.

In frontend design, for example:

**Inter + purple gradient + rounded cards + standard hero + typical fade-in animations.**

The problem is not that the design was created by AI. The problem is that it **lacks a distinctive design idea and context**.


## 1. Simple

No additional design prompts.

* Generic font such as Inter
* Standard colors and spacing
* Predictable layout
* Simple fade-in animation

**Result:** functional, but generic.

## 2. `DISTILLED_AESTHETICS_PROMPT`

Adds explicit visual-design direction.

* Distinctive visual identity
* Cohesive palette with a dominant color
* Context-specific composition
* Textured / atmospheric background
* Staggered page-load animation

**Result:** more expressive and clearly designed for the subject.

## 3. `TYPOGRAPHY_PROMPT`

Adds explicit typography direction.

* Distinctive font such as Crimson Pro, Clash Display, or Bricolage Grotesque
* Strong typographic hierarchy
* Extreme weight contrast
* Large differences in font size
* Typography becomes a major part of the visual identity

**Result:** stronger visual character driven primarily by typography.

## Real Difference

```text
Simple
Generic defaults
     ↓
Functional UI

Aesthetics
Context + color + motion
     ↓
Distinctive UI

Typography
Distinctive type + strong hierarchy
     ↓
Strong visual identity
```

The difference is not simply **more CSS or more animation**.

It is the difference between **using defaults** and making **deliberate design decisions**.
