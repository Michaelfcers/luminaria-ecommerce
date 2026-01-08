"use server"

import { createClient } from "@/lib/supabase/server"

export async function getProductsByCategory(categoryId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("products")
        .select("id, name, product_categories!inner(category_id)")
        .eq("product_categories.category_id", categoryId)
        .eq("status", "active")
        .order("name")

    if (error) {
        console.error("Error fetching products by category:", error)
        return []
    }

    return data.map((item) => ({
        id: item.id,
        name: item.name,
    }))
}
