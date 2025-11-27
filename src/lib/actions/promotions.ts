"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function createPromotion(data: any, productIds: string[], variantIds: string[] = []) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // 1. Create Promotion
    const { data: promotion, error: promoError } = await supabase
        .from("promotions")
        .insert(data)
        .select()
        .single()

    if (promoError) {
        console.error("Error creating promotion:", promoError)
        return { error: promoError.message }
    }

    // 2. Link Products
    if (productIds.length > 0) {
        const promoProducts = productIds.map((pid) => ({
            promotion_id: promotion.id,
            product_id: pid,
        }))

        const { error: linkError } = await supabase
            .from("promotion_products")
            .insert(promoProducts)

        if (linkError) {
            console.error("Error linking products to promotion:", linkError)
            return { error: "Promotion created but failed to link products: " + linkError.message }
        }
    }

    // 3. Link Variants
    if (variantIds.length > 0) {
        const promoVariants = variantIds.map((vid) => ({
            promotion_id: promotion.id,
            variant_id: vid,
        }))

        const { error: linkError } = await supabase
            .from("promotion_variants")
            .insert(promoVariants)

        if (linkError) {
            console.error("Error linking variants to promotion:", linkError)
            return { error: "Promotion created but failed to link variants: " + linkError.message }
        }
    }

    revalidatePath("/promotions")
    revalidatePath("/ofertas")
    return { error: null, data: promotion }
}

export async function updatePromotion(id: string, data: any, productIds: string[], variantIds: string[] = []) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // 1. Update Promotion Details
    const { error: promoError } = await supabase
        .from("promotions")
        .update(data)
        .eq("id", id)

    if (promoError) {
        console.error("Error updating promotion:", promoError)
        return { error: promoError.message }
    }

    // 2. Update Linked Products
    // First, delete existing links
    const { error: deleteError } = await supabase
        .from("promotion_products")
        .delete()
        .eq("promotion_id", id)

    if (deleteError) {
        console.error("Error clearing old promotion products:", deleteError)
        return { error: deleteError.message }
    }

    // Then insert new ones
    if (productIds.length > 0) {
        const promoProducts = productIds.map((pid) => ({
            promotion_id: id,
            product_id: pid,
        }))

        const { error: linkError } = await supabase
            .from("promotion_products")
            .insert(promoProducts)

        if (linkError) {
            console.error("Error relinking products to promotion:", linkError)
            return { error: linkError.message }
        }
    }

    // 3. Update Linked Variants
    // First, delete existing links
    const { error: deleteVariantsError } = await supabase
        .from("promotion_variants")
        .delete()
        .eq("promotion_id", id)

    if (deleteVariantsError) {
        console.error("Error clearing old promotion variants:", deleteVariantsError)
        return { error: deleteVariantsError.message }
    }

    // Then insert new ones
    if (variantIds.length > 0) {
        const promoVariants = variantIds.map((vid) => ({
            promotion_id: id,
            variant_id: vid,
        }))

        const { error: linkError } = await supabase
            .from("promotion_variants")
            .insert(promoVariants)

        if (linkError) {
            console.error("Error relinking variants to promotion:", linkError)
            return { error: linkError.message }
        }
    }

    revalidatePath("/promotions")
    revalidatePath("/ofertas")
    return { error: null }
}

export async function deletePromotion(id: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.from("promotions").delete().eq("id", id)

    if (error) {
        console.error("Error deleting promotion:", error)
        return { error: error.message }
    }

    revalidatePath("/promotions")
    revalidatePath("/ofertas")
    return { error: null }
}
