"use client"

import { useState } from "react"
import { Button } from "@mantine/core"
import { IconShoppingCart, IconCheck } from "@tabler/icons-react"
import { createClient } from "@/lib/supabase/client"
import { getOrCreateUserCart, addItemToCart } from "@/lib/cart"
import { notifications } from "@mantine/notifications"
import { Product, ProductVariant } from "@/features/products/types"

export function AddToCartButton({
  variant,
  product,
}: {
  variant: ProductVariant | null
  product: Product
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const handleAddToCart = async () => {
    if (!variant) {
      notifications.show({
        title: "Error",
        message: "Por favor, selecciona una versión del producto.",
        color: "red",
      })
      return
    }

    setIsAdding(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      notifications.show({
        title: "Error",
        message: "Debes iniciar sesión para añadir productos al carrito.",
        color: "red",
      })
      setIsAdding(false)
      return
    }

    try {
      const cart = await getOrCreateUserCart(user.id)
      await addItemToCart(cart.id, variant.id, 1, variant.list_price_usd)

      setIsSuccess(true)
      notifications.show({
        title: "¡Añadido!",
        message: `${product.name} (${variant.name || ''}) se ha añadido a tu carrito.`,
        color: "green",
      })

      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)

    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Hubo un problema al añadir el producto al carrito.",
        color: "red",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || isSuccess || !variant}
      size="lg"
      fullWidth
      loading={isAdding}
      leftSection={!isAdding && (isSuccess ? <IconCheck size={20} /> : <IconShoppingCart size={20} />)}
      color={isSuccess ? "green" : "blue"}
    >
      {isSuccess ? "¡Añadido!" : "Añadir al Carrito"}
    </Button>
  )
}
