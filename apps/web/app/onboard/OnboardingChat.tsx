"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import sabiLogo from "../../public/sabi-logo.svg"
import {
  ArrowLeft,
  Check,
  Loader2,
  Menu,
  Pencil,
  SendHorizontal,
  Sparkles,
} from "lucide-react"
import { FormEvent, useMemo, useState } from "react"

import { apiFetch } from "@/lib/api/client"
import { apiRoutes } from "@/lib/api/routes"
import type { ApiError, EconomicProfile, OnboardingChatData } from "@/lib/api/types"
import { cn } from "@/lib/utils"

type ChatMessage = {
  role: "assistant" | "user"
  content: string
}

type ApiHistoryItem = {
  role: "assistant" | "user"
  content: string
}

const startingMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I'm Sabi AI. I'll help you build your profile so we can match you with the right opportunities.",
  },
  {
    role: "assistant",
    content: "What skills or services are you best known for?",
  },
]

const emptyProfile: EconomicProfile = {
  tradeCategory: "",
  skills: [],
  description: "",
  yearsExperience: 0,
  location: "",
  language: "",
}

const quickAnswers = [
  "I find jobs or gigs.",
  "Grow my business",
  "Receive payments",
  "Build my reputation",
]

const profileFields = [
  "Skills",
  "Experience",
  "Location",
  "Language",
  "Goals",
  "Description",
]

export const OnboardingChat = () => {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>(startingMessages)
  const [profile, setProfile] = useState<EconomicProfile>(emptyProfile)
  const [answer, setAnswer] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const progress = useMemo(() => {
    const completed = [
      profile.tradeCategory,
      profile.skills.length > 0,
      profile.location,
      profile.language,
      profile.yearsExperience,
      profile.description,
    ].filter(Boolean).length

    return completed
  }, [profile])

  const history: ApiHistoryItem[] = useMemo(
    () =>
      messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    [messages],
  )

  const sendMessage = async (nextAnswer: string) => {
    const trimmedAnswer = nextAnswer.trim()
    if (!trimmedAnswer || isSending || isCompleting) return

    setAnswer("")
    setErrorMessage("")
    setIsSending(true)
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: trimmedAnswer },
    ])

    try {
      const data = await apiFetch<OnboardingChatData>(apiRoutes.onboard.chat, {
        method: "POST",
        body: JSON.stringify({
          message: trimmedAnswer,
          history,
        }),
      })

      if (data.extractedData) {
        setProfile((currentProfile) => ({
          ...currentProfile,
          ...data.extractedData,
          skills: data.extractedData?.skills ?? currentProfile.skills,
        }))
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.reply || "Nice. I have updated your profile.",
        },
      ])

      if (data.isComplete && data.extractedData) {
        await completeOnboarding({
          ...emptyProfile,
          ...data.extractedData,
        })
      }
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message ?? "Sabi AI could not respond. Please try again.")
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: "I saved that locally. You can continue when the API is reachable.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const completeOnboarding = async (nextProfile = profile) => {
    setIsCompleting(true)
    setErrorMessage("")

    try {
      await apiFetch(apiRoutes.onboard.complete, {
        method: "POST",
        body: JSON.stringify(nextProfile),
      })
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message ?? "Profile save could not be confirmed.")
    } finally {
      setIsCompleting(false)
      router.push("/onboard/done")
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(answer)
  }

  return (
    <main className="min-h-screen bg-[#EDEDED] px-4 py-6">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-sm md:max-w-5xl">
        <header className="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-4">
          <Image src={sabiLogo} alt="Sabi Logo" priority className="h-6 w-auto" />
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-[#0F2742] hover:bg-[#F7F7F7] md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </header>

        <section className="grid min-h-[780px] md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex min-h-195 flex-col bg-[#FAFAFA]">
            <div className="flex items-center justify-between px-5 py-4 text-xs font-medium text-[#6F6F6F]">
              <button type="button" aria-label="Go back" className="rounded-full p-1 hover:bg-white">
                <ArrowLeft className="size-4" />
              </button>
              <span>{progress} of {profileFields.length}</span>
              <button type="button" className="text-[#0F2742] hover:underline">
                Skip
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-5">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "flex items-start gap-2",
                    message.role === "user" && "justify-end",
                  )}
                >
                  {message.role === "assistant" ? (
                    <Image src={sabiLogo} alt="" className="mt-1 h-4 w-4 shrink-0" />
                  ) : null}
                  <p
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6",
                      message.role === "assistant"
                        ? "rounded-tl-md bg-white text-[#1D2433] shadow-sm"
                        : "rounded-tr-md bg-[#EAFCE8] text-[#1D2433]",
                    )}
                  >
                    {message.content}
                  </p>
                </div>
              ))}

              <div className="rounded-xl border border-[#EFEFEF] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#1D2433]">Your profile (live)</h2>
                  <button type="button" className="flex items-center gap-1 text-xs font-medium text-[#13B86A]">
                    <Pencil className="size-3" />
                    Edit
                  </button>
                </div>

                <div className="space-y-3 text-xs text-[#797979]">
                  <div>
                    <p className="mb-2 font-medium text-[#1D2433]">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-[#EAFCE8] px-3 py-1 text-[#13B86A]">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#9C9C9C]">Waiting for your answer</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[#1D2433]">Experience</p>
                    <p>{profile.yearsExperience ? `${profile.yearsExperience} years` : "Not added yet"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#1D2433]">Location</p>
                    <p>{profile.location || "Not added yet"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#1D2433]">Languages</p>
                    <p>{profile.language || "Not added yet"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Image src={sabiLogo} alt="" className="mt-1 h-4 w-4 shrink-0" />
                <p className="max-w-[78%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-6 text-[#1D2433] shadow-sm">
                  One last question. <Sparkles className="inline size-3 text-[#F4A261]" /> What are your goals on Sabi?
                </p>
              </div>

              <div className="ml-6 space-y-2">
                {quickAnswers.map((quickAnswer) => (
                  <button
                    key={quickAnswer}
                    type="button"
                    onClick={() => {
                      void sendMessage(quickAnswer)
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-[#D8F3DC] bg-[#EAFCE8] px-4 py-3 text-left text-sm font-medium text-[#4A5568]"
                  >
                    {quickAnswer}
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#13B86A] text-white">
                      <Check className="size-3" />
                    </span>
                  </button>
                ))}
              </div>

              {errorMessage ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[#F0F0F0] bg-white p-4">
              <div className="flex items-center gap-3 rounded-full bg-[#F7F7F7] px-4 py-3">
                <input
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Type your answer..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#9C9C9C]"
                />
                <button
                  type="submit"
                  aria-label="Send answer"
                  disabled={isSending || isCompleting}
                  className="text-[#13B86A] disabled:opacity-60"
                >
                  {isSending || isCompleting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <SendHorizontal className="size-5" />
                  )}
                </button>
              </div>
            </form>
          </div>

          <aside className="hidden bg-white p-6 md:block">
            <div className="sticky top-6 rounded-2xl border border-[#EFEFEF] bg-[#FAFAFA] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#13B86A]">
                Live profile
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#0F2742]">
                {profile.tradeCategory ? `${profile.tradeCategory} profile` : "Profile in progress"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#797979]">
                {profile.description || "Sabi will build this profile as the user answers onboarding questions."}
              </p>

              <div className="mt-6 space-y-4">
                {profileFields.map((field, index) => (
                  <div key={field}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#1D2433]">{field}</span>
                      <span className="text-[#797979]">{index < progress ? "Done" : "Pending"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#E8E8E8]">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          index < progress ? "bg-[#13B86A]" : "bg-transparent",
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
