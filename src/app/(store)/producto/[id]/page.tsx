import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/features/store/components/product-detail-client"
import { RecommendedProducts } from "@/features/store/components/recommended-products"
import { Product, ProductMedia } from "@/features/store/types"
import { getLocalProductImage } from "@/lib/local-images"

export type RecommendedProduct = {
  id: string
  name: string
  price: number | null
  image: string
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: productData, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands ( name ),
      product_media ( url, is_primary ),
      promotion_products (
        promotions (
            id,
            name,
            type,
            value,
            status,
            starts_at,
            ends_at
        )
      ),
      product_variants (
        *,
        product_variant_media ( url, type, alt_text, is_primary ),
        promotion_variants (
            promotions (
                id,
                name,
                type,
                value,
                status,
                starts_at,
                ends_at
            )
        )
      )
    `
    )
    .eq("id", resolvedParams.id)
    .single()

  if (error || !productData) {
    console.error("Error fetching product details:", error?.message || "Product not found")
    notFound()
  }

  // Fetch recommended products
  const { data: recommendedProductsData } = await supabase
    .from("products")
    .select("id, name, list_price_usd, product_media(url, is_primary)")
    .neq("id", resolvedParams.id)
    .limit(10)

  const product = productData as Product

  // Enrich variants with local images
  if (product.product_variants) {
    product.product_variants = await Promise.all(
      product.product_variants.map(async (variant) => {
        const localImage = await getLocalProductImage(variant.code)
        return {
          ...variant,
          localImage: localImage || undefined
        }
      })
    )
  }

  // Determine initial image
  let initialImage = "/placeholder-image.jpg"

  // 1. Try product code
  const productLocalImage = await getLocalProductImage(product.code)
  if (productLocalImage) {
    initialImage = productLocalImage
  } else {
    // 2. Try first variant code
    if (product.product_variants && product.product_variants.length > 0) {
      // @ts-ignore
      const firstVariantImage = product.product_variants[0].localImage
      if (firstVariantImage) {
        initialImage = firstVariantImage
      }
    }

    // 3. Fallback to product_media if no local image found (and if we hadn't already found one)
    if (initialImage === "/placeholder-image.jpg") {
      const primaryMedia = Array.isArray(product.product_media)
        ? product.product_media.find((media) => media.is_primary)
        : null
      if (primaryMedia) {
        initialImage = primaryMedia.url
      }
    }
  }

  // technicalSheet will now be handled within ProductDetailClient


  const recommendedProducts: RecommendedProduct[] = (recommendedProductsData || []).map(
    (p: any) => {
      const primaryMedia = Array.isArray(p.product_media)
        ? p.product_media.find((media: any) => media.is_primary) || p.product_media[0]
        : null

      return {
        id: p.id,
        name: p.name,
        price: p.list_price_usd,
        image: primaryMedia ? primaryMedia.url : "/placeholder-image.jpg",
      }
    }
  )

  // Extract active promotion
  const activePromotion = productData.promotion_products?.find((pp: any) => {
    const promo = pp.promotions
    if (promo.status !== 'active') return false
    const now = new Date()
    const start = promo.starts_at ? new Date(promo.starts_at) : null
    const end = promo.ends_at ? new Date(promo.ends_at) : null

    if (start && now < start) return false
    if (end && now > end) return false

    return true
  })?.promotions

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <ProductDetailClient product={product} promotion={activePromotion} initialImage={initialImage} />
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

