"use client"

import Link from "next/link"
import { Button, Group, Paper } from "@mantine/core"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Productos" },
  { href: "/brands", label: "Marcas" },
  { href: "/categories", label: "Categorías" },
]

export function AdminNavigation() {
  const pathname = usePathname()

  return (
    <Paper shadow="xs" p="md" withBorder mb="lg">
      <Group>
        {navItems.map((item) => (
          <Button
            key={item.href}
            component={Link}
            href={item.href}
            variant={pathname === item.href ? "filled" : "subtle"}
          >
            {item.label}
          </Button>
        ))}
      </Group>
    </Paper>
  )
}
