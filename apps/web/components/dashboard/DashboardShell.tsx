"use client"

import Image from "next/image"
import Link from "next/link"
import sabiLogo from "../../public/sabi-logo.svg"
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Filter,
  Share2,
  Star,
  Menu,
  Search,
  Sparkles,
  UserRound,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type GigCardData = {
  id: string
  title: string
  location: string
  description: string
  budget: number
  matchScore: number
  deadline: string
  trustScore: number
  posterImage?: string
}

export const recommendedGigs: GigCardData[] = [
  {
    id: "tailor-needed",
    title: "Tailor needed for female gown",
    location: "Surulere, Lagos",
    description: "Need an experienced tailor to sew a corporate ankara gown",
    budget: 35000,
    matchScore: 92,
    deadline: "2 days left",
    trustScore: 82,
    posterImage: "/placeholder-avatar.svg",
  },
  {
    id: "makeup-artist",
    title: "Makeup artist for event",
    location: "Victoria Island, Lagos",
    description: "Require a creative designer to revamp mobile app interface",
    budget: 50000,
    matchScore: 88,
    deadline: "5 days left",
    trustScore: 90,
    posterImage: "/placeholder-avatar.svg",
  },
  {
    id: "bead-maker",
    title: "Bead maker (Bracelets)",
    location: "Ikeja, Lagos",
    description: "Looking for an experienced planner to organize a 200-guest wedding",
    budget: 120000,
    matchScore: 95,
    deadline: "8 days left",
    trustScore: 72,
    posterImage: "/placeholder-avatar.svg",
  },
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)

export { formatCurrency }

const TrustScoreRing = ({ score = 40 }: { score?: number }) => {
  return (
    <div className="grid size-24 place-items-center rounded-full bg-[conic-gradient(#FFC83D_0_40%,#E8E8E8_40%_100%)] p-1">
      <div className="grid size-full place-items-center rounded-full bg-white">
        <span className="font-mono text-3xl font-bold text-black">{score}</span>
      </div>
    </div>
  )
}

const AppHeader = ({ title }: { title?: string }) => {
  return (
    <header className="flex items-center justify-between bg-white px-5 py-5">
      <Image src={sabiLogo} alt="Sabi Logo" priority className="h-7 w-auto" />
      <div className="hidden items-center gap-3 md:flex">
        {title ? <p className="text-sm font-semibold text-[#0F2742]">{title}</p> : null}
        <button type="button" aria-label="Notifications" className="rounded-lg p-2 text-[#0F2742] hover:bg-[#F7F7F7]">
          <Bell className="size-5" />
        </button>
      </div>
      <button type="button" aria-label="Open menu" className="rounded-lg p-2 text-[#0F2742] hover:bg-[#F7F7F7] md:hidden">
        <Menu className="size-6" />
      </button>
    </header>
  )
}

const GigCard = ({ gig, compact = false }: { gig: GigCardData; compact?: boolean }) => {
  return (
    <article className="rounded-none bg-white p-4 shadow-sm md:rounded-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="max-w-[210px] text-base font-semibold leading-5 text-[#1D2433]">{gig.title}</h3>
          <p className="mt-2 flex items-center gap-1 text-sm text-[#797979]">
            <Search className="size-3.5" />
            {gig.location}
          </p>
        </div>
        <span className="rounded-full bg-[#D8F3DC] px-3 py-2 text-xs font-semibold text-[#13B86A]">
          {gig.matchScore}% match
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#797979]">{gig.description}</p>
      <div className="mt-4 h-px bg-[#EFEFEF]" />

      <div className="mt-3 grid grid-cols-[minmax(92px,1fr)_minmax(86px,1fr)_auto] items-center gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-lg font-bold text-[#13B86A] sm:text-xl">{formatCurrency(gig.budget)}</p>
          <p className="text-sm text-[#797979]">Budget</p>
        </div>
        <div className="min-w-0 border-l border-[#EFEFEF] pl-2 sm:pl-3">
          <p className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-[#EF476F] sm:text-sm">
            <CalendarDays className="size-3.5" />
            {gig.deadline}
          </p>
          <p className="mt-1 text-sm text-[#797979]">Deadline</p>
        </div>
        <div className="min-w-[48px] text-center">
          {gig.posterImage ? (
            <Image
              src={gig.posterImage}
              alt=""
              width={44}
              height={44}
              className="mx-auto size-11 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#EAFCE8] text-[#13B86A]">
              <UserRound className="size-5" />
            </div>
          )}
          <p className="mt-1 text-xs font-semibold text-[#4A5568]">{gig.trustScore} trust</p>
        </div>
      </div>

      {compact ? null : (
        <div className="mt-5 flex justify-end">
            <Link
              href={`/gigs/${gig.id}`}
            className="flex h-10 min-w-28 items-center justify-center rounded-xl bg-[#13B86A] px-6 text-sm font-semibold text-white hover:bg-[#0FA65F]"
          >
            View
          </Link>
        </div>
      )}
    </article>
  )
}

export const DashboardHome = () => {
  const primaryGig = recommendedGigs[0]

  return (
    <main className="min-h-screen bg-[#EDEDED] px-6 py-8">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-[#F7F7F7] shadow-sm md:max-w-5xl">
        <AppHeader title="Dashboard" />

        <section className="px-4 py-6 md:grid md:grid-cols-[1fr_0.9fr] md:gap-6 md:px-8">
          <div>
            <div className="mb-7">
              <h1 className="text-[26px] font-semibold leading-tight text-[#0F2742]">Hello, Daniel 👋</h1>
              <p className="mt-2 text-base font-medium text-[#797979]">Here’s what’s happening today</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-base font-bold text-[#0F2742]">Trust Score :</p>
                  <div className="mt-3 flex justify-center sm:block">
                    <TrustScoreRing />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#13B86A]">↑ 4 this week</p>
                  <p className="mt-1 text-sm font-semibold text-[#0F2742]">Trusted beginner</p>
                </div>

                <div className="rounded-2xl bg-[#EAFCE8] p-4">
                  <p className="text-base font-medium text-[#0F2742]">Wallet Balance</p>
                  <p className="mt-4 text-2xl font-semibold text-[#0F2742]">₦24,500.00</p>
                  <p className="mt-5 inline-flex rounded-full bg-[#D8F3DC] px-4 py-2 text-sm font-semibold text-[#13B86A] sm:mt-8">
                    ↑ +₦5,000 today
                  </p>
                </div>
              </div>

              <Link
                href="/gigs"
                className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#13B86A] px-4 text-center text-base font-medium leading-6 text-white hover:bg-[#0FA65F]"
              >
                <Sparkles className="size-5" />
                Complete more jobs to increase your score
              </Link>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-[#1D2433]">Quick actions</h2>
              <div className="mt-4 grid grid-cols-4 rounded-xl bg-white py-4 shadow-sm">
                {[
                  { href: "/gigs", icon: Search, label: "Find gigs" },
                  { href: "/applications", icon: BriefcaseBusiness, label: "My jobs" },
                  { href: "/wallet", icon: Wallet, label: "Wallet" },
                  { href: "/trust", icon: BadgeCheck, label: "Reputation" },
                ].map((action, index) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={cn(
                      "flex min-w-0 flex-col items-center gap-2 px-1 text-center text-xs font-medium text-[#667085] sm:px-2 sm:text-sm",
                      index > 0 && "border-l border-[#EFEFEF]",
                    )}
                  >
                    <action.icon className="size-6 shrink-0 text-[#667085]" />
                    <span className="leading-4">{action.label}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-8 md:mt-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1D2433]">Recommended for You</h2>
              <Link href="/gigs" className="text-base font-medium text-[#797979] hover:text-[#13B86A]">
                See all
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <GigCard gig={primaryGig} compact />
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

export const BrowseGigs = () => {
  return (
    <main className="min-h-screen bg-[#EDEDED] px-2 py-4 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-[#F7F7F7] shadow-sm md:max-w-5xl">
        <AppHeader title="Browse gigs" />

        <section className="px-4 pb-8 pt-3">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/dashboard" aria-label="Go back" className="rounded-full p-2 text-[#0F2742] hover:bg-white">
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-lg font-bold text-[#0F2742]">Find gigs</h1>
            <button type="button" aria-label="Filter gigs" className="rounded-full p-2 text-[#0F2742] hover:bg-white">
              <Filter className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-3">
            <Search className="size-4 text-[#B0B0B0]" />
            <input
              placeholder="Search jobs, skills or keywords..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#B0B0B0]"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {["All", "Near me", "High match", "Recent"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={cn(
                  "h-9 shrink-0 rounded-xl px-4 text-sm font-medium",
                  filter === "All"
                    ? "bg-[#13B86A] text-white"
                    : "border border-[#E8E8E8] bg-white text-[#797979]",
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-[#797979]">128 jobs found</p>

          <div className="mt-3 grid gap-5 md:grid-cols-2">
            {recommendedGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export const GigDetail = ({ gigId }: { gigId: string }) => {
  const gig = recommendedGigs.find((item) => item.id === gigId) ?? recommendedGigs[0]
  const requirements = [
    "5+ years tailoring experience",
    "Good finishing and attention to detail",
    "Can work with ankara fabric",
    "Portfolio or previous work samples",
  ]

  return (
    <main className="min-h-screen bg-[#EDEDED] px-5 py-8">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-[#F7F7F7] shadow-sm md:max-w-4xl">
        <AppHeader title="Gig detail" />

        <section className="px-4 pb-8 pt-3 md:px-8">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/gigs" aria-label="Go back" className="rounded-full p-2 text-[#0F2742] hover:bg-white">
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-lg font-bold text-[#0F2742]">Gig Detail</h1>
            <button type="button" aria-label="Share gig" className="rounded-full p-2 text-[#0F2742] hover:bg-white">
              <Share2 className="size-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
            <article className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="max-w-[230px] text-base font-semibold leading-5 text-[#1D2433]">{gig.title}</h2>
                  <p className="mt-2 flex items-center gap-1 text-sm text-[#797979]">
                    <Search className="size-3.5" />
                    {gig.location}
                  </p>
                </div>
                <span className="rounded-full bg-[#D8F3DC] px-3 py-2 text-xs font-semibold text-[#13B86A]">
                  {gig.matchScore}% match
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#797979]">{gig.description}</p>
              <div className="mt-4 h-px bg-[#EFEFEF]" />

              <div className="mt-3 grid grid-cols-[minmax(92px,1fr)_minmax(86px,1fr)_auto] items-center gap-2">
                <div>
                  <p className="text-lg font-bold text-[#13B86A] sm:text-xl">{formatCurrency(gig.budget)}</p>
                  <p className="text-sm text-[#797979]">Budget</p>
                </div>
                <div className="border-l border-[#EFEFEF] pl-2">
                  <p className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-[#EF476F] sm:text-sm">
                    <CalendarDays className="size-3.5" />
                    {gig.deadline}
                  </p>
                  <p className="mt-1 text-sm text-[#797979]">Deadline</p>
                </div>
                <div className="min-w-[48px] text-center">
                  <Image
                    src={gig.posterImage ?? "/placeholder-avatar.svg"}
                    alt=""
                    width={44}
                    height={44}
                    className="mx-auto size-11 rounded-full object-cover"
                  />
                  <p className="mt-1 text-xs font-semibold text-[#4A5568]">{gig.trustScore} trust</p>
                </div>
              </div>

              <div className="mt-5 h-px bg-[#EFEFEF]" />

              <section className="mt-5">
                <h3 className="text-base font-semibold text-[#1D2433]">About this gig</h3>
                <p className="mt-3 text-sm leading-6 text-[#797979]">
                  I need an experienced tailor to sew a corporate ankara gown with inner lining and neat finishing.
                </p>
              </section>

              <section className="mt-5">
                <h3 className="text-base font-semibold text-[#1D2433]">Requirements</h3>
                <ul className="mt-3 space-y-3">
                  {requirements.map((requirement) => (
                    <li key={requirement} className="flex items-center gap-2 text-sm text-[#797979]">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#13B86A] text-white">
                        <Check className="size-3" />
                      </span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </section>
            </article>

            <aside className="space-y-4">
              <div className="rounded-2xl bg-[#FFF5D9] p-4">
                <p className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#797979]">
                  <Sparkles className="size-4 text-[#FFC83D]" />
                  Why this matches you
                </p>
                <p className="mt-4 text-sm leading-6 text-[#797979]">
                  You have 5 years tailoring experience and have completed similar jobs with high ratings.
                </p>
              </div>

              <Link
                href={`/gigs/${gig.id}?apply=true`}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#13B86A] text-base font-semibold text-white hover:bg-[#0FA65F]"
              >
                Apply for this gig
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}

export const ApplyGigModal = ({ gigId }: { gigId: string }) => {
  const gig = recommendedGigs.find((item) => item.id === gigId) ?? recommendedGigs[0]
  const skills = ["Tailoring", "Ankara styling", "Alterations", "Patternmaking", "Clothing Repairs"]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 md:items-center">
      <div className="w-full max-w-md rounded-t-[28px] bg-white p-5 shadow-xl md:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1D2433]">Apply for this Gig</h2>
          <Link href={`/gigs/${gig.id}`} aria-label="Close application modal" className="rounded-full p-2 text-[#0F2742] hover:bg-[#F7F7F7]">
            ×
          </Link>
        </div>

        <p className="text-base font-medium text-[#1D2433]">Your profile Preview</p>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F7F7F7] p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/placeholder-avatar.svg"
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-[#1D2433]">Amaka Okafor</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-[#797979]">
                <Star className="size-4 fill-[#FFC83D] text-[#FFC83D]" />
                <span className="font-semibold text-[#EF476F]">4.7</span>
                (32 reviews)
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-mono text-3xl font-bold text-black">40</p>
            <p className="text-sm text-[#797979]">Trust score</p>
          </div>
        </div>

        <section className="mt-5">
          <h3 className="text-sm font-medium text-[#1D2433]">Your Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="rounded-full bg-[#D8F3DC] px-3 py-2 text-xs font-semibold text-[#13B86A]">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-[#1D2433]">Cover Note (optional)</span>
          <span className="mt-3 block rounded-xl border border-[#E0E0E0] bg-white p-3">
            <textarea
              maxLength={300}
              rows={5}
              placeholder="Tell the poster why you are the best fit for this job..."
              className="w-full resize-none text-sm outline-none placeholder:text-[#B0B0B0]"
            />
            <span className="mt-2 block text-right text-sm font-semibold text-[#797979]">0/300</span>
          </span>
        </label>

        <button
          type="button"
          className="mt-5 h-12 w-full rounded-xl bg-[#13B86A] text-sm font-semibold text-white hover:bg-[#0FA65F]"
        >
          Submit Application
        </button>
        <p className="mt-4 text-center text-sm text-[#797979]">
          You can track your application in{" "}
          <Link href="/applications" className="font-semibold text-[#13B86A]">
            My Jobs.
          </Link>
        </p>
      </div>
    </div>
  )
}
