"use client"
import { useState } from "react"
import { Button, Badge, Card, Divider, Group, Stack, Title, Text, NumberInput, ActionIcon, SimpleGrid, ThemeIcon } from "@mantine/core"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { notifications } from "@mantine/notifications"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Check } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  brand: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  description: string
}

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async () => {
    await addItem({ id: product.id, name: product.name, price: product.price, image: undefined }, quantity)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Stack gap="lg">
      {/* Product Title and Brand */}
      <Stack gap="xs">
        <Badge variant="outline" size="lg" w="fit-content">
          {product.brand}
        </Badge>
        <Title order={1}>{product.name}</Title>
        <Text c="dimmed">{product.category}</Text>
      </Stack>

      {/* Rating and Reviews */}
      <Group gap="xs">
        <Group gap={2}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(product.rating) ? "var(--mantine-color-yellow-4)" : "none"}
              color={i < Math.floor(product.rating) ? "var(--mantine-color-yellow-4)" : "var(--mantine-color-gray-5)"}
            />
          ))}
          <Text span fw={500} ml={4}>{product.rating}</Text>
        </Group>
        <Text size="sm" c="dimmed">({product.reviews} reseñas)</Text>
      </Group>

      {/* Price */}
      <Group align="center" gap="md">
        <Text size="xl" fw={700} fz={32} c="blue">${product.price}</Text>
        {product.originalPrice && (
          <>
            <Text size="xl" c="dimmed" td="line-through">${product.originalPrice}</Text>
            <Badge color="red" size="lg">-{discount}%</Badge>
          </>
        )}
      </Group>

      {/* Stock Status */}
      <Group gap="xs">
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: product.inStock ? 'var(--mantine-color-green-5)' : 'var(--mantine-color-red-5)' }} />
        <Text size="sm" fw={500} c={product.inStock ? "green" : "red"}>
          {product.inStock ? "En stock" : "Agotado"}
        </Text>
      </Group>

      {/* Description */}
      <Stack gap="xs">
        <Text fw={600}>Descripción</Text>
        <Text c="dimmed" lh="md">{product.description}</Text>
      </Stack>

      <Divider />

      {/* Quantity and Add to Cart */}
      <Stack gap="md">
        <Group>
          <Text size="sm" fw={500}>Cantidad:</Text>
          <Group gap={0} style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)' }}>
            <ActionIcon variant="transparent" c="dark" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</ActionIcon>
            <Text px="md" size="sm" fw={500}>{quantity}</Text>
            <ActionIcon variant="transparent" c="dark" onClick={() => setQuantity(quantity + 1)}>+</ActionIcon>
          </Group>
        </Group>

        <Group>
          <Button
            size="lg"
            style={{ flex: 1 }}
            disabled={!product.inStock || isAdded}
            onClick={handleAddToCart}
            leftSection={isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
            color={isAdded ? "green" : "blue"}
          >
            {isAdded ? "Añadido" : "Hacer Pedido"}
          </Button>
          <ActionIcon variant="default" size="xl" radius="md" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart size={20} fill={isFavorite ? "red" : "none"} color={isFavorite ? "red" : "currentColor"} />
          </ActionIcon>
          <ActionIcon variant="default" size="xl" radius="md">
            <Share2 size={20} />
          </ActionIcon>
        </Group>
      </Stack>

      {/* Benefits */}
      <Card withBorder padding="md" radius="md">
        <Stack gap="sm">
          <Group gap="sm">
            <ThemeIcon variant="light" color="blue">
              <Truck size={16} />
            </ThemeIcon>
            <Text size="sm">Envío gratuito en pedidos superiores a $100</Text>
          </Group>
          <Group gap="sm">
            <ThemeIcon variant="light" color="blue">
              <Shield size={16} />
            </ThemeIcon>
            <Text size="sm">Garantía de 3 años incluida</Text>
          </Group>
          <Group gap="sm">
            <ThemeIcon variant="light" color="blue">
              <RotateCcw size={16} />
            </ThemeIcon>
            <Text size="sm">Devolución gratuita en 30 días</Text>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}
