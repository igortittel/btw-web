interface VehicleImage {
  node: {
    sourceUrl: string
  }
}

interface VehicleDescription {
  nazov: string
  kategoria: string
  cena: string
  osoby: string
  batozina: string
  prevodovka: string
  palivo: string
  typ: string
  popis: string
  // New ACF fields (optional to avoid breaking when not exposed in WPGraphQL yet)
  motorizacia?: string
  komfort?: string
  technologie?: string
  sluzbyVCene?: string

  nahlad: VehicleImage
  lightbox1: VehicleImage
  lightbox2: VehicleImage
  lightbox3: VehicleImage
}

export interface Vehicle {
  title: string
  slug: string
  popisVozidla: VehicleDescription
}

interface GraphQLResponse {
  vozidla: {
    nodes: Vehicle[]
  }
}

// const GRAPHQL_ENDPOINT = "https://btwp.bendo.dev/graphql"
const GRAPHQL_ENDPOINT = "https://wp.btw.sk/graphql"

const VEHICLES_QUERY = `
{
  vozidla {
    nodes {
      title
      slug
      popisVozidla {
        nazov
        kategoria
        cena
        osoby
        batozina
        prevodovka
        palivo
        typ
        popis
        motorizacia
        komfort
        technologie
        sluzbyVCene
        nahlad {
          node {
            sourceUrl
          }
        }
        lightbox1 {
          node {
            sourceUrl
          }
        }
        lightbox2 {
          node {
            sourceUrl
          }
        }
        lightbox3 {
          node {
            sourceUrl
          }
        }
      }
    }
  }
}
`

const VEHICLES_QUERY_PARTIAL = `
{
  vozidla {
    nodes {
      title
      slug
      popisVozidla {
        nazov
        kategoria
        cena
        osoby
        batozina
        prevodovka
        palivo
        typ
        popis
        komfort
        technologie
        sluzbyVCene
        nahlad { node { sourceUrl } }
        lightbox1 { node { sourceUrl } }
        lightbox2 { node { sourceUrl } }
        lightbox3 { node { sourceUrl } }
      }
    }
  }
}
`

const VEHICLES_QUERY_FALLBACK = `
{
  vozidla {
    nodes {
      title
      slug
      popisVozidla {
        nazov
        kategoria
        cena
        osoby
        batozina
        prevodovka
        palivo
        typ
        popis        
        nahlad { node { sourceUrl } }
        lightbox1 { node { sourceUrl } }
        lightbox2 { node { sourceUrl } }
        lightbox3 { node { sourceUrl } }
      }
    }
  }
}
`

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    console.log("🚗 Fetching vehicles from GraphQL API...")
    let queryMode: "FULL" | "PARTIAL" | "FALLBACK" = "FULL"

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: VEHICLES_QUERY,
      }),
    })

    let data: { data?: GraphQLResponse; errors?: Array<{ message?: string }> } =
      await response.json()

    // GraphQL can return 200 even when the query fails
    if (data.errors && data.errors.length > 0) {
      console.error("❌ GraphQL errors (primary query):", data.errors)

      // 1) Try PARTIAL query (keeps new WYSIWYG fields if schema supports them)
      console.warn("↩️ Retrying with PARTIAL query (without motorizacia)...")
      queryMode = "PARTIAL"
      const partialResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: VEHICLES_QUERY_PARTIAL,
        }),
      })

      const partialData: {
        data?: GraphQLResponse
        errors?: Array<{ message?: string }>
      } = await partialResponse.json()

      if (!partialData.errors || partialData.errors.length === 0) {
        data = partialData
      } else {
        console.error("❌ GraphQL errors (partial query):", partialData.errors)

        // 2) Final fallback (loads vehicles even if schema is out of sync)
        console.warn("↩️ Retrying with FALLBACK query (without new ACF fields)...")
        queryMode = "FALLBACK"
        const fallbackResponse = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: VEHICLES_QUERY_FALLBACK,
          }),
        })

        const fallbackData: {
          data?: GraphQLResponse
          errors?: Array<{ message?: string }>
        } = await fallbackResponse.json()

        if (fallbackData.errors && fallbackData.errors.length > 0) {
          console.error("❌ GraphQL errors (fallback query):", fallbackData.errors)
          throw new Error(
            fallbackData.errors[0]?.message || "GraphQL fallback query failed",
          )
        }

        data = fallbackData
      }
    }

    // Debug: Log the entire response
    console.log("📦 Raw GraphQL response:", JSON.stringify(data, null, 2))

    if (!data.data || !data.data.vozidla) {
      console.error("❌ Invalid GraphQL response structure:", data)
      throw new Error("Invalid GraphQL response structure")
    }

    const vehicles = data.data.vozidla.nodes
    console.log(`✅ Successfully fetched ${vehicles.length} vehicles`)
    console.log("✅ Vehicles loaded using query mode:", queryMode)

    // Enhanced debugging - log each vehicle's complete data
    console.log("📊 Detailed vehicle analysis:")
    vehicles.forEach((vehicle, index) => {
      const typ = vehicle.popisVozidla?.typ
      const typType = typeof typ
      const typValue = typ ? String(typ).trim() : "EMPTY"

      console.log(`${index + 1}. "${vehicle.title}"`)
      console.log(`   - Typ: "${typValue}" (${typType})`)
      console.log(`   - Slug: "${vehicle.slug}"`)
      console.log(`   - Has popisVozidla:`, !!vehicle.popisVozidla)
      console.log("   ---")
    })

    return vehicles
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error)
    return []
  }
}

export async function fetchVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const vehicles = await fetchVehicles()
    const vehicle = vehicles.find((v) => v.slug === slug)

    if (vehicle) {
      console.log(`✅ Found vehicle: ${vehicle.title}`)
      return vehicle
    } else {
      console.log(`❌ Vehicle not found for slug: ${slug}`)
      return null
    }
  } catch (error) {
    console.error("❌ Error fetching vehicle by slug:", error)
    return null
  }
}

// Helper function to get safe image URL
export function getImageUrl(
  image: VehicleImage | null | undefined,
  fallback = "/placeholder.svg?height=300&width=400",
): string {
  return image?.node?.sourceUrl || fallback
}

// Helper function to format price - Fixed to handle different data types
export function formatPrice(price: string | number | null | undefined): string {
  // Handle null, undefined, or empty values
  if (!price || price === "" || price === "0") {
    return "Cena na vyžiadanie"
  }

  // Convert to string if it's a number
  const priceStr = typeof price === "string" ? price : String(price)

  // Check if it already contains currency symbol
  if (priceStr.includes("€") || priceStr.includes("EUR")) {
    return priceStr
  }

  // Add € symbol if it's just a number
  return `${priceStr} €`
}

// Helper function to get vehicle specs - Added safety checks
export function getVehicleSpecs(vehicle: Vehicle) {
  const desc = vehicle.popisVozidla
  return {
    transmission: desc?.prevodovka || "Automat",
    fuel: desc?.palivo || "Diesel",
    passengers: desc?.osoby || "7 osôb",
    type: desc?.typ || "Van",
    luggage: desc?.batozina || "3",
  }
}

// Helper function to determine if vehicle is for rental
export function isRentalVehicle(vehicle: Vehicle): boolean {
  if (!vehicle || !vehicle.popisVozidla) {
    console.log(`❌ Vehicle missing popisVozidla:`, vehicle?.title || "Unknown")
    return false
  }

  const typ = vehicle.popisVozidla.typ

  console.log(`🔍 Rental check: "${vehicle.title}"`)
  console.log(`   - Raw typ:`, typ)
  console.log(`   - Type of typ:`, typeof typ)

  // Handle null, undefined, or non-string values
  if (typ === null || typ === undefined) {
    console.log(`   ❌ Typ is null/undefined`)
    return false
  }

  // Convert to string and normalize
  const typStr = String(typ).trim().toLowerCase()
  console.log(`   - Normalized typ: "${typStr}"`)

  // Check if it's a rental vehicle
  const isRental = typStr === "prenajom"
  console.log(`   ${isRental ? "✅" : "❌"} Is rental: ${isRental}`)

  return isRental
}

// Helper function to determine if vehicle is for transport/transfer
export function isTransferVehicle(vehicle: Vehicle): boolean {
  if (!vehicle || !vehicle.popisVozidla) {
    console.log(`❌ Vehicle missing popisVozidla:`, vehicle?.title || "Unknown")
    return false
  }

  const typ = vehicle.popisVozidla.typ

  console.log(`🔍 Transfer check: "${vehicle.title}"`)
  console.log(`   - Raw typ:`, typ)
  console.log(`   - Type of typ:`, typeof typ)

  // Handle null, undefined, or non-string values
  if (typ === null || typ === undefined) {
    console.log(`   ❌ Typ is null/undefined`)
    return false
  }

  // Convert to string and normalize
  const typStr = String(typ).trim().toLowerCase()
  console.log(`   - Normalized typ: "${typStr}"`)

  // Check if it's a transfer vehicle
  const isTransfer = typStr === "transfer"
  console.log(`   ${isTransfer ? "✅" : "❌"} Is transfer: ${isTransfer}`)

  return isTransfer
}

// Helper function to get transfer category display name
export function getTransferCategory(vehicle: Vehicle): string {
  const category = vehicle.popisVozidla?.kategoria || ""

  if (category.toLowerCase().includes("business")) return "Business Class"
  if (category.toLowerCase().includes("first")) return "First Class"
  if (category.toLowerCase().includes("van")) return "Business Van"

  return category || "Transfer"
}
