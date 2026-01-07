"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Select,
  Card,
  Badge,
  Button,
  Divider,
  Tooltip,
  Text,
  Title,
  Image,
  Stack,
  Group,
  SimpleGrid,
  Box,
  Flex
} from "@mantine/core"
import { IconFileText } from "@tabler/icons-react"

import { AddToCartButton } from "../../cart/components/add-to-cart-button"
import { Product, ProductVariant } from "../types"

// A helper function to format attributes for display
const formatAttributes = (attributes: Record<string, any>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")
}

export function ProductDetailClient({
  product,
  promotion,
  initialImage,
}: {
  product: Product
  promotion?: any
  initialImage: string
}) {
  const searchParams = useSearchParams()
  const initialVariantId = searchParams.get("variant")

  // Initialize with the first variant, or null if there are no variants
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (initialVariantId && product.product_variants) {
      const variant = product.product_variants.find(v => v.id === initialVariantId)
      if (variant) return variant
    }
    return product.product_variants && product.product_variants.length > 0
      ? product.product_variants[0]
      : null
  })

  useEffect(() => {
    const variantIdParam = searchParams.get("variant")
    if (variantIdParam && product.product_variants) {
      const variant = product.product_variants.find(v => v.id === variantIdParam)
      if (variant && variant.id !== selectedVariant?.id) {
        setSelectedVariant(variant)
        if (variant.localImage) {
          setCurrentImage(variant.localImage)
        }
      }
    }
  }, [searchParams, product.product_variants])

  const [currentImage, setCurrentImage] = useState(initialImage)

  // Sync image with selected variant if needed
  useEffect(() => {
    if (selectedVariant && selectedVariant.localImage) {
      setCurrentImage(selectedVariant.localImage)
    }
  }, [selectedVariant])


  const getActivePromotion = (variant: any) => {
    // 1. Check for variant-specific promotion
    const variantPromo = variant?.promotion_variants?.find((pv: any) => {
      const promo = pv.promotions
      if (promo.status !== 'active') return false
      const now = new Date()
      const start = promo.starts_at ? new Date(promo.starts_at) : null
      const end = promo.ends_at ? new Date(promo.ends_at) : null

      if (start && now < start) return false
      if (end && now > end) return false

      return true
    })?.promotions

    if (variantPromo) return variantPromo

    // 2. Fallback to product-level promotion
    return promotion
  }

  const calculateDiscountedPrice = (price: number, variant: any) => {
    const activePromo = getActivePromotion(variant)
    if (!activePromo) return null

    if (activePromo.type === 'percentage') {
      return price * (1 - activePromo.value / 100)
    } else if (activePromo.type === 'amount') {
      return Math.max(0, price - activePromo.value)
    }
    return null
  }

  const handleVariantChange = (variantId: string) => {
    if (!product.product_variants) return
    const newVariant = product.product_variants.find(
      (v) => v.id === variantId
    )
    if (newVariant) {
      setSelectedVariant(newVariant)
      // Note: updating existing search param logic usually handled via router push in parent or here?
      // For now just update state.
    }
  }

  const variantTechnicalSheet = selectedVariant?.product_variant_media?.find((media) => media.type === "pdf")?.url

  const activePromo = selectedVariant ? getActivePromotion(selectedVariant) : null

  return (
    <Stack gap="xl">
      {/* Main Product "Group" Header */}
      <Box style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }} pb="md">
        <Title order={1} size="h1" fw={900}>{product.name}</Title>
        {product.description && (
          <Text size="lg" c="dimmed" mt="xs">
            {product.description}
          </Text>
        )}
      </Box>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={48}>
        {/* Left side: Image & Attributes */}
        <Stack gap="lg">
          <Card padding="0" radius="xl" withBorder shadow="sm" style={{ overflow: 'hidden' }}>
            <Image
              src={currentImage}
              alt={product.name}
              w="100%"
              h="auto" // Image component usually handles aspect ratio or we set h={500}
              fit="cover"
            />
          </Card>

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <Card padding="lg" radius="xl" withBorder shadow="sm">
              <Text fw={700} size="lg" mb="md">Atributos Generales</Text>
              <Stack gap="xs">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <Group key={key} justify="space-between">
                    <Text fw={500} c="dimmed">{key}:</Text>
                    <Text>{String(value)}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>

        {/* Right side: Variant Selection and Details */}
        <Stack gap="lg">
          {selectedVariant && (
            <Title order={2} size="h2">{selectedVariant.name || formatAttributes(selectedVariant.attributes)}</Title>
          )}

          <Card padding="lg" radius="xl" withBorder shadow="sm">
            <Text fw={700} size="lg" mb="md">Selecciona una Versión</Text>
            <Stack gap="md">
              <Select
                value={selectedVariant?.id}
                onChange={(val) => val && handleVariantChange(val)}
                placeholder="Elige una versión..."
                data={product.product_variants?.map((variant) => {
                  const variantPromo = getActivePromotion(variant)
                  return {
                    value: variant.id,
                    label: `${variant.name || formatAttributes(variant.attributes)} ${variantPromo ? (variantPromo.type === 'percentage' ? `(-${variantPromo.value}%)` : `(-$${variantPromo.value})`) : ''}`
                  }
                })}
              />

              {variantTechnicalSheet ? (
                <Button component={Link} href={variantTechnicalSheet} target="_blank" rel="noopener noreferrer" size="lg" fullWidth leftSection={<IconFileText size={18} />}>
                  Descargar ficha tecnica
                </Button>
              ) : (
                <Tooltip label="Ficha técnica no disponible para esta versión">
                  <Button size="lg" fullWidth disabled leftSection={<IconFileText size={18} />}>
                    Descargar ficha tecnica
                  </Button>
                </Tooltip>
              )}
              <AddToCartButton variant={selectedVariant} product={product} />
            </Stack>
          </Card>

          {selectedVariant && (
            <Card padding="lg" radius="xl" withBorder shadow="sm">
              <Text fw={700} size="lg" mb="md">Detalles</Text>
              <Stack gap="md">
                <Box>
                  <Text fw={600} mb={4}>Precio:</Text>
                  <Group align="center">
                    {calculateDiscountedPrice(selectedVariant.list_price_usd, selectedVariant) ? (
                      <>
                        <Text size="xl" fw={800} c="blue">${calculateDiscountedPrice(selectedVariant.list_price_usd, selectedVariant)?.toFixed(2)}</Text>
                        <Text size="lg" c="dimmed" td="line-through">${selectedVariant.list_price_usd}</Text>
                        <Badge color="red" variant="filled">
                          {activePromo?.type === 'percentage' ? `-${activePromo.value}%` : `-$${activePromo?.value}`}
                        </Badge>
                      </>
                    ) : (
                      <Text size="xl" fw={800} c="blue">${selectedVariant.list_price_usd}</Text>
                    )}
                  </Group>
                </Box>

                <Divider />

                <Box>
                  <Text fw={600}>Horas de vida:</Text>
                  <Text>{selectedVariant.life_hours}</Text>
                </Box>

                <Divider />

                <Box>
                  <Text fw={600}>Lúmenes:</Text>
                  <Text>{selectedVariant.lumens}</Text>
                </Box>

                <Divider />

                <Box>
                  <Text fw={600}>Piezas por caja:</Text>
                  <Text>{selectedVariant.pieces_per_box}</Text>
                </Box>

                <Divider />

                <Box>
                  <Text fw={600} mb={8}>Atributos:</Text>
                  <Group gap="xs">
                    {Object.entries(selectedVariant.attributes).map(
                      ([key, value]) => (
                        <Badge key={key} variant="outline" color="gray" size="lg" fw={500} style={{ textTransform: 'none' }}>
                          <span style={{ fontWeight: 400, marginRight: 4 }}>{key}:</span> {String(value)}
                        </Badge>
                      )
                    )}
                  </Group>
                </Box>

                <Divider />

                <Box>
                  <Text fw={600} mb={4}>Disponibilidad:</Text>
                  <Badge
                    color={selectedVariant.sourcing_status === "active" ? "green" : "red"}
                    size="lg"
                  >
                    {selectedVariant.sourcing_status}
                  </Badge>
                </Box>
              </Stack>
            </Card>
          )}
        </Stack>
      </SimpleGrid>
    </Stack>
  )
}
