"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function updateVariant(variantId: string, data: any) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from("product_variants")
    .update(data)
    .eq("id", variantId)

  if (error) {
    console.error("Error updating variant:", error)
    return { error: error.message }
  }

  // Revalidate the product page to show the updated data
  revalidatePath(`/products/.*/versions`)
  revalidatePath(`/products/.*`)


  return { error: null }
}

export async function createVariant(productId: string, data: any) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: newVariant, error } = await supabase
    .from("product_variants")
    .insert({ ...data, product_id: productId })
    .select()
    .single()

  if (error) {
    console.error("Error creating variant:", error)
    return { error: error.message }
  }

  revalidatePath(`/products/${productId}/versions`)
  revalidatePath(`/products/${productId}`)

  return { error: null, data: newVariant }
}
