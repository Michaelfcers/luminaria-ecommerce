import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/features/store/components/product-detail-client"
import { RecommendedProducts } from "@/features/store/components/recommended-products"

type ProductVariant = {
  id: string
  [key: string]: any
}

type ProductMedia = {
  url: string
  type: string
  alt_text: string | null
  is_primary: boolean
}

type ProductDetailFromDB = {
  id: string
  name: string
  description: string | null
  attributes: Record<string, any> | null
  product_media: ProductMedia[] | null
  product_variants: ProductVariant[] | null
  [key: string]: any
}

export type RecommendedProduct = {
  id: string
  name: string
  price: number | null
  image: string
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: productData, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands ( name ),
      product_media ( url, type, alt_text, is_primary ),
      product_variants ( * )
    `
    )
    .eq("id", params.id)
    .single()

  if (error || !productData) {
    console.error("Error fetching product details:", error?.message || "Product not found")
    notFound()
  }

  // Fetch recommended products
  const { data: recommendedProductsData } = await supabase
    .from("products")
    .select("id, name, list_price_usd, product_media(url, is_primary)")
    .neq("id", params.id)
    .limit(10)

  const product = productData as ProductDetailFromDB
  const technicalSheet = product.product_media?.find((media) => media.type === "pdf")?.url

  const recommendedProducts: RecommendedProduct[] = (recommendedProductsData || []).map(
    (p: any) => ({
      id: p.id,
      name: p.name,
      price: p.list_price_usd,
      image: "/products/luminaria-plafon.webp",
    })
  )

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <ProductDetailClient
          product={product}
          technicalSheet={technicalSheet}
        />
        <div className="mt-16">
          <RecommendedProducts
            currentProductId={product.id}
            recommendedProducts={recommendedProducts}
          />
        </div>
      </main>
    </div>
  )
}

