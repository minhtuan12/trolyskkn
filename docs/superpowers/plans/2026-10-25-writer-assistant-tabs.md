# Writer Assistant Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tách Trợ lý soạn thảo thành bốn bước có chức năng riêng và thay mọi gợi ý soạn thảo bằng kho dữ liệu cục bộ, chỉ giữ Gemini cho thao tác viết toàn văn ở tab cuối.

**Architecture:** Tách kho gợi ý và các hàm chọn ngẫu nhiên/tạo dàn ý sang module thuần JavaScript để dễ kiểm thử. Giữ trạng thái nghiệp vụ trong `App.jsx`, nhưng render nội dung theo `step` và đặt vùng kết quả toàn văn bên dưới tab 4. Không thay đổi module chấm điểm.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-25-writer-assistant-tabs-design.md`

## Global Constraints

- Có khoảng 50 gợi ý cục bộ cho từng nhóm tên đề tài, thuận lợi, khó khăn và biện pháp.
- `Gợi ý`, `AI gợi ý`, tối ưu tên và lập dàn ý không gọi Gemini.
- `Mẫu sẵn` giữ nguyên hành vi.
- Chỉ tab 4 có nút **Viết toàn văn sáng kiến kinh nghiệm** và kết quả nằm bên dưới.
- Giữ nguyên mọi chức năng không thuộc Trợ lý soạn thảo.
- Giao diện responsive, điều khiển semantic và mục tiêu chạm tối thiểu 44px.

## Review Focus

- Kho gợi ý thiếu hoặc trùng quá nhiều: kiểm thử đủ số lượng, tính duy nhất và lấy mẫu không trùng.
- Người dùng mở tab sau khi dữ liệu còn thiếu: UI vẫn hoạt động, checklist chỉ hướng dẫn thay vì chặn.
- Tên/biện pháp được áp dụng làm mất nội dung đã nhập: thao tác tên thay thế có chủ đích, gợi ý đoạn văn chỉ nối thêm.
- Dàn ý sinh từ dữ liệu trống: vẫn tạo khung A–B–C có lời nhắc hoàn thiện, không lỗi.
- Chức năng chấm điểm hoặc viết toàn văn bị ảnh hưởng: kiểm thử cô lập API và chạy regression build/lint.

---

### Task 1: Kho gợi ý cục bộ và hàm tiện ích

**Files:**
- Create: `src/data/writerSuggestions.js`
- Create: `src/data/writerSuggestions.test.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `WRITER_SUGGESTIONS`, `pickRandomSuggestions(items, count, random)`, `buildLocalOutline(formData)`.

- [ ] **Step 1: Viết test thất bại** cho bốn kho có ít nhất 50 chuỗi duy nhất, lấy mẫu không trùng/không vượt kích thước kho và dàn ý A–B–C hoạt động cả khi dữ liệu trống.
- [ ] **Step 2: Chạy `npm.cmd test -- src/data/writerSuggestions.test.js` và xác nhận FAIL** vì module chưa tồn tại.
- [ ] **Step 3: Cài Vitest và tạo module dữ liệu/hàm thuần** với nội dung mầm non tiếng Việt có cấu trúc.
- [ ] **Step 4: Chạy lại test và xác nhận PASS.**

### Task 2: Tách giao diện và hành vi bốn tab

**Files:**
- Modify: `src/App.jsx`
- Create: `src/App.writer.test.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `WRITER_SUGGESTIONS`, `pickRandomSuggestions`, `buildLocalOutline` từ Task 1.
- Produces: bốn tab có panel riêng, giữ chung `formData` và navigation theo bước.

- [ ] **Step 1: Viết test thất bại** xác nhận mỗi tab chỉ hiện trường/hành động của nó, dữ liệu được giữ khi đổi tab, và nút viết toàn văn chỉ có ở tab 4.
- [ ] **Step 2: Chạy test mục tiêu và xác nhận FAIL** với giao diện hiện tại.
- [ ] **Step 3: Render bốn panel riêng trong `App.jsx`**; thêm tiêu đề/mô tả bước, checklist hoàn thiện, điều hướng tiếp/lùi và hành vi responsive/accessibility.
- [ ] **Step 4: Chạy test mục tiêu và xác nhận PASS.**

### Task 3: Thay gợi ý AI bằng kho cục bộ và tạo dàn ý offline

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.writer.test.jsx`

**Interfaces:**
- Consumes: kho và hàm tiện ích từ Task 1.
- Produces: `handleSuggestField`, tối ưu tên và lập dàn ý không còn gọi `callGemini`; `handleGenerateFullText` vẫn gọi API.

- [ ] **Step 1: Viết test thất bại** xác nhận gợi ý tên/thuận lợi/khó khăn/biện pháp và lập dàn ý không gọi `fetch`, trong khi viết toàn văn vẫn gọi `/api/gemini`.
- [ ] **Step 2: Chạy test mục tiêu và xác nhận FAIL** ở các handler hiện gọi Gemini.
- [ ] **Step 3: Chuyển các handler sang chọn ngẫu nhiên/tạo nội dung cục bộ**; giữ `Mẫu sẵn`, thêm áp dụng từng mục/thêm tất cả/xóa danh sách.
- [ ] **Step 4: Chạy test mục tiêu và xác nhận PASS.**

### Task 4: Kết quả tab cuối, tài liệu thiết kế và xác minh

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Create or reconcile: `DESIGN.md`
- Modify: `docs/superpowers/specs/2026-10-25-writer-assistant-tabs-design.md` only if implementation exposes an approved durable decision.

**Interfaces:**
- Consumes: luồng tab từ Tasks 2–3.
- Produces: tab 4 có tổng hợp đầu vào, CTA duy nhất và kết quả bên dưới với các công cụ hiện có.

- [ ] **Step 1: Bổ sung test thất bại** cho trạng thái chưa có kết quả/có kết quả và các công cụ sao chép, tải Word, chuyển sang chấm điểm.
- [ ] **Step 2: Chạy test và xác nhận FAIL** trước khi đổi bố cục kết quả.
- [ ] **Step 3: Hoàn thiện bố cục tab 4 và ghi nhận token/interaction bền vững trong `DESIGN.md`** mà không đổi nhận diện hiện có.
- [ ] **Step 4: Chạy `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`.**
- [ ] **Step 5: Chạy audit Frontend Design Premium ở chế độ strict và kiểm tra các anti-pattern liên quan.**
- [ ] **Step 6: Kiểm tra trình duyệt desktop/mobile, bàn phím, chuyển tab, lấy gợi ý, tạo dàn ý và viết toàn văn; ghi rõ giới hạn nếu không có khóa Gemini.**
