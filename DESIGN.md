---
version: alpha
name: "Hệ thống SKKN Mầm non Tô Hiến Thành"
description: "Quy trình soạn thảo thân thiện như sổ tay giáo viên, với cấu trúc hành chính rõ ràng và sắc xanh giáo dục."
colors:
  primary: "#047857"
  primaryStrong: "#065f46"
  secondary: "#0369a1"
  accent: "#0f766e"
  danger: "#be123c"
  canvas: "#f8fafc"
  surface: "#ffffff"
  text: "#0f172a"
  textMuted: "#475569"
typography:
  sans:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    lineHeight: "1.5"
rounded:
  control: "0.75rem"
  card: "1rem"
  feature: "2rem"
spacing:
  compact: "0.5rem"
  control: "0.75rem"
  section: "1.25rem"
  page: "1.5rem"
components:
  workflowTabs: { }
  formControl: { }
  resultPanel: { }
---

# SKKN Product Design Context

## Overview

The product is a supportive, school-facing writing tool for preschool teachers. Its North Star is a well-organized teacher workbook: warm enough to feel encouraging, structured enough for formal professional documents. The signature is the green-to-blue four-step path that turns a long administrative form into a visible progression. Avoid generic AI-chat styling, dark dashboards, glass-heavy surfaces, and decorative effects that compete with Vietnamese educational content.

This is a product surface, so task clarity and predictable form behavior take priority over visual novelty. The existing emerald, teal, sky, rose, and slate language remains authoritative; this feature does not rebrand the evaluator module.

## Colors

Emerald is the primary action and progress color. Sky distinguishes naming/idea work, teal distinguishes structure and measures, rose marks difficulty content rather than destructive action, and amber is reserved for review/readiness cues. Tailwind utilities in source are the runtime owner; the frontmatter records their durable semantic mapping.

## Typography

Use the existing system sans stack for reliable Vietnamese rendering. Body copy starts at 14px in compact application panels, labels may use 12px with strong weight, and primary page/step headings use 20px. Long generated text uses relaxed line height and never italicizes body copy by default.

## Layout

Use a natural-height document flow. Each active step owns its content and the final result follows the generation controls in the same panel. Desktop forms may use two or three columns; narrow screens collapse to one column. Horizontal overflow is allowed only for the four-step navigation, never for form content.

## Elevation & Depth

Use borders for grouping and one restrained shadow level for workflow cards and generated-result panels. Do not stack multiple elevated cards without a semantic grouping reason.

## Shapes

Controls use 12px radii, content groups use 16px, and major workflow surfaces may use 32px to match the established playful preschool identity. Pills are reserved for short statuses.

## Components

- Workflow tabs are native buttons with tab semantics, visible selected/focus states, Left/Right Arrow navigation, and a minimum 44px target.
- Form controls retain native text/select behavior, explicit labels, visible focus, at least 44px height, and non-resizable textareas with sufficient initial height.
- Suggestions are local catalog choices. Copy must say “gợi ý có sẵn” or “không dùng API AI” where provenance matters.
- The generated result is a polite live region. Export, copy, and evaluation actions remain disabled until content exists.
- The native quality select is intentional: the application accepts platform-owned popup geometry and keyboard behavior.

## Do's and Don'ts

- Do keep one primary action per step and preserve entered data while navigating.
- Do use plain Vietnamese labels that describe the resulting action.
- Do keep Gemini-specific loading and errors only on the final full-text generation path.
- Don't describe local catalog selection as newly generated AI content.
- Don't place “Viết toàn văn” outside step 4 or in a separate fixed-height column.
- Don't change evaluator behavior or visual identity as part of writer workflow work.
