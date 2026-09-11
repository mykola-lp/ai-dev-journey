# Frontend Design Skill — Comparison

This README describes the difference between frontend generation **with** and **without** the `frontend-design` Skill.

## With `frontend-design` Skill

The result typically has:

1. **A distinctive typeface**
   Deliberately chosen typography instead of default choices such as Inter, Roboto, or system fonts.

2. **Intentional typographic hierarchy**
   Clear type scale, deliberate weights, widths, spacing, and line lengths. Typography is treated as part of the visual design, not just a way to display text.

3. **A coherent color palette**
   Colors are selected as part of a specific visual identity rather than relying on generic gradients or default UI colors.

4. **A subject-specific composition**
   Layout and visual decisions are grounded in the actual product, industry, audience, and subject matter instead of using the same layout for every project.

5. **A distinctive visual direction**
   The design is expected to make deliberate, opinionated choices about palette, typography, and layout and to avoid cliché or templated aesthetics.

6. **Purposeful motion**
   Animation is used deliberately, usually as one orchestrated page-load or reveal moment rather than applying generic fade/slide animations everywhere.

7. **Responsive and accessible implementation**
   The implementation should work down to mobile, provide visible keyboard focus, respect reduced-motion preferences, and maintain visual accessibility.

8. **Deliberate restraint**
   One element should carry most of the visual boldness while the surrounding interface remains controlled and disciplined.

## Without `frontend-design` Skill

The result is more likely to develop a generic **"AI look"**, for example:

* Inter or another common default font;
* generic typography hierarchy;
* a standard large headline + paragraph + CTA composition;
* purple, blue, or other generic gradients;
* predictable spacing and layout proportions;
* repeated cards, rounded corners, shadows, and decorative gradients;
* generic uppercase eyebrow labels;
* unnecessary numbering such as `01 / 02 / 03`;
* `→` appended to button or link text by default;
* scattered fade/slide animations;
* decorative elements that are not connected to the actual subject matter.

## Core Principle

The `frontend-design` Skill treats frontend work more like a **design-direction exercise** than a simple HTML/CSS generation task.

The process is roughly:

**Brief → Design plan → Review for generic defaults → Revise → Build → Critique**

The initial design plan should explicitly define:

* **Color** — a compact 4–6 color palette;
* **Type** — typefaces and their roles;
* **Layout** — composition, alignment, and visual structure;
* **Principles** — what makes the page specific and memorable.

The design should then be reviewed against the brief before implementation. If a choice looks like something that would have been generated for any similar prompt, it should be reconsidered.

## Reference

Official Anthropic Claude Code `frontend-design` Skill:

https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md

Source: Anthropic, `frontend-design/SKILL.md`.
