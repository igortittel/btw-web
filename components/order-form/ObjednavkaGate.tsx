"use client"

import { useEffect, useState, type ReactNode } from "react"

const SESSION_KEY = "objednavka_unlocked"
const PASSWORD = "elektrickekreslo"

type Props = { children: ReactNode }

export function ObjednavkaGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        setUnlocked(true)
      }
    } catch {
      /* incognito / blocked — ignore */
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true")
      } catch {
        /* silent */
      }
      setUnlocked(true)
    } else {
      setError(true)
      setPassword("")
    }
  }

  if (!mounted) return null

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-[#B88746] text-sm font-semibold tracking-widest uppercase text-center mb-2">
            Skrytá stránka — beta
          </p>
          <h1 className="text-2xl font-bold text-white text-center mb-8">
            Zadaj heslo
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Heslo"
              autoFocus
              autoComplete="off"
              className="w-full bg-[#111111] border border-white/20 text-white rounded-md px-4 py-3 text-sm outline-none focus:border-[#B88746] transition-colors"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">Nesprávne heslo</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#B88746] hover:bg-[#a07535] text-black font-semibold py-3 rounded-md transition-colors text-sm tracking-wide"
            >
              Vstúpiť
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
