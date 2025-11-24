"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getOrCreateUserCart, addItemToCart } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"

export function AddToCartButton({
  variant,
  product,
}: {
  variant: any
  product: any
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (!variant) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una versión del producto.",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para añadir productos al carrito.",
        variant: "destructive",
      })
      setIsAdding(false)
      return
    }

    try {
      const cart = await getOrCreateUserCart(user.id)
      await addItemToCart(cart.id, variant.id, 1, variant.list_price_usd)
      
      setIsSuccess(true)
      toast({
        title: "¡Añadido!",
        description: `${product.name} (${variant.name || ''}) se ha añadido a tu carrito.`,
      })

      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)

    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el producto al carrito.",
        variant: "destructive",
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
      className="w-full transition-all duration-300"
    >
      {isAdding ? (
        "Añadiendo..."
      ) : isSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          ¡Añadido!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Añadir al Carrito
        </>
      )}
    </Button>
  )
}
