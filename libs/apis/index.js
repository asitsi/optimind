const API_URL = process.env.NEXT_PUBLIC_APP_API

export const chatWithGPT = async (text) => {
  const response = await fetch(`${API_URL}/generateTextOpenAi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  const data = await response.json()
  return data
}

export const chatWithDeepSeek = async (text) => {
  const response = await fetch(`${API_URL}/deepseekApiCall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  const data = await response.json()
  return data
}
