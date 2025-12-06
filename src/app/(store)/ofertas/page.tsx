import { createClient } from "@/lib/supabase/server"
import { ProductsGrid } from "@/features/store/components/products-grid"

export default async function OffersPage() {
    const supabase = await createClient()

    // Fetch products that have active promotions
    const { data: productsData, error } = await supabase
        .from("products")
        .select(
            `
      id,
      name,
      created_at,
      brands ( name ),
      product_media ( url, is_primary ),
      promotion_products!inner (
        promotions!inner (
            id,
            status,
            starts_at,
            ends_at
        )
      )
    `
        )
        .eq("status", "active")
        .eq("promotion_products.promotions.status", "active")
        // Note: Filtering by date range in nested query is tricky with Supabase syntax directly in one go sometimes.
        // Ideally we filter where now() between starts_at and ends_at.
        // For simplicity, we'll fetch active status promotions and filter dates in JS if needed, 
        // or assume the status 'active' is maintained by a cron job or trigger. 
        // But let's try to add the date filter if possible.
        .lte("promotion_products.promotions.starts_at", new Date().toISOString())
        .gte("promotion_products.promotions.ends_at", new Date().toISOString())
    // Actually, gte ends_at would mean ends_at is in the future, which is what we want.
    // Wait, if ends_at is future, then now <= ends_at. So ends_at >= now. Correct.

    if (error) {
        console.error("Error fetching offers:", error)
    }

    const products = (productsData || []).map((product: any) => {
        const primaryMedia = Array.isArray(product.product_media)
            ? product.product_media.find((media: any) => media.is_primary) || product.product_media[0]
            : null

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const isNew = new Date(product.created_at) > sevenDaysAgo

        return {
            id: product.id,
            name: product.name,
            image: primaryMedia ? primaryMedia.url : "/placeholder-image.jpg",
            brand: product.brands?.name || "Sin Marca",
            isNew: isNew,
        }
    })

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Ofertas Especiales
                </h1>
                <p className="text-muted-foreground">
                    Aprovecha nuestros precios rebajados por tiempo limitado.
                </p>
            </div>

            {products.length > 0 ? (
                <ProductsGrid products={products} />
            ) : (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No hay ofertas disponibles en este momento.</p>
                </div>
            )}
        </main>
    )
}
