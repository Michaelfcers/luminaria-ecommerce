
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PromotionForm } from "@/features/admin/components/promotion-form"

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
    const { data: products } = await supabase
        .from("products")
        .select("id, name, product_variants(id, name, attributes)")
        .eq("store_id", storeMembers.store_id)
        .eq("status", "active")
        .is("deleted_at", null)

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <h1 className="text-3xl font-bold">Crear Nueva Promoción</h1>
            <PromotionForm
                storeId={storeMembers.store_id}
                products={products || []}
            />
        </div>
    )
}
