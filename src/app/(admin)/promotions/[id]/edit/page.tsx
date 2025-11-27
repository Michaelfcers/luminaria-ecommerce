import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { PromotionForm } from "@/features/admin/components/promotion-form"

export default async function EditPromotionPage({ params }: { params: { id: string } }) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

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
        .eq("id", params.id)
        .single()

    if (promoError || !promotion) {
        console.error("Error fetching promotion:", promoError)
        notFound()
    }

    // Fetch linked products
    const { data: linkedProducts } = await supabase
        .from("promotion_products")
        .select("product_id")
        .eq("promotion_id", params.id)

    const initialProductIds = linkedProducts?.map(p => p.product_id) || []

    // Fetch linked variants
    const { data: linkedVariants } = await supabase
        .from("promotion_variants")
        .select("variant_id")
        .eq("promotion_id", params.id)

    const initialVariantIds = linkedVariants?.map(v => v.variant_id) || []

    // Fetch all products for selection
    const { data: products } = await supabase
        .from("products")
        .select("id, name, product_variants(id, name, attributes)")
        .eq("store_id", storeMembers.store_id)
        .eq("status", "active")
        .is("deleted_at", null)

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <h1 className="text-3xl font-bold">Editar Promoción</h1>
            <PromotionForm
                storeId={storeMembers.store_id}
                products={products || []}
                initialData={promotion}
                initialProductIds={initialProductIds}
                initialVariantIds={initialVariantIds}
                isEditing={true}
            />
        </div>
    )
}
