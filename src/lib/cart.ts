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
      products (
        id,
        name,
        list_price_usd,
        product_media (
          url,
          is_primary
        )
      )
    `
    )
    .eq("cart_id", cartId)

  if (error) {
    console.error("Error fetching cart items:", error)
    return []
  }

  return items.map((item: any) => ({
    id: item.products.id,
    name: item.products.name,
    price: item.products.list_price_usd,
    image: item.products.product_media.find((m: any) => m.is_primary)?.url || item.products.product_media[0]?.url,
    quantity: item.quantity,
    cartItemId: item.id,
  }))
}

export async function addItemToCart(cartId: string, productId: string, quantity: number, price: number) {
  const { error } = await supabase.from("cart_items").insert({
    cart_id: cartId,
    product_id: productId,
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
