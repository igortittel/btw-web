import { VehicleDetailClient } from "./vehicle-detail-client"

interface VehicleDetailPageProps {
  params: {
    slug: string
  }
}

// Required for static export with dynamic routes
// Using static slugs to avoid server-side API calls during build
export async function generateStaticParams() {
  // Static list of known vehicle slugs - these will be generated at build time
  // The actual vehicle data will be fetched client-side
  const staticSlugs = [
    "mercedes-benz-v300d-4matic-long",
    "mercedes-benz-v-class-a-ine", 
    "mercedes-benz-s-class-bmw-5-a-ine",
    "mercedes-benz-e-class-bmw-5-a-ine",
    "hyundai-staria-luxury-4x4",
    "mercedes-benz-v250d-4matic-extra-long",
    "mercedes-benz-e220d",
    "mercedes-benz-e200d",
    "mercedes-benz-s400d",
    "mercedes-benz-gls400d",
  ]
  
  return staticSlugs.map((slug) => ({
    slug: slug,
  }))
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  return <VehicleDetailClient slug={params.slug} />
}
