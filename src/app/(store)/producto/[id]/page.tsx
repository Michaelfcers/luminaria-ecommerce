import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { ProductGallery } from "@/features/store/components/product-gallery"
import { ProductInfo } from "@/features/store/components/product-info"
import { ProductSpecs } from "@/features/store/components/product-specs"
import { RecommendedProducts } from "@/features/store/components/recommended-products"
import { Footer } from "@/components/layout/footer"

// Define a type for the data structure returned by the Supabase query
type ProductDetailFromDB = {
  id: string
  name: string
  description: string | null
  list_price_usd: number | null
  stock: number
  attributes: Record<string, any> | null // jsonb type
  brands: { name: string } | null
  product_media: { url: string; type: string; alt_text: string | null; is_primary: boolean }[] | null
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch product data from Supabase
  const { data: productData, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands ( name ),
      product_media ( url, type, alt_text, is_primary )
    `
    )
    .eq("id", params.id)
    .single()

  if (error || !productData) {
    console.error("Error fetching product details:", error?.message || "Product not found")
    notFound() // Render Next.js 404 page
  }

  // Process fetched data to match component props
  const images =
    productData.product_media
      ?.filter((media) => media.type === "image")
      .map((media) => media.url) || []

  const technicalSheet = productData.product_media?.find(
    (media) => media.type === "pdf"
  )?.url || undefined

  const processedProduct = {
    id: productData.id,
    name: productData.name,
    price: productData.list_price_usd ?? 0,
    originalPrice: undefined, // Not available in schema
    brand: productData.brands?.name || "Sin Marca",
    category: "Sin Categoría", // Not directly available in this query
    rating: 0, // Not available in schema
    reviews: 0, // Not available in schema
    inStock: productData.stock > 0,
    description: productData.description || "",
    features: [], // Not directly available in schema, could parse from description or attributes
    specifications: productData.attributes || {},
    images: images.length > 0 ? images : ["/placeholder.svg"], // Fallback to placeholder
    technicalSheet: technicalSheet,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">
            Inicio
          </a>
          <span>/</span>
          <a href="/productos" className="hover:text-foreground">
            Productos
          </a>
          <span>/</span>
          <span className="text-foreground">{processedProduct.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery images={processedProduct.images} productName={processedProduct.name} />
          <ProductInfo product={processedProduct} />
        </div>

        {/* Product Specifications */}
        <ProductSpecs
          features={processedProduct.features}
          specifications={processedProduct.specifications}
          technicalSheet={processedProduct.technicalSheet}
        />

        {/* Recommended Products */}
        <RecommendedProducts currentProductId={processedProduct.id} />
      </main>
      <Footer />
    </div>
  )
}
