"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconSearch } from "@tabler/icons-react"
// Mantine imports
import { Container, Group, Button, Drawer, Burger, Box, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import { CartIcon } from "./cart-icon"
import { SearchDialog } from "./search-dialog"
import Image from "next/image"
import logo from "@/assets/mikomercio/mikomercio-logo.png"

interface NavigationProps {
  userNav: React.ReactNode;
}

const routes = [
  {
    href: "/",
    label: "Inicio",
  },
  {
    href: "/productos",
    label: "Productos",
  },

  {
    href: "/ofertas",
    label: "Ofertas",
  },
  {
    href: "/sobre-nosotros",
    label: "Sobre Nosotros",
  },
]

export function Navigation({ userNav }: NavigationProps) {
  const pathname = usePathname()
  const [opened, { toggle, close }] = useDisclosure(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <Box component="header" style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', borderBottom: '1px solid var(--mantine-color-gray-3)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
      <Container size="xl" h={64}>
        <Group justify="space-between" h="100%" wrap="nowrap">
          {/* Mobile Menu Trigger */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />

          {/* Logo */}
          <Link href="/" onClick={close} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <Image src={logo} alt="Luminaria Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} priority />
          </Link>

          {/* Desktop Navigation */}
          <Group gap="sm" visibleFrom="md">
            {routes.map((route) => (
              <Button
                key={route.href}
                component={Link}
                href={route.href}
                variant={pathname === route.href ? "light" : "subtle"}
                color={pathname === route.href ? "blue" : "gray"}
                fw={500}
              >
                {route.label}
              </Button>
            ))}
          </Group>

          {/* Icons / Actions */}
          <Group gap="xs">
            <Button variant="subtle" color="gray" size="compact-md" onClick={() => setIsSearchOpen(true)} p={8}>
              <IconSearch size={20} />
            </Button>
            <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

            <CartIcon />
            {userNav}
          </Group>
        </Group>
      </Container>


      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title={<Text fw={700} size="lg">Menú</Text>}
        padding="md"
        size="75%"
      >
        <Group align="stretch" style={{ flexDirection: 'column' }} gap="md" mt="md">
          {routes.map((route) => (
            <Button
              key={route.href}
              component={Link}
              href={route.href}
              variant={pathname === route.href ? "light" : "subtle"}
              color="gray"
              fullWidth
              justify="flex-start"
              onClick={close}
              size="lg"
            >
              {route.label}
            </Button>
          ))}
        </Group>
      </Drawer>
    </Box>
  )
}
