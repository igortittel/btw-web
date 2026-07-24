export type Category = "transfery" | "prenajom" | "tipy"

export type Article = {
  slug: string
  title: string
  excerpt: string
  category: Category
  date: string
  readTime: number
  image: string
  imageAlt: string
}

export const categoryLabels: Record<Category, string> = {
  transfery: "Transfery na letisko",
  prenajom: "Prenájom vozidiel",
  tipy: "Cestovné tipy",
}

export const articles: Article[] = [
  {
    slug: "sukromny-transfer-bratislava-schwechat",
    title: "Súkromný transfer Bratislava – Schwechat: Kedy dáva zmysel viac ako autobus?",
    excerpt:
      "Detailné porovnanie nákladov, komfortu a scenárov. Kedy sa privátny transfer skutočne oplatí a kedy stačí autobus?",
    category: "transfery",
    date: "2026-07-21",
    readTime: 8,
    image: "/images/bts-vie.png",
    imageAlt: "Súkromný transfer Bratislava – Schwechat",
  },
]
