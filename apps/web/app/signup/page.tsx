"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import sabiLogo from "../../public/sabi-logo.svg"
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MenuIcon,
  Phone,
  User,
} from "lucide-react"
import React, { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { apiFetch, setStoredToken } from "@/lib/api/client"
import { apiRoutes } from "@/lib/api/routes"
import type { ApiError, AuthData, UserType } from "@/lib/api/types"
import { cn } from "@/lib/utils"

const accountTypes: Array<{
  label: string
  value: UserType
  description: string
}> = [
  {
    label: "Trader",
    value: "TRADER",
    description: "Receive payments and grow your business",
  },
  {
    label: "Seeker",
    value: "SEEKER",
    description: "Find gigs and grow your career",
  },
  {
    label: "Buyer",
    value: "BUYER",
    description: "Hire trusted workers for your needs",
  },
]

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
}

const SignupPage = () => {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<UserType>("TRADER")
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const isFormComplete = useMemo(() => {
    return Boolean(form.fullName && form.email && form.phone && form.password)
  }, [form])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setErrorMessage("")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    if (!isFormComplete) {
      setErrorMessage("Please fill in all fields before creating your account.")
      return
    }

    if (!acceptedTerms) {
      setErrorMessage("Please accept the terms and privacy policy to continue.")
      return
    }

    setIsSubmitting(true)

    try {
      const authData = await apiFetch<AuthData>(apiRoutes.auth.register, {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          userType: selectedType,
        }),
      })

      setStoredToken("accessToken", authData.accessToken)
      setStoredToken("refreshToken", authData.refreshToken)
      router.push("/onboard")
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message ?? "Unable to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7] px-4 pb-10 md:px-8">
      <div className="mx-auto w-full max-w-md md:max-w-6xl">
        <header className="flex items-center justify-between py-5 md:py-6">
          <Link href="/" aria-label="Go to homepage">
            <Image src={sabiLogo} alt="Sabi Logo" priority className="h-7 w-auto" />
          </Link>
          <button
            type="button"
            aria-label="Open navigation"
            className="rounded-lg p-2 text-[#0F2742] transition-colors hover:bg-white md:hidden"
          >
            <MenuIcon className="text-6" />
          </button>
        </header>

        <section className="pt-6 md:mt-6 md:max-w-5xl md:rounded-3xl md:bg-white md:px-8 md:py-10 md:shadow-sm md:ring-1 md:ring-[#EFEFEF]">
          <div className="md:max-w-2xl">
            <h1 className="mb-2 text-[26px] font-semibold leading-tight text-[#0F2742] md:text-4xl">
              Create your account
            </h1>
            <p className="max-w-70 text-base font-medium leading-6 text-[#797979] md:max-w-none">
              Start building your trusted financial identity today
            </p>
          </div>

          <form className="mt-7 md:mt-8" onSubmit={handleSubmit}>
            <fieldset>
              <legend className="text-xl font-medium text-[#0F2742] md:text-2xl">
                I am signing up as a
              </legend>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {accountTypes.map((accountType) => {
                  const isSelected = selectedType === accountType.value

                  return (
                    <button
                      key={accountType.value}
                      type="button"
                      onClick={() => setSelectedType(accountType.value)}
                      className={cn(
                        "rounded-xl border px-3 py-4 text-left transition-colors md:rounded-2xl md:border-2",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13B86A] focus-visible:ring-offset-2",
                        isSelected
                          ? "border-[#9FE8B9] bg-[#EAFCE8]"
                          : "border-[#E8E8E8] bg-white hover:bg-[#FAFAFA]",
                      )}
                    >
                      <span className="flex items-center justify-between gap-3 md:items-start">
                        <span>
                          <span className="block text-base font-semibold text-[#1D2433]">
                            {accountType.label}
                          </span>
                          <span className="mt-1 block text-[15px] font-medium leading-6 text-[#797979]">
                            {accountType.description}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "flex text-5 shrink-0 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-[#13B86A] bg-[#13B86A] text-white"
                              : "border-[#D8DADF] bg-white text-transparent",
                          )}
                        >
                          <Check className="text-3.5" />
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 md:mt-7 md:grid-cols-2">
              <label className="block">
                <span className="text-base font-medium text-[#1D2433]">Full name</span>
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-[#EAEAEA] bg-white px-3 py-4">
                  <User className="text-5 shrink-0 text-[#B8B8B8]" />
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g Daniel Gbesimowo"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm text-[#1D2433] outline-none placeholder:text-[#B0B0B0]"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-base font-medium text-[#1D2433]">Email address</span>
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-[#EAEAEA] bg-white px-3 py-4">
                  <Mail className="text-5 shrink-0 text-[#B8B8B8]" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="danielgbesimowo7@gmail.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-[#1D2433] outline-none placeholder:text-[#B0B0B0]"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-base font-medium text-[#1D2433]">Phone number</span>
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-[#EAEAEA] bg-white px-3 py-4">
                  <Phone className="text-5 shrink-0 text-[#B8B8B8]" />
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="09160741871"
                    autoComplete="tel"
                    className="w-full bg-transparent text-sm text-[#1D2433] outline-none placeholder:text-[#B0B0B0]"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-base font-medium text-[#1D2433]">Password</span>
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-[#EAEAEA] bg-white px-3 py-4">
                  <Lock className="text-5 shrink-0 text-[#B8B8B8]" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                    autoComplete="new-password"
                    className="w-full bg-transparent text-sm text-[#1D2433] outline-none placeholder:text-[#B0B0B0]"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                    className="rounded-md p-1 text-[#B8B8B8] transition-colors hover:bg-[#F5F5F5] hover:text-[#0F2742]"
                  >
                    {showPassword ? <EyeOff className="text-5" /> : <Eye className="text-5" />}
                  </button>
                </span>
              </label>
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm font-medium leading-6 text-[#797979] md:max-w-xl">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked)
                  setErrorMessage("")
                }}
                className="mt-1 text-4.5 rounded border-[#BDBDBD] accent-[#13B86A]"
              />
              <span>
                By continuing, you agree to our{" "}
                <Link href="/" className="font-medium text-[#00A85A] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/" className="font-medium text-[#00A85A] hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {errorMessage ? (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#13B86A] px-8 text-base font-semibold text-white hover:bg-[#0FA65F] cursor-pointer md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="text-5 animate-spin" />
                    Creating account
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-center text-sm font-medium text-[#797979]">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#00A85A] hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

export default SignupPage
