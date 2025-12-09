
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { PromotionForm } from "@/features/admin/components/promotion-form"
import { getLocalProductImage } from "@/lib/local-images"

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    // Fetch store_id
    const { data: storeMembers } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .single()

    if (!storeMembers) {
        return <div>Error: No se pudo determinar la tienda.</div>
    }

    // Fetch promotion details
    const { data: promotion, error: promoError } = await supabase
        .from("promotions")
        .select("*")
        .eq("id", resolvedParams.id)
        .single()

    if (promoError || !promotion) {
        console.error("Error fetching promotion:", promoError)
        notFound()
    }

    // Fetch linked products
    const { data: linkedProducts } = await supabase
        .from("promotion_products")
        .select("product_id")
        .eq("promotion_id", resolvedParams.id)

    const initialProductIds = linkedProducts?.map(p => p.product_id) || []

    // Fetch linked variants
    const { data: linkedVariants } = await supabase
        .from("promotion_variants")
        .select("variant_id")
        .eq("promotion_id", resolvedParams.id)

    const initialVariantIds = linkedVariants?.map(v => v.variant_id) || []

    // Fetch all products for selection
    // Fetch all products for selection
    const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, code, product_variants(*), product_media(url, alt_text)")
        .eq("store_id", storeMembers.store_id)
        .eq("status", "active")
        .is("deleted_at", null)


    if (productsError) {
        console.error("Error fetching products:", productsError)
        return <div>Error loading products.</div>
    }


    // Enrich products with local images if needed
    const enrichedProducts = await Promise.all((products || []).map(async (product) => {
        let codeToUse = product.code
        if (!codeToUse && product.product_variants && product.product_variants.length > 0) {
            codeToUse = product.product_variants[0].code
        }

        const localImage = await getLocalProductImage(codeToUse)

        if (localImage) {
            return {
                ...product,
                product_media: [{ url: localImage, alt_text: product.name }]
            }
        }

        return product
    }))

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <h1 className="text-3xl font-bold">Editar Promoción</h1>
            <PromotionForm
                storeId={storeMembers.store_id}
                products={enrichedProducts}
                initialData={promotion}
                initialProductIds={initialProductIds}
                initialVariantIds={initialVariantIds}
                isEditing={true}
            />
        </div>
    )
}
