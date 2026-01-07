"use client"
import { useState } from "react"
import Link from "next/link"
import { Card, Image, Text, Badge, Button, Group, SimpleGrid, Select, Stack, ActionIcon, Rating, Box, Flex } from "@mantine/core"
import { IconLayoutGrid, IconList } from "@tabler/icons-react"

// Define a type for the product prop for better type safety
type Product = {
  id: number | string;
  productId?: string; // Added to support linking to parent product
  name: string;
  image: string;
  category?: string;
  brand?: string;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
};

export function ProductsGrid({ products = [] }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string | null>("featured")

  return (
    <Stack gap="lg">
      {/* Header with sorting and view options */}
      <Flex justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }} gap="md">
        <Box>
          <Text c="dimmed" size="sm">Mostrando {products.length} productos</Text>
        </Box>

        <Group>
          {/* Sort dropdown */}
          <Select
            value={sortBy}
            onChange={setSortBy}
            placeholder="Ordenar por"
            data={[
              { value: 'featured', label: 'Destacados' },
              { value: 'newest', label: 'Más Nuevos' },
              { value: 'rating', label: 'Mejor Valorados' },
            ]}
            w={180}
            size="sm"
          />

          {/* View mode toggle */}
          <Group gap={0} style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-sm)' }}>
            <ActionIcon
              variant={viewMode === "grid" ? "filled" : "transparent"}
              color={viewMode === "grid" ? "blue" : "gray"}
              onClick={() => setViewMode("grid")}
              size="lg"
              radius={0}
              style={{ borderTopLeftRadius: 'var(--mantine-radius-sm)', borderBottomLeftRadius: 'var(--mantine-radius-sm)' }}
            >
              <IconLayoutGrid size={16} />
            </ActionIcon>
            <ActionIcon
              variant={viewMode === "list" ? "filled" : "transparent"}
              color={viewMode === "list" ? "blue" : "gray"}
              onClick={() => setViewMode("list")}
              size="lg"
              radius={0}
              style={{ borderTopRightRadius: 'var(--mantine-radius-sm)', borderBottomRightRadius: 'var(--mantine-radius-sm)' }}
            >
              <IconList size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Flex>

      {/* Products Grid */}
      {viewMode === "grid" ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="lg">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      ) : (
        <Stack gap="md">
          {products.map((product) => (
            <ProductCardList key={product.id} product={product} />
          ))}
        </Stack>
      )}

      {/* Pagination could be added here */}
      <Flex justify="center" mt="xl">
        <Button variant="outline" size="lg">
          Cargar Más Productos
        </Button>
      </Flex>
    </Stack>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section component={Link} href={product.productId ? `/producto/${product.productId}?variant=${product.id}` : `/producto/${product.id}`} style={{ position: 'relative' }}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          h={220}
          w="100%"
          fit="cover"
        />
        {product.isNew && (
          <Badge color="blue" variant="filled" style={{ position: 'absolute', top: 12, left: 12 }}>
            Nuevo
          </Badge>
        )}
      </Card.Section>

      <Stack gap="xs" mt="md" mb="xs">
        <Group gap="xs">
          {product.category && <Badge variant="light" color="gray" size="sm">{product.category}</Badge>}
          {product.brand && <Badge variant="outline" color="gray" size="sm">{product.brand}</Badge>}
        </Group>

        <Text fw={600} lineClamp={2} style={{ minHeight: 44 }}>{product.name}</Text>

        {product.rating && (
          <Group gap={4}>
            <Text span size="xs" c="yellow.5">★</Text>
            <Text span size="xs" c="dimmed">{product.rating} ({product.reviews})</Text>
          </Group>
        )}
      </Stack>

      <Button
        component={Link}
        href={product.productId ? `/producto/${product.productId}?variant=${product.id}` : `/producto/${product.id}`}
        fullWidth
        mt="md"
        radius="md"
      >
        Ver Detalle
      </Button>
    </Card>
  )
}

function ProductCardList({ product }: { product: Product }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex gap="lg" direction={{ base: 'column', sm: 'row' }}>
        <Box w={{ base: '100%', sm: 200 }} h={{ base: 200, sm: 160 }} style={{ position: 'relative', flexShrink: 0 }}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            h="100%"
            w="100%"
            fit="cover"
            style={{ borderRadius: 'var(--mantine-radius-md)' }}
          />
          {product.isNew && (
            <Badge color="blue" variant="filled" style={{ position: 'absolute', top: 8, left: 8 }}>
              Nuevo
            </Badge>
          )}
        </Box>

        <Stack style={{ flex: 1 }} justify="space-between">
          <Box>
            <Group gap="xs" mb="xs">
              {product.category && <Badge variant="light" color="gray" size="sm">{product.category}</Badge>}
              {product.brand && <Badge variant="outline" color="gray" size="sm">{product.brand}</Badge>}
            </Group>
            <Text fw={700} size="lg" mb="xs">{product.name}</Text>
            {product.rating && (
              <Group gap={4}>
                <Rating value={product.rating} readOnly size="sm" />
                <Text size="sm" c="dimmed">({product.reviews})</Text>
              </Group>
            )}
          </Box>

          <Button
            component={Link}
            href={product.productId ? `/producto/${product.productId}?variant=${product.id}` : `/producto/${product.id}`}
            w={{ base: '100%', sm: 'auto' }}
            radius="md"
          >
            Ver Detalle
          </Button>
        </Stack>
      </Flex>
    </Card>
  )
}