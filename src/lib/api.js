const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function getApiBase() {
  return API_BASE
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try {
      const data = await res.json()
      msg = data.detail || data.message || msg
    } catch {}
    throw new Error(msg)
  }
  try {
    return await res.json()
  } catch {
    return null
  }
}
