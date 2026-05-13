import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || 'studio'
const ACCESS_TOKEN_KEY = 'access_token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith(`/${ADMIN_PATH}`)
  const isLoginPage = pathname === `/${ADMIN_PATH}/login`

  if (!isAdminRoute) return NextResponse.next()

  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value

  // Not authenticated → redirect to login
  if (!token && !isLoginPage) {
    const loginUrl = new URL(`/${ADMIN_PATH}/login`, request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already authenticated → redirect away from login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(`/${ADMIN_PATH}/dashboard`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
