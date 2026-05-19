import { redirect } from 'next/navigation'

export default function ResumePage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/about`)
}
