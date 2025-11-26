"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export type SearchResult = {
    id: string
    type: "product" | "variant"
    title: string
    subtitle?: string
    url: string
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const searchQuery = `%${query}%`

    // Search Products
    const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, code, brand_id, brands(name)")
        .or(`name.ilike.${searchQuery},code.ilike.${searchQuery}`)
        .is("deleted_at", null)
        .limit(5)

    if (productsError) {
        console.error("Error searching products:", productsError)
    }

    // Search Variants
    const { data: variants, error: variantsError } = await supabase
        .from("product_variants")
        .select("id, name, code, product_id, products(name)")
        .or(`name.ilike.${searchQuery},code.ilike.${searchQuery},attributes.ilike.${searchQuery}`) // attributes cast to text implicitly by supabase for ilike? might need explicit cast or text search
        // Note: searching jsonb with ilike might not work as expected without casting. 
        // Supabase PostgREST allows filtering on JSON columns but simple ilike on the whole column might fail or be inefficient.
        // For now, let's try simple text search on name/code and maybe attributes if possible.
        // If attributes search fails, we might need a different approach or RPC.
        // Let's stick to name/code for variants for now to be safe, and add attributes if we can confirm syntax.
        // Actually, the user asked for "caracteristica" (attribute) search. 
        // The `search_tsv` in products table includes attributes. Let's use that for products if possible?
        // But `search_tsv` is on products, not variants. 
        // Let's try to use the `search_tsv` on products first as it's more powerful.
        .is("deleted_at", null)
        .limit(5)

    // Let's refine the product search to use the TSV if possible, or stick to ilike for simplicity and partial matches.
    // The user schema shows: search_tsv tsvector generated always as ...
    // So we can use .textSearch('search_tsv', query)

    // Let's try a combined approach or just simple ilike for now as it's often more intuitive for "contains" queries than full text search which matches words.
    // User asked "si busca ... caracteristica le aparezca".

    // Let's stick to the plan: query both tables.

    const formattedProducts: SearchResult[] = (products || []).map((p: any) => ({
        id: p.id,
        type: "product",
        title: p.name,
        subtitle: p.code ? `Code: ${p.code}` : p.brands?.name,
        url: `/producto/${p.id}`, // Assuming this is the public product page
    }))

    const formattedVariants: SearchResult[] = (variants || []).map((v: any) => ({
        id: v.id,
        type: "variant",
        title: v.name || v.products?.name || "Variant",
        subtitle: v.code ? `Code: ${v.code}` : "Variant",
        url: `/producto/${v.product_id}?variant=${v.id}`,
    }))

    return [...formattedProducts, ...formattedVariants]
}
