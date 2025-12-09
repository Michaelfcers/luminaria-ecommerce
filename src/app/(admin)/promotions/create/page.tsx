
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PromotionForm } from "@/features/admin/components/promotion-form"
import { getLocalProductImage } from "@/lib/local-images"

export default async function CreatePromotionPage() {
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

    // Fetch products for the selection list
    const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, code, product_variants(*), product_media(url, alt_text)")
        .eq("store_id", storeMembers.store_id)
        .eq("status", "active")
        .is("deleted_at", null)


    if (productsError) {
        console.error("Error fetching products:", productsError)
        return <div className="p-8 text-red-500">Error loading products. Please try again later.</div>
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
            <h1 className="text-3xl font-bold">Crear Nueva Promoción</h1>
            <PromotionForm
                storeId={storeMembers.store_id}
                products={enrichedProducts}
            />
        </div>
    )
}
