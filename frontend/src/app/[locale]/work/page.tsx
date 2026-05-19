import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { fetchPublic } from '@/lib/server-api'
import type { CaseStudy } from '@/lib/api'
import WorkClient from './WorkClient'

export default async function WorkPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const caseStudies = await fetchPublic<CaseStudy[]>(`/case-studies?lang=${locale}`)

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">
        <WorkClient caseStudies={caseStudies ?? []} />
      </main>
      <Footer />
    </>
  )
}
