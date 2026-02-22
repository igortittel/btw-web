"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  const isActiveLink = (href: string) => pathname === href

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#111111] fixed w-full top-0 z-50">
      <div className="flex items-center space-x-2">
        <Link href="/" onClick={handleLogoClick}>
          <Image src="/images/logo.svg" alt="BY THE WAVE" width={120} height={40} className="h-10 w-auto" />
        </Link>
      </div>

      <div className="flex items-center space-x-8">
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/sluzby"
            className={`text-[#CCCCCC] hover:text-white transition-colors ${
              isActiveLink("/sluzby") ? "border-b-2 border-[#B88746] text-white" : ""
            }`}
          >
            Služby
          </Link>
          <Link
            href="/nase-vozidla"
            className={`text-[#CCCCCC] hover:text-white transition-colors ${
              isActiveLink("/nase-vozidla") ? "border-b-2 border-[#B88746] text-white" : ""
            }`}
          >
            Naše vozidlá
          </Link>
          <Link
            href="/prenajom-vozidiel"
            className={`text-[#CCCCCC] hover:text-white transition-colors ${
              isActiveLink("/prenajom-vozidiel") ? "border-b-2 border-[#B88746] text-white" : ""
            }`}
          >
            Prenájom vozidiel
          </Link>
          <Link
            href="/preprava-osob"
            className={`text-[#CCCCCC] hover:text-white transition-colors ${
              isActiveLink("/preprava-osob") ? "border-b-2 border-[#B88746] text-white" : ""
            }`}
          >
            Preprava osôb
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link href="/rezervacie">
            <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-4 py-2">
              Rezervovať odvoz
            </Button>
          </Link>
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white p-2" aria-label="Toggle menu">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-[#111111] z-40 md:hidden overflow-y-auto overscroll-contain pb-24">
          <nav className="flex flex-col p-6 space-y-6">
            <Link
              href="/sluzby"
              className={`text-[#CCCCCC] hover:text-white transition-colors text-lg ${
                isActiveLink("/sluzby") ? "border-b-2 border-[#B88746] text-white pb-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Služby
            </Link>
            <Link
              href="/nase-vozidla"
              className={`text-[#CCCCCC] hover:text-white transition-colors text-lg ${
                isActiveLink("/nase-vozidla") ? "border-b-2 border-[#B88746] text-white pb-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Naše vozidlá
            </Link>
            <Link
              href="/prenajom-vozidiel"
              className={`text-[#CCCCCC] hover:text-white transition-colors text-lg ${
                isActiveLink("/prenajom-vozidiel") ? "border-b-2 border-[#B88746] text-white pb-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Prenájom vozidiel
            </Link>
            <Link
              href="/preprava-osob"
              className={`text-[#CCCCCC] hover:text-white transition-colors text-lg ${
                isActiveLink("/preprava-osob") ? "border-b-2 border-[#B88746] text-white pb-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Preprava osôb
            </Link>

            <div className="pt-4">
              <Link href="/rezervacie">
                <Button
                  className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-3 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rezervovať odvoz
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
