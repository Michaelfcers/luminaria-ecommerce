"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/features/auth/components/auth-provider"
import {
  getOrCreateUserCart,
  addItemToCart as dbAddItem,
  updateCartItemQuantity as dbUpdateQuantity,
  removeCartItem as dbRemoveItem,
  clearCart as dbClearCart,
} from "@/lib/cart"
import { getCartItemsAction } from "@/lib/actions/cart"
import { notifications } from "@mantine/notifications"

export interface Cart {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string // Product ID
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image?: string
  quantity: number
  cartItemId?: number // This is the id from the cart_items table
}

export function useCart() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCart = useCallback(async () => {
    if (user) {
      setIsLoading(true)
      try {
        let currentCart = cart
        if (!currentCart) {
          currentCart = await getOrCreateUserCart(user.id)
          setCart(currentCart)
        }

        if (currentCart) {
          const cartItems = await getCartItemsAction(currentCart.id)
          setItems(cartItems)
        }
      } catch (error) {
        console.error(error)
        notifications.show({ title: "Error", message: "No se pudo cargar el carrito.", color: "red" })
      } finally {
        setIsLoading(false)
      }
    } else if (!isAuthLoading) {
      // Handle logged out user - for now, we clear the cart
      setCart(null)
      setItems([])
      setIsLoading(false)
    }
  }, [user, isAuthLoading, cart])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addItem = async (item: Omit<CartItem, "quantity" | "cartItemId">, quantity = 1) => {
    if (!cart) return
    const existingItem = items.find((i) => i.id === item.id)

    if (existingItem && existingItem.cartItemId) {
      const newQuantity = existingItem.quantity + quantity
      await dbUpdateQuantity(existingItem.cartItemId, newQuantity)
    } else {
      await dbAddItem(cart.id, item.id, quantity, item.price)
    }
    notifications.show({ title: "Añadido al carrito", message: `${item.name} (${quantity})`, color: "green" })
    loadCart() // Reload cart from DB to ensure consistency
  }

  const removeItem = async (cartItemId: number) => {
    if (!cart) return
    await dbRemoveItem(cartItemId)
    loadCart()
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!cart) return
    if (quantity <= 0) {
      await dbRemoveItem(cartItemId)
    } else {
      await dbUpdateQuantity(cartItemId, quantity)
    }
    loadCart()
  }

  const clearCart = async () => {
    if (!cart) return
    await dbClearCart(cart.id)
    loadCart()
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    isLoading: isLoading || isAuthLoading,
    cart,
  }
}