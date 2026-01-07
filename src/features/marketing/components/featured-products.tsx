"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, Button, Badge, Text, Group, Title, Container, SimpleGrid, Tabs, Image, Stack, Box, Center } from "@mantine/core"

export function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState("recomendados")

  const filters = [
    { id: "recomendados", label: "Recomendados", icon: "⭐" },
    { id: "promociones", label: "Promociones", icon: "🔥" },
    { id: "mas-vendidos", label: "Más Vendidos", icon: "📈" },
    { id: "nuevos", label: "Nuevos", icon: "✨" },
  ]

  const productsByFilter: Record<string, any[]> = {
    recomendados: [
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        originalPrice: "$459",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Plafón LED Circular",
        price: "$219",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: false,
        rating: 4.9,
      },
      {
        id: 3,
        name: "Aplique de Pared Elegante",
        price: "$179",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: false,
        rating: 4.7,
      },
      {
        id: 4,
        name: "Lámpara de Mesa Premium",
        price: "$269",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        rating: 4.6,
      },
      {
        id: 11,
        name: "Lámpara Araña Cristal",
        price: "$899",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: false,
        rating: 4.9,
      },
      {
        id: 12,
        name: "Foco LED Regulable",
        price: "$45",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: false,
        rating: 4.5,
      },
      {
        id: 13,
        name: "Lámpara Industrial Vintage",
        price: "$329",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: false,
        rating: 4.7,
      },
      {
        id: 14,
        name: "Panel LED Empotrable",
        price: "$159",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: false,
        rating: 4.8,
      },
    ],
    promociones: [
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        originalPrice: "$459",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "24%",
        rating: 4.8,
      },
      {
        id: 5,
        name: "Spot Empotrado LED",
        price: "$89",
        originalPrice: "$129",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        discount: "31%",
        rating: 4.5,
      },
      {
        id: 7,
        name: "Lámpara de Pie Minimalista",
        price: "$399",
        originalPrice: "$549",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "27%",
        rating: 4.9,
      },
      {
        id: 8,
        name: "Tira LED Regulable",
        price: "$109",
        originalPrice: "$149",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        discount: "27%",
        rating: 4.4,
      },
      {
        id: 15,
        name: "Lámpara Araña Cristal",
        price: "$699",
        originalPrice: "$899",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "22%",
        rating: 4.9,
      },
      {
        id: 16,
        name: "Reflector LED Exterior",
        price: "$129",
        originalPrice: "$189",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        discount: "32%",
        rating: 4.6,
      },
      {
        id: 17,
        name: "Enchufe Inteligente WiFi",
        price: "$39",
        originalPrice: "$59",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        discount: "34%",
        rating: 4.4,
      },
      {
        id: 18,
        name: "Lámpara Escritorio LED",
        price: "$89",
        originalPrice: "$119",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        discount: "25%",
        rating: 4.7,
      },
    ],
    "mas-vendidos": [
      {
        id: 2,
        name: "Plafón LED Circular",
        price: "$219",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "2,450+",
        rating: 4.9,
      },
      {
        id: 6,
        name: "Interruptor Táctil",
        price: "$55",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        sales: "1,890+",
        rating: 4.7,
      },
      {
        id: 8,
        name: "Tira LED Regulable",
        price: "$109",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "1,650+",
        rating: 4.4,
      },
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        sales: "1,200+",
        rating: 4.8,
      },
      {
        id: 19,
        name: "Foco LED Regulable",
        price: "$45",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "3,200+",
        rating: 4.5,
      },
      {
        id: 20,
        name: "Lámpara Escritorio LED",
        price: "$89",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        sales: "2,800+",
        rating: 4.7,
      },
      {
        id: 21,
        name: "Reflector LED Exterior",
        price: "$129",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "2,100+",
        rating: 4.6,
      },
      {
        id: 22,
        name: "Panel LED Empotrable",
        price: "$159",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        sales: "1,950+",
        rating: 4.8,
      },
    ],
    nuevos: [
      {
        id: 4,
        name: "Lámpara de Mesa Premium",
        price: "$269",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        launchDate: "Hace 3 días",
        rating: 4.6,
      },
      {
        id: 1,
        name: "Lámpara Colgante Moderna",
        price: "$349",
        image: "/products/luminaria-plafon.webp",
        category: "Lámparas",
        isNew: true,
        launchDate: "Hace 1 semana",
        rating: 4.8,
      },
      {
        id: 9,
        name: "Panel LED Inteligente",
        price: "$189",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: true,
        launchDate: "Hace 2 semanas",
        rating: 4.5,
      },
      {
        id: 10,
        name: "Dimmer WiFi Premium",
        price: "$79",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        isNew: true,
        launchDate: "Hace 3 semanas",
        rating: 4.3,
      },
      {
        id: 23,
        name: "Lámpara Solar Jardín",
        price: "$119",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: true,
        launchDate: "Hace 4 días",
        rating: 4.4,
      },
      {
        id: 24,
        name: "Sensor Movimiento PIR",
        price: "$35",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        isNew: true,
        launchDate: "Hace 1 semana",
        rating: 4.2,
      },
      {
        id: 25,
        name: "Lámpara Neon Flexible",
        price: "$149",
        image: "/products/luminaria-plafon.webp",
        category: "Luminarias",
        isNew: true,
        launchDate: "Hace 2 semanas",
        rating: 4.6,
      },
      {
        id: 26,
        name: "Control Remoto Universal",
        price: "$59",
        image: "/products/luminaria-plafon.webp",
        category: "Accesorios",
        isNew: true,
        launchDate: "Hace 3 semanas",
        rating: 4.3,
      },
    ],
  }

  const currentProducts = productsByFilter[activeFilter] || []

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <Container size="xl">
        <Stack align="center" mb={50}>
          <Title order={2} style={{ fontSize: '2.5rem' }}>Productos Destacados</Title>
          <Text c="dimmed" size="lg" maw={600} ta="center">
            Descubre nuestra selección curada de los mejores productos de iluminación
          </Text>
        </Stack>

        <Tabs value={activeFilter} onChange={(val) => val && setActiveFilter(val)} variant="pills" radius="xl" mb={60} color="dark">
          <Tabs.List justify="center" style={{ gap: 8 }}>
            {filters.map((filter) => (
              <Tabs.Tab
                key={filter.id}
                value={filter.id}
                leftSection={<Text span size="lg">{filter.icon}</Text>}
                px="lg"
                py="sm"
                style={{ fontSize: 16 }}
              >
                {filter.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {currentProducts.map((product) => (
            <Card
              key={`${activeFilter}-${product.id}`}
              padding="lg"
              radius="lg"
              withBorder
              className="group"
              bg="rgba(255,255,255,0.5)"
              style={{ transition: 'all 0.3s', backdropFilter: 'blur(10px)' }}
            >
              <Card.Section>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    h={288}
                    fit="cover"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <Box className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {activeFilter === "promociones" && product.discount && (
                    <Badge color="red" className="absolute top-4 left-4 shadow-lg animate-bounce" size="lg">
                      -{product.discount}
                    </Badge>
                  )}
                  {activeFilter === "mas-vendidos" && product.sales && (
                    <Badge color="green" className="absolute top-4 left-4 shadow-lg" size="lg">
                      {product.sales} vendidos
                    </Badge>
                  )}
                  {activeFilter === "nuevos" && product.isNew && (
                    <Badge color="blue" className="absolute top-4 left-4 shadow-lg animate-pulse" size="lg">
                      Nuevo
                    </Badge>
                  )}
                  {activeFilter === "recomendados" && product.rating && (
                    <Badge color="yellow" className="absolute top-4 left-4 shadow-lg" size="lg">
                      ⭐ {product.rating}
                    </Badge>
                  )}
                </div>
              </Card.Section>

              <Stack mt="md" gap="xs">
                <Group justify="space-between">
                  <Badge variant="light" color="gray" radius="sm">
                    {product.category}
                  </Badge>
                </Group>

                <Text fw={700} lineClamp={2} style={{ minHeight: 48 }} className="group-hover:text-blue-600 transition-colors">
                  {product.name}
                </Text>

                {activeFilter === "nuevos" && product.launchDate && (
                  <Text size="xs" c="dimmed">Lanzado {product.launchDate}</Text>
                )}

                <Group align="baseline" gap="xs">
                  <Text size="xl" fw={700} c="blue.7">{product.price}</Text>
                  {product.originalPrice && (
                    <Text size="sm" c="dimmed" td="line-through">{product.originalPrice}</Text>
                  )}
                </Group>

                <Button component={Link} href={`/producto/${product.id}`} fullWidth mt="sm" color="dark">
                  Ver Detalles
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        <Center mt={60}>
          <Button
            component={Link}
            href="/productos"
            size="lg"
            variant="outline"
            color="dark"
            px={40}
          >
            Ver Todos los Productos
          </Button>
        </Center>
      </Container>
    </section>
  )
}


