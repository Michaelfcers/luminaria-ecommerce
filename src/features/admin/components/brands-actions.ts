"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const brandSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  slug: z.string().optional(),
})

export async function addBrand(formData: FormData) {
  const supabase = createClient()

  const rawFormData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  }

  const result = brandSchema.safeParse(rawFormData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { data, error } = await supabase
    .from("brands")
    .insert(result.data)
    .select()

  if (error) {
    console.error("Error adding brand:", error)
    return { error: { _root: [error.message] } }
  }

  revalidatePath("/admin/brands")
  return { data }
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = createClient()

  const rawFormData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  }

  const result = brandSchema.safeParse(rawFormData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { data, error } = await supabase
    .from("brands")
    .update(result.data)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating brand:", error)
    return { error: { _root: [error.message] } }
  }

  revalidatePath("/admin/brands")
  return { data }
}

export async function deleteBrand(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("brands")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error deleting brand:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/brands")
}
