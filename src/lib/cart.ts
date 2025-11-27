import { createClient } from "@/lib/supabase/client"
import { Cart, CartItem } from "@/hooks/use-cart"

const supabase = createClient()

export async function getOrCreateUserCart(userId: string): Promise<Cart> {
  // First, try to get the user's cart
  let { data: cart, error } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "No rows found"
    throw new Error(error.message)
  }

  // If no cart, create one
  if (!cart) {
    const { data: newCart, error: newCartError } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select()
      .single()

    if (newCartError) {
      throw new Error(newCartError.message)
    }
    cart = newCart
  }

  return cart as Cart
}

export async function getCartItems(cartId: string): Promise<CartItem[]> {
  const { data: items, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product_variants (
        id,
        name,
        list_price_usd,
        products (
          name,
          product_media (
            url,
            is_primary
          )
        )
      )
    `
    )
    .eq("cart_id", cartId)
  // We can't strictly filter by is_primary here easily in a nested query without potentially filtering out the parent row if no primary image exists.
  // So we fetch media and filter in JS, or we could use a more complex query.
  // Given the schema, fetching all media for the product might be okay if there aren't many, but let's try to be efficient.
  // For now, fetching all and finding primary in JS is safer than a complex join that might exclude items without images.

  if (error) {
    console.error("Error fetching cart items:", error)
    return []
  }

  return items.map((item: any) => {
    const product = item.product_variants.products
    const variant = item.product_variants

    // Find primary image, or fallback to first image, or default placeholder
    const primaryImage = product.product_media?.find((m: any) => m.is_primary) || product.product_media?.[0]
    const imageUrl = primaryImage ? primaryImage.url : "/placeholder-image.jpg" // You might want a real placeholder asset

    return {
      id: variant.id,
      name: `${product.name} ${variant.name ? `- ${variant.name}` : ""}`,
      price: variant.list_price_usd,
      image: imageUrl,
      quantity: item.quantity,
      cartItemId: item.id,
    }
  })
}

export async function addItemToCart(cartId: string, variantId: string, quantity: number, price: number) {
  const { error } = await supabase.from("cart_items").insert({
    cart_id: cartId,
    variant_id: variantId,
    quantity,
    price_at_add: price,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function removeCartItem(cartItemId: number) {
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function clearCart(cartId: string) {
  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId)

  if (error) {
    throw new Error(error.message)
  }
}
