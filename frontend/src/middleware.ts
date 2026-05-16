import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || 'studio'
const ACCESS_TOKEN_KEY = 'access_token'

const intlMiddleware = createMiddleware(routing)

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
    if (pathname === `/${locale}`) return '/'
  }
  return pathname
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathWithoutLocale = stripLocale(pathname)
  const hasLocalePrefix = pathWithoutLocale !== pathname

  const isAdminRoute = pathWithoutLocale.startsWith(`/${ADMIN_PATH}`)
  const isLoginPage = pathWithoutLocale === `/${ADMIN_PATH}/login`

  if (isAdminRoute && hasLocalePrefix) {
    const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value
    const locale = pathname.split('/')[1] || routing.defaultLocale

    if (!token && !isLoginPage) {
      const loginUrl = new URL(`/${locale}/${ADMIN_PATH}/login`, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (token && isLoginPage) {
      return NextResponse.redirect(new URL(`/${locale}/${ADMIN_PATH}/dashboard`, request.url))
    }

    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
