import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'access_token'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!Cookies.get(ACCESS_TOKEN_KEY)
}

export function getAdminPath(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PATH || 'studio'
}
