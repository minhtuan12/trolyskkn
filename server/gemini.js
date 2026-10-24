const GEMINI_MODEL = 'gemini-3.8-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export async function generateGeminiContent({ prompt, systemInstruction = '' }, apiKey) {
  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY is not configured on the server.')
    error.statusCode = 500
    throw error
  }

  if (typeof prompt !== 'string' || !prompt.trim()) {
    const error = new Error('Prompt is required.')
    error.statusCode = 400
    throw error
  }

  const upstreamResponse = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    }),
  })

  const data = await upstreamResponse.json()

  if (!upstreamResponse.ok) {
    const error = new Error(data?.error?.message || 'Gemini request failed.')
    error.statusCode = upstreamResponse.status
    throw error
  }

  return data
}
