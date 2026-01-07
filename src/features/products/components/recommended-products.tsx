"use client"
import { useRef } from "react"
import Link from "next/link"
import { Card, Button, ActionIcon, Title, Text, Group, Box, Image, SimpleGrid } from "@mantine/core"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

export type RecommendedProduct = {
  id: string
  name: string
  price: number | null
  image: string
}

interface RecommendedProductsProps {
  currentProductId: string
  recommendedProducts: RecommendedProduct[]
}

export function RecommendedProducts({
  currentProductId,
  recommendedProducts,
}: RecommendedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const products = recommendedProducts.filter(
    (product) => String(product.id) !== String(currentProductId)
  )

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <Box p="lg" component="section">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Productos Recomendados</Title>
        <Group gap="xs">
          <ActionIcon variant="default" size="lg" onClick={() => scroll("left")}>
            <IconChevronLeft size={16} />
          </ActionIcon>
          <ActionIcon variant="default" size="lg" onClick={() => scroll("right")}>
            <IconChevronRight size={16} />
          </ActionIcon>
        </Group>
      </Group>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            padding="sm"
            radius="md"
            withBorder
            className="flex-shrink-0 w-80"
          >
            <Card.Section>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                h={200}
                w="100%"
                fit="cover"
              />
            </Card.Section>

            <Box mt="md" mb="xs">
              <Text fw={600} size="sm" lineClamp={2} h={40}>
                {product.name}
              </Text>
            </Box>

            <Group justify="space-between" mt="md" align="center">
              {product.price && (
                <Text fw={700} size="lg" c="blue">
                  ${product.price}
                </Text>
              )}
              <Button component={Link} href={`/producto/${product.id}`} size="sm" variant="light">
                Ver
              </Button>
            </Group>
          </Card>
        ))}
      </div>
    </Box>
  )
}
