import { ApplyGigModal, GigDetail } from "@/components/dashboard/DashboardShell"

type GigDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ apply?: string }>
}

const GigDetailPage = async ({ params, searchParams }: GigDetailPageProps) => {
  const { id } = await params
  const { apply } = await searchParams

  return (
    <>
      <GigDetail gigId={id} />
      {apply === "true" ? <ApplyGigModal gigId={id} /> : null}
    </>
  )
}

export default GigDetailPage
