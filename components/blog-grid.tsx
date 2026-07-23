"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { articles, categoryLabels, type Category } from "@/data/articles"

const ALL = "all" as const
type Filter = typeof ALL | Category

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Všetky" },
  { value: "transfery", label: categoryLabels.transfery },
  { value: "prenajom", label: categoryLabels.prenajom },
  { value: "tipy", label: categoryLabels.tipy },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" })
}

export function BlogGrid() {
  const [active, setActive] = useState<Filter>("all")

  const filtered = active === "all" ? articles : articles.filter((a) => a.category === active)

  return (
    <div className="bg-[#000000]">
      {/* Category filter */}
      <div className="bg-[#0B0B0B] border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === f.value
                  ? "bg-[#B88746] text-black"
                  : "text-[#CCCCCC] border border-[#333] hover:border-[#B88746] hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <p className="text-[#666666] text-center py-20 text-sm">
            Čoskoro pribudnú ďalšie články v tejto kategórii.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden hover:border-[#B88746]/40 transition-colors flex flex-col"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <span className="text-xs font-medium text-[#B88746] uppercase tracking-wider">
                    {categoryLabels[article.category]}
                  </span>
                  <h2 className="text-white font-semibold text-base leading-snug line-clamp-2 group-hover:text-[#B88746] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-[#AAAAAA] text-sm leading-relaxed line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1a1a1a]">
                    <span className="text-[#666666] text-xs">{formatDate(article.date)}</span>
                    <span className="text-[#666666] text-xs">{article.readTime} min čítania</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
