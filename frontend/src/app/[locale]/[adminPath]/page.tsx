import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

export default function AdminRootPage({ params }: { params: { locale: string; adminPath: string } }) {
  const { locale } = params
  setRequestLocale(locale)
  redirect(`/${params.locale}/${params.adminPath}/dashboard`)
}
