import { redirect } from 'next/navigation'

// /[adminPath] → redirect to dashboard (middleware handles auth)
export default function AdminRootPage({ params }: { params: { adminPath: string } }) {
  redirect(`/${params.adminPath}/dashboard`)
}
