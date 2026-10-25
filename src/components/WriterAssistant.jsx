import React from 'react'

const STEPS = [
  { id: 1, label: 'Dữ liệu thực tế', icon: '📝' },
  { id: 2, label: 'Tối ưu tên đề tài', icon: '💡' },
  { id: 3, label: 'Lập dàn ý chuẩn', icon: '🏗️' },
  { id: 4, label: 'Toàn văn SKKN', icon: '🏆' },
]

const fieldClass =
  'min-h-11 w-full rounded-xl border-2 border-emerald-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100'

function SuggestionList({ items, tone, onAdd, onAddAll, onClear }) {
  if (!items.length) return null

  const toneClass = tone === 'rose' ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'

  return (
    <div className={`mt-3 rounded-2xl border p-3 ${toneClass}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-black text-slate-700">Chọn nội dung phù hợp để thêm</p>
        <div className="flex gap-2">
          <button type="button" onClick={onAddAll} className="min-h-11 rounded-lg px-2 text-xs font-black text-emerald-800 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            Thêm tất cả
          </button>
          <button type="button" onClick={onClear} className="min-h-11 rounded-lg px-2 text-xs font-bold text-slate-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
            Đóng
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <button type="button" onClick={() => onAdd(item)} className="w-full rounded-xl bg-white p-3 text-left text-xs font-semibold leading-relaxed text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
              <span aria-hidden="true" className="mr-2 text-emerald-600">＋</span>{item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepActions({ step, setStep }) {
  return (
    <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4">
      {step > 1 ? (
        <button type="button" onClick={() => setStep(step - 1)} className="min-h-11 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          ← Bước trước
        </button>
      ) : <span />}
      {step < 4 && (
        <button type="button" onClick={() => setStep(step + 1)} className="min-h-11 rounded-xl bg-emerald-700 px-5 text-sm font-black text-white shadow-md hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          Tiếp tục: {STEPS[step].label} →
        </button>
      )}
    </div>
  )
}

export default function WriterAssistant({
  step,
  setStep,
  formData,
  setFormData,
  level,
  setLevel,
  result,
  loading,
  loadingMessage,
  advSuggestions,
  diffSuggestions,
  measureSuggestions,
  titleSuggestions,
  outline,
  suggestingField,
  onSuggestField,
  onAppendSuggestion,
  onAppendAllSuggestions,
  onPresetSuggestions,
  onOptimizeTitle,
  onGenerateOutline,
  onApplyTitle,
  onClearSuggestions,
  onGenerateFullText,
  onExportWord,
  onTransferToEvaluator,
  onCopyResult,
  onOpenTemplates,
}) {
  const workflowId = React.useId()
  const [titleTopic, setTitleTopic] = React.useState('')
  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }))

  return (
    <section className="space-y-5" aria-labelledby={`${workflowId}-title`}>
      <div className="rounded-3xl border-2 border-emerald-200 bg-white/95 p-4 shadow-lg">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Quy trình soạn thảo</p>
            <h2 id={`${workflowId}-title`} className="mt-1 text-xl font-black text-slate-900">Hoàn thiện sáng kiến theo 4 bước</h2>
          </div>
          <p className="text-xs font-semibold text-slate-500">Dữ liệu được giữ nguyên khi chuyển bước</p>
        </div>
        <div role="tablist" aria-label="Các bước soạn thảo sáng kiến" className="grid min-w-max grid-cols-4 gap-2 overflow-x-auto pb-1">
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={step === item.id}
              aria-controls={`writer-panel-${item.id}`}
              id={`writer-tab-${item.id}`}
              onClick={() => setStep(item.id)}
              onKeyDown={(event) => {
                const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
                if (!direction) return
                event.preventDefault()
                const nextStep = ((item.id - 1 + direction + STEPS.length) % STEPS.length) + 1
                setStep(nextStep)
                requestAnimationFrame(() => document.getElementById(`writer-tab-${nextStep}`)?.focus())
              }}
              className={`min-h-11 rounded-xl px-4 py-2 text-left text-xs font-black transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${step === item.id ? 'bg-gradient-to-r from-emerald-700 to-sky-700 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}`}
            >
              <span aria-hidden="true" className="mr-2 text-base">{item.icon}</span>
              {item.id}. {item.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id={`writer-panel-${step}`} aria-labelledby={`writer-tab-${step}`} className="rounded-[2rem] border-2 border-emerald-200 bg-white p-5 shadow-xl md:p-7">
        {step === 1 && (
          <div className="space-y-5">
            <header>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Bước 1 · Nền tảng thực tế</p>
              <h3 className="mt-1 text-xl font-black text-slate-900">Ghi nhận dữ liệu thực tế</h3>
              <p className="mt-1 text-sm text-slate-600">Thông tin càng cụ thể, tên đề tài, dàn ý và bài viết sau đó càng sát lớp học.</p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div><label htmlFor="writer-author" className="mb-1 block text-xs font-black text-slate-700">Tác giả</label><input id="writer-author" className={fieldClass} value={formData.author} onChange={(event) => updateField('author', event.target.value)} /></div>
              <div><label htmlFor="writer-school" className="mb-1 block text-xs font-black text-slate-700">Đơn vị</label><input id="writer-school" className={fieldClass} value={formData.school} onChange={(event) => updateField('school', event.target.value)} /></div>
              <div><label htmlFor="writer-year" className="mb-1 block text-xs font-black text-slate-700">Năm học</label><input id="writer-year" className={fieldClass} value={formData.schoolYear} onChange={(event) => updateField('schoolYear', event.target.value)} /></div>
              <div><label htmlFor="writer-field" className="mb-1 block text-xs font-black text-slate-700">Lĩnh vực</label><input id="writer-field" className={fieldClass} value={formData.field} onChange={(event) => updateField('field', event.target.value)} placeholder="Ví dụ: Phát triển ngôn ngữ" /></div>
              <div><label htmlFor="writer-audience" className="mb-1 block text-xs font-black text-slate-700">Đối tượng trẻ</label><input id="writer-audience" className={fieldClass} value={formData.audience} onChange={(event) => updateField('audience', event.target.value)} placeholder="Ví dụ: Trẻ 4 - 5 tuổi" /></div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/60 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><label htmlFor="writer-advantages" className="text-sm font-black text-emerald-900">Thuận lợi</label><div className="flex gap-2"><button type="button" onClick={() => onPresetSuggestions('advantages')} className="min-h-11 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-800">Mẫu sẵn</button><button type="button" onClick={() => onSuggestField('advantages')} className="min-h-11 rounded-lg bg-emerald-700 px-3 text-xs font-black text-white">{suggestingField === 'advantages' ? 'Đang chọn…' : 'Gợi ý'}</button></div></div>
                <textarea id="writer-advantages" className={`${fieldClass} min-h-36 resize-none`} value={formData.advantages} onChange={(event) => updateField('advantages', event.target.value)} />
                <SuggestionList items={advSuggestions} onAdd={(text) => onAppendSuggestion('advantages', text)} onAddAll={() => onAppendAllSuggestions('advantages', advSuggestions)} onClear={() => onClearSuggestions('advantages')} />
              </div>
              <div className="rounded-2xl border-2 border-rose-100 bg-rose-50/60 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><label htmlFor="writer-difficulties" className="text-sm font-black text-rose-900">Khó khăn</label><div className="flex gap-2"><button type="button" onClick={() => onPresetSuggestions('difficulties')} className="min-h-11 rounded-lg border border-rose-200 bg-white px-3 text-xs font-bold text-rose-800">Mẫu sẵn</button><button type="button" onClick={() => onSuggestField('difficulties')} className="min-h-11 rounded-lg bg-rose-700 px-3 text-xs font-black text-white">{suggestingField === 'difficulties' ? 'Đang chọn…' : 'Gợi ý'}</button></div></div>
                <textarea id="writer-difficulties" className={`${fieldClass} min-h-36 resize-none border-rose-200 focus:border-rose-600 focus:ring-rose-100`} value={formData.difficulties} onChange={(event) => updateField('difficulties', event.target.value)} />
                <SuggestionList items={diffSuggestions} tone="rose" onAdd={(text) => onAppendSuggestion('difficulties', text)} onAddAll={() => onAppendAllSuggestions('difficulties', diffSuggestions)} onClear={() => onClearSuggestions('difficulties')} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div><label htmlFor="writer-before" className="mb-1 block text-xs font-black text-slate-700">Khảo sát trước áp dụng</label><textarea id="writer-before" className={`${fieldClass} min-h-24 resize-none`} value={formData.surveyBefore} onChange={(event) => updateField('surveyBefore', event.target.value)} placeholder="Số trẻ, tiêu chí và tỷ lệ ban đầu" /></div>
              <div><label htmlFor="writer-after" className="mb-1 block text-xs font-black text-slate-700">Khảo sát sau áp dụng</label><textarea id="writer-after" className={`${fieldClass} min-h-24 resize-none`} value={formData.surveyAfter} onChange={(event) => updateField('surveyAfter', event.target.value)} placeholder="Kết quả đối chứng sau khi áp dụng" /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <header className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">Bước 2 · Trọng tâm sáng kiến</p><h3 className="mt-1 text-xl font-black text-slate-900">Chọn tên đề tài rõ trọng tâm</h3><p className="mt-1 text-sm text-slate-600">Tên tốt nêu rõ giải pháp, nhóm trẻ và kết quả giáo dục cần cải thiện.</p></div><button type="button" onClick={onOpenTemplates} className="min-h-11 rounded-xl border-2 border-sky-200 bg-sky-50 px-4 text-xs font-black text-sky-800 hover:bg-sky-100">Mẫu đề tài hay</button></header>
            <div><label htmlFor="writer-title" className="mb-1 block text-sm font-black text-slate-800">Ý tưởng hoặc tên đề tài</label><textarea id="writer-title" className={`${fieldClass} min-h-28 resize-none`} value={formData.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Nhập ý tưởng cốt lõi hoặc chọn một gợi ý bên dưới" /></div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div><label htmlFor="writer-title-topic" className="mb-1 block text-sm font-black text-slate-800">Chủ đề gợi ý</label><select id="writer-title-topic" className={fieldClass} value={titleTopic} onChange={(event) => setTitleTopic(event.target.value)}><option value="">Tất cả chủ đề</option><option value="ngôn ngữ">Ngôn ngữ và kể chuyện</option><option value="STEAM">Giáo dục STEAM</option><option value="tự phục vụ">Kỹ năng tự phục vụ</option><option value="cảm xúc">Cảm xúc tích cực</option><option value="vận động tinh">Vận động tinh</option><option value="thiên nhiên">Khám phá thiên nhiên</option><option value="dinh dưỡng">Dinh dưỡng</option><option value="thẩm mỹ">Thẩm mỹ và tạo hình</option><option value="phụ huynh">Phối hợp phụ huynh</option><option value="công nghệ số">Công nghệ số an toàn</option></select></div>
              <button type="button" onClick={() => onOptimizeTitle(titleTopic)} className="min-h-11 rounded-xl bg-sky-700 px-5 text-sm font-black text-white shadow hover:bg-sky-800">Gợi ý 6 tên đề tài</button>
            </div>
            {titleSuggestions.length > 0 && (
              <div className="grid gap-3 lg:grid-cols-2">
                {titleSuggestions.map((title) => (
                  <article key={title} className="rounded-2xl border-2 border-sky-100 bg-sky-50/60 p-4">
                    <p className="text-sm font-bold leading-relaxed text-slate-800">{title}</p>
                    <button type="button" aria-label={`Áp dụng tên đề tài: ${title}`} onClick={() => onApplyTitle(title)} className="mt-3 min-h-11 rounded-xl bg-white px-3 text-xs font-black text-sky-800 shadow-sm hover:bg-sky-100">Áp dụng tên đề tài</button>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <header><p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Bước 3 · Cấu trúc giải pháp</p><h3 className="mt-1 text-xl font-black text-slate-900">Xây dựng dàn ý A–B–C</h3><p className="mt-1 text-sm text-slate-600">Sắp xếp biện pháp và minh chứng trước khi tạo bản toàn văn.</p></header>
            <div className="rounded-2xl border-2 border-teal-100 bg-teal-50/60 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><label htmlFor="writer-measures" className="text-sm font-black text-teal-900">Các biện pháp thực hiện</label><div className="flex gap-2"><button type="button" onClick={() => onPresetSuggestions('measures')} className="min-h-11 rounded-lg border border-teal-200 bg-white px-3 text-xs font-bold text-teal-800">Biện pháp mẫu</button><button type="button" onClick={() => onSuggestField('measures')} className="min-h-11 rounded-lg bg-teal-700 px-3 text-xs font-black text-white">{suggestingField === 'measures' ? 'Đang chọn…' : 'AI gợi ý'}</button></div></div>
              <textarea id="writer-measures" className={`${fieldClass} min-h-40 resize-none`} value={formData.measures} onChange={(event) => updateField('measures', event.target.value)} />
              <SuggestionList items={measureSuggestions} onAdd={(text) => onAppendSuggestion('measures', text)} onAddAll={() => onAppendAllSuggestions('measures', measureSuggestions)} onClear={() => onClearSuggestions('measures')} />
            </div>
            <div><label htmlFor="writer-results" className="mb-1 block text-sm font-black text-slate-800">Kết quả và minh chứng dự kiến</label><textarea id="writer-results" className={`${fieldClass} min-h-28 resize-none`} value={formData.results} onChange={(event) => updateField('results', event.target.value)} placeholder="Chuyển biến ở trẻ, giáo viên, phụ huynh và khả năng nhân rộng" /></div>
            <button type="button" onClick={onGenerateOutline} className="min-h-11 rounded-xl bg-teal-700 px-5 text-sm font-black text-white shadow hover:bg-teal-800">Tạo dàn ý chuẩn</button>
            {outline && (
              <section aria-labelledby="outline-title" className="rounded-2xl border-2 border-teal-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h4 id="outline-title" className="font-black text-teal-900">Dàn ý được tạo tại máy</h4><span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">Không dùng API AI</span></div>
                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{outline}</div>
              </section>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <header><p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Bước 4 · Bản thảo hoàn chỉnh</p><h3 className="mt-1 text-xl font-black text-slate-900">Hoàn thiện toàn văn sáng kiến</h3><p className="mt-1 text-sm text-slate-600">Rà soát dữ liệu đầu vào rồi tạo toàn văn. Đây là thao tác duy nhất còn sử dụng Gemini.</p></header>
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-2">
              <p><strong>Đề tài:</strong> {formData.title || 'Chưa chọn'}</p><p><strong>Đối tượng:</strong> {formData.audience || 'Chưa nhập'}</p><p><strong>Lĩnh vực:</strong> {formData.field || 'Chưa nhập'}</p><p><strong>Biện pháp:</strong> {formData.measures ? `${formData.measures.split('\n').filter(Boolean).length} nội dung` : 'Chưa nhập'}</p>
            </div>
            <div className="max-w-sm"><label htmlFor="writer-level" className="mb-1 block text-sm font-black text-slate-800">Mức chất lượng mong muốn</label><select id="writer-level" className={fieldClass} value={level} onChange={(event) => setLevel(event.target.value)}><option>Tốt</option><option>Xuất sắc</option><option>Cấp huyện / thành phố</option></select></div>
            <button type="button" onClick={onGenerateFullText} disabled={loading} className="min-h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 px-5 py-3 text-sm font-black text-white shadow-xl transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
              {loading ? loadingMessage : 'Viết toàn văn sáng kiến kinh nghiệm'}
            </button>

            <p role="status" aria-live="polite" className="sr-only">{result ? 'Đã tạo xong toàn văn sáng kiến.' : ''}</p>
            <section role="region" aria-labelledby="writer-result-title" className="overflow-hidden rounded-3xl border-2 border-emerald-200 bg-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50 p-4"><h4 id="writer-result-title" className="font-black text-emerald-900">Kết quả toàn văn</h4><div className="flex flex-wrap gap-2"><button type="button" onClick={onTransferToEvaluator} disabled={!result} className="min-h-11 rounded-xl border border-emerald-200 bg-white px-3 text-xs font-black text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">Chuyển sang chấm điểm</button><button type="button" onClick={onExportWord} disabled={!result} className="min-h-11 rounded-xl bg-blue-700 px-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50">Tải file Word</button><button type="button" onClick={onCopyResult} disabled={!result} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Sao chép</button></div></div>
              <div className="min-h-72 p-5 md:p-7">{result ? <div className="whitespace-pre-wrap text-sm leading-7 text-slate-800">{result}</div> : <div className="flex min-h-60 flex-col items-center justify-center text-center text-slate-500"><span aria-hidden="true" className="text-4xl">✍️</span><p className="mt-3 font-black text-slate-700">Chưa có bản toàn văn</p><p className="mt-1 max-w-lg text-sm">Hoàn thiện ba bước trước, sau đó dùng nút viết toàn văn ở phía trên.</p></div>}</div>
            </section>
          </div>
        )}

        <StepActions step={step} setStep={setStep} />
      </div>
    </section>
  )
}
