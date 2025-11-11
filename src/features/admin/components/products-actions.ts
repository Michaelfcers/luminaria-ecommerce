"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addProduct(formData: FormData) {
  const supabase = createClient()

  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    brand_id: formData.get("brand_id") as string,
    status: formData.get("status") as string,
    list_price_usd: Number(formData.get("list_price_usd")),
    stock: Number(formData.get("stock")),
    category_ids: formData.getAll("category_ids[]") as string[],
  }

  // TODO: Add validation logic here (e.g., using Zod)

  const { data: productData, error: productError } = await supabase
    .from("products")
    .insert([
      {
        name: rawFormData.name,
        description: rawFormData.description,
        brand_id: rawFormData.brand_id,
        status: rawFormData.status,
        list_price_usd: rawFormData.list_price_usd,
        stock: rawFormData.stock,
      },
    ])
    .select()
    .single()

  if (productError) {
    console.error("Error adding product:", productError)
    return { error: productError.message }
  }

  const productId = productData.id
  if (rawFormData.category_ids.length > 0) {
    const productCategories = rawFormData.category_ids.map((categoryId) => ({
      product_id: productId,
      category_id: categoryId,
    }))

    const { error: categoryError } = await supabase
      .from("product_categories")
      .insert(productCategories)

    if (categoryError) {
      console.error("Error adding product categories:", categoryError)
      // Optionally handle rollback or further error logging
      return { error: categoryError.message }
    }
  }

  revalidatePath("/products")
  return { data: productData }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient()

  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    brand_id: formData.get("brand_id") as string,
    status: formData.get("status") as string,
    list_price_usd: Number(formData.get("list_price_usd")),
    stock: Number(formData.get("stock")),
    category_ids: formData.getAll("category_ids[]") as string[],
  }

  // TODO: Add validation

  const { data, error } = await supabase
    .from("products")
    .update({
      name: rawFormData.name,
      description: rawFormData.description,
      brand_id: rawFormData.brand_id,
      status: rawFormData.status,
      list_price_usd: rawFormData.list_price_usd,
      stock: rawFormData.stock,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating product:", error)
    return { error: error.message }
  }

  // First, delete existing categories for the product
  const { error: deleteError } = await supabase
    .from("product_categories")
    .delete()
    .eq("product_id", id)

  if (deleteError) {
    console.error("Error deleting old product categories:", deleteError)
    return { error: deleteError.message }
  }

  // Then, insert the new ones
  if (rawFormData.category_ids.length > 0) {
    const productCategories = rawFormData.category_ids.map((categoryId) => ({
      product_id: id,
      category_id: categoryId,
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
  const supabase = createClient()

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

