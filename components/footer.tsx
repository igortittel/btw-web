"use client"

import { Instagram, Facebook, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#000000] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-8 md:space-y-0">
          {/* Logo */}
          <div className="flex-shrink-0 text-center md:text-left">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="BY THE WAVE"
                width={120}
                height={40}
                className="h-10 w-auto mx-auto md:mx-0"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center md:text-left">
              <Link href="/sluzby" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Služby
              </Link>
              <Link href="/nase-vozidla" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Naše vozidlá
              </Link>
              <Link href="/kontakt" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Kontakt
              </Link>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <Link href="/prenajom-vozidiel" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Prenájom vozidiel
              </Link>
              <Link href="/preprava-osob" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Preprava osôb
              </Link>
              <Link href="/transfer-bratislava-schwechat" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Odvoz na Schwechat
              </Link>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <Link href="/ochrana-osobnych-udajov" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Ochrana osobných údajov
              </Link>
              <Link href="/vseobecne-obchodne-podmienky" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Všeobecné obchodné podmienky
              </Link>
              <Link href="/blog" className="block text-[#CCCCCC] hover:text-white text-sm transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="https://www.instagram.com/bythewave_sk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#CCCCCC] hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/bythewavesk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#CCCCCC] hover:text-white transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
