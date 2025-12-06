"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import * as z from "zod"

const productFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  description: z.string().optional(),
  code: z.string().optional(),
  store_id: z.string().nonempty("La tienda es obligatoria."),
  brand_id: z.string().nonempty("La marca es obligatoria."),
  status: z.enum(["draft", "active", "inactive"]),
  sourcing_status: z
    .enum(["active", "backorder", "discontinued"])
    .optional(),
  life_hours: z.coerce.number().int().optional(),
  lumens: z.coerce.number().int().optional(),
  pieces_per_box: z.coerce.number().int().optional(),
  list_price_usd: z.coerce.number().min(0, "El precio debe ser positivo."),
  currency: z.string().optional(),
  stock: z.coerce.number().int("El stock debe ser un número entero."),
  attributes: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        try {
          JSON.parse(val)
          return true
        } catch (e) {
          return false
        }
      },
      { message: "Debe ser un JSON válido." }
    ),
  category_ids: z.array(z.string()).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export async function addProduct(values: ProductFormValues) {
  const supabase = await createClient()
  const { category_ids, ...productData } = values

  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single()

  if (productError) {
    console.error("Error adding product:", productError)
    return { error: productError.message }
  }

  const productId = newProduct.id
  if (category_ids && category_ids.length > 0) {
    const productCategories = category_ids.map((categoryId) => ({
      product_id: productId,
      category_id: Number(categoryId),
    }))

    const { error: categoryError } = await supabase
      .from("product_categories")
      .insert(productCategories)

    if (categoryError) {
      console.error("Error adding product categories:", categoryError)
      return { error: categoryError.message }
    }
  }

  revalidatePath("/products")
  return { data: newProduct }
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const supabase = await createClient()
  const { category_ids, ...productData } = values

  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating product:", error)
    return { error: error.message }
  }

  const { error: deleteError } = await supabase
    .from("product_categories")
    .delete()
    .eq("product_id", id)

  if (deleteError) {
    console.error("Error deleting old product categories:", deleteError)
    return { error: deleteError.message }
  }

  if (category_ids && category_ids.length > 0) {
    const productCategories = category_ids.map((categoryId) => ({
      product_id: id,
      category_id: Number(categoryId),
    }))

    const { error: insertError } = await supabase
      .from("product_categories")
      .insert(productCategories)

    if (insertError) {
      console.error("Error inserting new product categories:", insertError)
      return { error: insertError.message }
    }
  }

  revalidatePath("/products")
  revalidatePath(`/products/${id}/edit`)
  return { data }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return { error: error.message }
  }

  revalidatePath("/products")
}