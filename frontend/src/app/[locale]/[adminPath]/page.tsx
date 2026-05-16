import { redirect } from 'next/navigation'

export default function AdminRootPage({ params }: { params: { locale: string; adminPath: string } }) {
  redirect(`/${params.locale}/${params.adminPath}/dashboard`)
}
