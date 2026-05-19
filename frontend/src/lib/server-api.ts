const BASE = process.env.BACKEND_URL || 'http://localhost:8080'

export async function fetchPublic<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/api/public${path}`, { next: { revalidate: 30 } })
    if (!res.ok) return null
    const json = await res.json()
    return (json.data ?? null) as T
  } catch {
    return null
  }
}
