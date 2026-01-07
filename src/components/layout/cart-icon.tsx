"use client"

import Link from "next/link"
import { IconShoppingBag } from "@tabler/icons-react"
import { ActionIcon, Indicator } from "@mantine/core"
import { useCart } from "@/hooks/use-cart"

export function CartIcon() {
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Link href="/carrito" passHref>
      <Indicator label={itemCount} size={16} disabled={itemCount === 0} offset={2} color="blue" withBorder>
        <ActionIcon variant="subtle" size="lg" color="dark">
          <IconShoppingBag className="h-5 w-5" />
        </ActionIcon>
      </Indicator>
    </Link>
  )
}
