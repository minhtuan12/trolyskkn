# UX Contract

## Product context

- Audience: giáo viên mầm non soạn và tự rà soát sáng kiến kinh nghiệm.
- Primary job: đi từ dữ liệu lớp học đến tên đề tài, dàn ý và toàn văn mà không nhập lại dữ liệu.
- Target market: Việt Nam; nội dung hiện tại của sản phẩm và yêu cầu người dùng là bằng tiếng Việt.
- Active locale: `vi-VN`.
- Accessibility target: WCAG 2.2 AA.

## Business-context sources

Không có PRD, ADR, hợp đồng API hoặc chính sách quyền riêng tư được duy trì trong repository cho luồng soạn thảo. Yêu cầu hiện tại của người dùng là nguồn thẩm quyền cho việc tách bốn bước và chuyển gợi ý sang dữ liệu cục bộ. API `/api/gemini` và module chấm điểm là bằng chứng triển khai được giữ nguyên, không phải chính sách nghiệp vụ mới.

## Visual contract

- Project `DESIGN.md`: `DESIGN.md`.
- Token ownership: Tailwind utilities hiện có là runtime canonical; `DESIGN.md` ghi lại vai trò ngữ nghĩa và mapping bền vững.
- Supported theme: light.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native HTML `select` in `WriterAssistant` | `DESIGN.md` + `premium-ui.json` | native | keyboard + platform popup |
| Form | Labeled native controls in `WriterAssistant` | `src/components/WriterAssistant.jsx` | writer step 1 / 2 / 3 / 4 | component tests + browser |
| Scrollbar | Global application stylesheet | `src/index.css` + `DESIGN.md` | stable geometry exceptions | computed style + browser |
| Toast | Existing `showNotification` owner in `App` | `src/App.jsx` | success / info / error | component + browser |

## Component behavior

| Component | Default | Hover | Focus | Active | Disabled | Busy | Error |
|---|---|---|---|---|---|---|---|
| Button | semantic label, 44px target | tonal change | visible outline | native press | dimmed + blocked | stable label region | inline/toast guidance |
| Input | explicit label | border stable | primary ring | n/a | native | n/a | associated text when validation is added |
| Textarea | resize none, sufficient height | border stable | primary ring | n/a | native | n/a | preserve entered text |
| Workflow tabs | all steps available | tonal change | visible outline | selected gradient | n/a | n/a | n/a |

## Flow ledger

| Operation | Trigger | Pending | Success destination | Success feedback | Failure recovery | Focus outcome | Source ref |
|---|---|---|---|---|---|---|---|
| Local suggestion | Gợi ý / AI gợi ý | immediate local selection | same step | local-catalog toast | request another random set | trigger remains available | User request 2026-10-25 |
| Local outline | Tạo dàn ý chuẩn | immediate local composition | step 3 result | local-outline toast | edit inputs and regenerate | result follows trigger | User request 2026-10-25 |
| Full text | Viết toàn văn at step 4 | stable disabled CTA + message | result below CTA | result live region | existing bounded retry + error message | remains in step 4 | Existing `/api/gemini` contract |
| Cancel/back | Step tab or previous button | n/a | requested step | data preserved | n/a | selected tab | User request 2026-10-25 |

## Navigation and responsive behavior

- Four steps use one tab list; Left/Right Arrow moves selection and focus.
- Steps remain directly accessible and do not hard-block incomplete data.
- Narrow screens use natural document scrolling and one-column fields; the tab list may scroll horizontally.
- Full text and its actions live below the step-4 inputs, never in a fixed-height sibling column.

## Async and resilience

- Local suggestions and outline have no network, retry, stale-response, or offline dependency.
- Full-text generation keeps the existing bounded retry behavior and prevents duplicate submit by disabling the CTA while loading.
- Errors preserve all entered form data and leave the generation action available after pending state clears.

## Validation

- The workflow provides completion guidance rather than blocking navigation.
- Native labels and input semantics are required; textareas are non-resizable with adequate height.
- Full-text generation accepts partial data as the existing product did; this task does not add new business validation rules.

## Permission and clipboard

- No role-specific permission behavior is introduced.
- Copy is disabled until a result exists and copies the complete generated text; toast copy never contains document content.

## Verification

- Required commands: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`.
- Static audit: Frontend Design Premium `audit_project.py --mode strict`.
- Browser matrix: desktop and narrow viewport; click and keyboard tab navigation; local suggestions, outline, empty/loading/success/error full-text states.
- Component evidence: `src/App.writer.test.jsx` and `src/data/writerSuggestions.test.js`.
