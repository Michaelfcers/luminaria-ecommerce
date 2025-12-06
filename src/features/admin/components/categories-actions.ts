"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  slug: z.string().optional(),
  parent_id: z.coerce.number().optional(),
})

export async function addCategory(formData: FormData) {
  const supabase = await createClient()

  const rawFormData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    parent_id: formData.get("parent_id") ? Number(formData.get("parent_id")) : undefined,
  }

  const result = categorySchema.safeParse(rawFormData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { data, error } = await supabase
    .from("categories")
    .insert(result.data)
    .select()

  if (error) {
    console.error("Error adding category:", error)
    return { error: { _root: [error.message] } }
  }

  revalidatePath("/admin/categories")
  return { data }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawFormData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    parent_id: formData.get("parent_id") ? Number(formData.get("parent_id")) : undefined,
  }

  const result = categorySchema.safeParse(rawFormData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { data, error } = await supabase
    .from("categories")
    .update(result.data)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating category:", error)
    return { error: { _root: [error.message] } }
  }

  revalidatePath("/admin/categories")
  return { data }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
}
