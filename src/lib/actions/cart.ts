"use server"

import { createClient } from "@/lib/supabase/server"
import { getLocalProductImage } from "@/lib/local-images"
import { CartItem } from "@/hooks/use-cart"

export async function getCartItemsAction(cartId: string): Promise<CartItem[]> {
    const supabase = await createClient()

    const { data: items, error } = await supabase
        .from("cart_items")
        .select(
            `
      id,
      quantity,
      product_variants (
        id,
        name,
        code,
        list_price_usd,
        products (
          name,
          code,
          product_media (
            url,
            is_primary
          ),
          promotion_products (
            promotions (
                id,
                type,
                value,
                status,
                starts_at,
                ends_at
            )
          )
        ),
        promotion_variants (
            promotions (
                id,
                type,
                value,
                status,
                starts_at,
                ends_at
            )
        )
      )
    `
        )
        .eq("cart_id", cartId)

    if (error) {
        console.error("Error fetching cart items:", error)
        return []
    }

    // Process items and resolve images
    const processedItems = await Promise.all(
        items.map(async (item: any) => {
            const product = item.product_variants.products
            const variant = item.product_variants

            // Determine the code to use for image lookup
            // Try variant code first, then product code
            let codeToUse = variant.code
            if (!codeToUse) {
                codeToUse = product.code
            }

            // Try to get local image first
            const localImage = await getLocalProductImage(codeToUse)
            let imageUrl = "/placeholder-image.jpg"

            if (localImage) {
                imageUrl = localImage
            } else {
                const primaryMedia = Array.isArray(product.product_media)
                    ? product.product_media.find((media: any) => media.is_primary)
                    : null

                if (primaryMedia) {
                    imageUrl = primaryMedia.url
                } else if (product.product_media && product.product_media.length > 0) {
                    imageUrl = product.product_media[0].url
                }
            }

            // Calculate Price with Promotion
            let price = variant.list_price_usd
            let originalPrice = undefined
            let discount = undefined

            // 1. Check for variant-specific promotion
            let activePromotion = variant.promotion_variants?.find((pv: any) => {
                const promo = pv.promotions
                if (promo.status !== "active") return false
                const now = new Date()
                const start = promo.starts_at ? new Date(promo.starts_at) : null
                const end = promo.ends_at ? new Date(promo.ends_at) : null

                if (start && now < start) return false
                if (end && now > end) return false

                return true
            })?.promotions

            // 2. Fallback to product-level promotion
            if (!activePromotion) {
                activePromotion = product.promotion_products?.find((pp: any) => {
                    const promo = pp.promotions
                    if (promo.status !== "active") return false
                    const now = new Date()
                    const start = promo.starts_at ? new Date(promo.starts_at) : null
                    const end = promo.ends_at ? new Date(promo.ends_at) : null

                    if (start && now < start) return false
                    if (end && now > end) return false

                    return true
                })?.promotions
            }

            if (activePromotion) {
                originalPrice = price
                if (activePromotion.type === "percentage") {
                    price = price * (1 - activePromotion.value / 100)
                    discount = activePromotion.value
                } else if (activePromotion.type === "amount") {
                    price = Math.max(0, price - activePromotion.value)
                    discount = activePromotion.value
                }
            }

            return {
                id: variant.id,
                name: `${product.name} ${variant.name ? `- ${variant.name}` : ""}`,
                price: price,
                originalPrice: originalPrice,
                discount: discount,
                image: imageUrl,
                quantity: item.quantity,
                cartItemId: item.id,
            }
        })
    )

    return processedItems
}
