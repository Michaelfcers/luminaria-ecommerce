"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  quantity: number
}

const CART_KEY = "luminaria_cart_v1"

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch (e) {
    return []
  }
}

function writeStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch (e) {
    // ignore
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readStorage())
  const { toast } = useToast()

  useEffect(() => {
    writeStorage(items)
  }, [items])

  useEffect(() => {
    const onStorage = () => setItems(readStorage())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      let next: CartItem[]
      if (exists) {
        next = prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
      } else {
        next = [...prev, { ...item, quantity }]
      }
      toast({ title: "Añadido al carrito", description: `${item.name} (${quantity})` })
      return next
    })
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQuantity(id: number, quantity: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, total }
}
