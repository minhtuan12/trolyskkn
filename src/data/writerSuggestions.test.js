import { describe, expect, it } from 'vitest'
import {
  WRITER_SUGGESTIONS,
  buildLocalOutline,
  pickRandomSuggestions,
} from './writerSuggestions.js'

describe('WRITER_SUGGESTIONS', () => {
  it.each(['titles', 'advantages', 'difficulties', 'measures'])(
    'provides at least 50 unique, usable %s suggestions',
    (group) => {
      const suggestions = WRITER_SUGGESTIONS[group]

      expect(suggestions.length).toBeGreaterThanOrEqual(50)
      expect(new Set(suggestions).size).toBe(suggestions.length)
      expect(suggestions.every((item) => typeof item === 'string' && item.trim().length > 20)).toBe(true)
    },
  )
})

describe('pickRandomSuggestions', () => {
  it('returns a unique subset without changing the source collection', () => {
    const source = ['a', 'b', 'c', 'd']
    const original = [...source]

    const picked = pickRandomSuggestions(source, 3, () => 0)

    expect(picked).toEqual(['a', 'b', 'c'])
    expect(new Set(picked).size).toBe(3)
    expect(source).toEqual(original)
  })

  it('never returns more suggestions than the source contains', () => {
    expect(pickRandomSuggestions(['a', 'b'], 6, () => 0.5)).toHaveLength(2)
  })
})

describe('buildLocalOutline', () => {
  it('builds the standard A-B-C outline from teacher data', () => {
    const outline = buildLocalOutline({
      title: 'Phát triển ngôn ngữ qua kể chuyện sáng tạo',
      audience: 'Trẻ 4 - 5 tuổi',
      advantages: 'Phụ huynh phối hợp tốt.',
      difficulties: 'Trẻ còn rụt rè.',
      measures: 'Xây dựng góc kể chuyện mở.',
      results: 'Trẻ tự tin giao tiếp hơn.',
    })

    expect(outline).toContain('A. ĐẶT VẤN ĐỀ')
    expect(outline).toContain('B. GIẢI QUYẾT VẤN ĐỀ')
    expect(outline).toContain('C. KẾT LUẬN VÀ KIẾN NGHỊ')
    expect(outline).toContain('Phát triển ngôn ngữ qua kể chuyện sáng tạo')
    expect(outline).toContain('Xây dựng góc kể chuyện mở.')
  })

  it('keeps a useful A-B-C scaffold when teacher data is still empty', () => {
    const outline = buildLocalOutline({})

    expect(outline).toContain('[Bổ sung tên đề tài]')
    expect(outline).toContain('[Bổ sung thuận lợi thực tế]')
    expect(outline).toContain('[Bổ sung các biện pháp thực hiện]')
  })
})
