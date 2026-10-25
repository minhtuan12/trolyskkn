// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

afterEach(() => cleanup())

const openWriterStep = (name) => {
  fireEvent.click(screen.getByRole('tab', { name }))
}

describe('Trợ lý soạn thảo theo bốn bước', () => {
  it('shows content specific to the selected step', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /ghi nhận dữ liệu thực tế/i })).toBeInTheDocument()
    expect(screen.queryByLabelText(/ý tưởng hoặc tên đề tài/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /viết toàn văn sáng kiến kinh nghiệm/i })).not.toBeInTheDocument()

    openWriterStep(/tối ưu tên đề tài/i)
    expect(screen.getByRole('heading', { name: /chọn tên đề tài rõ trọng tâm/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/ý tưởng hoặc tên đề tài/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/thuận lợi/i)).not.toBeInTheDocument()

    openWriterStep(/lập dàn ý chuẩn/i)
    expect(screen.getByRole('heading', { name: /xây dựng dàn ý a–b–c/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/các biện pháp thực hiện/i)).toBeInTheDocument()

    openWriterStep(/toàn văn skkn/i)
    expect(screen.getByRole('heading', { name: /hoàn thiện toàn văn sáng kiến/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /viết toàn văn sáng kiến kinh nghiệm/i })).toBeInTheDocument()
  })

  it('keeps teacher data while moving between steps', () => {
    render(<App />)

    openWriterStep(/tối ưu tên đề tài/i)
    const titleField = screen.getByLabelText(/ý tưởng hoặc tên đề tài/i)
    fireEvent.change(titleField, { target: { value: 'Phát triển ngôn ngữ qua kể chuyện' } })

    openWriterStep(/dữ liệu thực tế/i)
    openWriterStep(/tối ưu tên đề tài/i)

    expect(screen.getByLabelText(/ý tưởng hoặc tên đề tài/i)).toHaveValue('Phát triển ngôn ngữ qua kể chuyện')
  })

  it('marks the current step for assistive technology', () => {
    render(<App />)

    const firstStep = screen.getByRole('tab', { name: /dữ liệu thực tế/i })
    const secondStep = screen.getByRole('tab', { name: /tối ưu tên đề tài/i })

    expect(firstStep).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(secondStep)
    expect(firstStep).toHaveAttribute('aria-selected', 'false')
    expect(secondStep).toHaveAttribute('aria-selected', 'true')
  })
})
