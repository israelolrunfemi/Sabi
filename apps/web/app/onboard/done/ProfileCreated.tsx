"use client"

import Image from "next/image"
import Link from "next/link"
import sabiLogo from "../../../public/sabi-logo.svg"
import { Check, Menu } from "lucide-react"

const confetti = [
  "left-[16%] top-[18%] rotate-0 bg-[#FFC83D]",
  "left-[24%] top-[36%] rotate-12 bg-[#3264FF]",
  "left-[30%] top-[23%] rotate-[24deg] bg-[#17C879]",
  "left-[41%] top-[18%] rotate-[52deg] bg-[#F36B3D]",
  "left-[50%] top-[42%] rotate-[80deg] bg-[#FFC83D]",
  "left-[64%] top-[15%] rotate-[78deg] bg-[#FFC83D]",
  "left-[70%] top-[31%] rotate-[18deg] bg-[#3264FF]",
  "left-[80%] top-[20%] rotate-[76deg] bg-[#17C879]",
  "left-[86%] top-[36%] rotate-[20deg] bg-[#F36B3D]",
  "left-[75%] top-[48%] rotate-[90deg] bg-[#FFC83D]",
  "left-[35%] top-[52%] rotate-[18deg] bg-[#3264FF]",
  "left-[20%] top-[50%] rotate-[74deg] bg-[#F36B3D]",
]

export const ProfileCreated = () => {
  return (
    <main className="min-h-screen bg-[#EDEDED] px-6 py-10">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-[#FAFAFA] shadow-sm md:max-w-4xl">
        <header className="flex items-center justify-between bg-white px-5 py-5">
          <Image src={sabiLogo} alt="Sabi Logo" priority className="h-7 w-auto" />
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-[#0F2742] hover:bg-[#F7F7F7] md:hidden"
          >
            <Menu className="size-6" />
          </button>
        </header>

        <section className="px-4 pb-24 pt-16 md:px-14">
          <div className="relative mx-auto h-44 max-w-sm">
            {confetti.map((className) => (
              <span
                key={className}
                className={`absolute h-3 w-1.5 rounded-sm ${className}`}
              />
            ))}

            <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[20px] bg-[#56BF56] text-white">
              <Check className="size-9 stroke-[3]" />
            </div>
          </div>

          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold text-[#0F2742]">Your profile is ready!</h1>
            <p className="mt-4 text-base font-medium leading-7 text-[#797979]">
              We have created your financial identity and generated your initial trust score.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-[#EAFCE8] px-6 py-6 text-center">
            <p className="text-lg font-medium text-[#0F2742]">Your initial trust score</p>

            <div className="mx-auto mt-5 grid size-24 place-items-center rounded-full bg-[conic-gradient(#FFC83D_0_40%,#E8E8E8_40%_100%)] p-1">
              <div className="grid size-full place-items-center rounded-full bg-[#F8FFF6]">
                <span className="font-mono text-3xl font-bold text-black">40</span>
              </div>
            </div>

            <p className="mx-auto mt-5 max-w-sm text-base font-medium leading-7 text-[#797979]">
              Great start! Keep your profile updated and complete jobs to raise your score.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-lg">
            <Link
              href="/dashboard"
              className="flex h-14 w-full items-center justify-center rounded-xl bg-[#13B86A] text-base font-semibold text-white transition-colors hover:bg-[#0FA65F]"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
