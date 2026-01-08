
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LinkButton } from "@/components/link-button";
import { Button, Card, Badge, Title, Text, Group, Stack, Grid, Image, GridCol, CardSection } from "@mantine/core"
import { getLocalProductImage } from "@/lib/local-images"
import { IconEdit, IconPackage, IconTag, IconArrowLeft, IconPlus } from "@tabler/icons-react"

// Helper to format JSONB attributes for display
const formatAttributes = (attributes: Record<string, any>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value} `)
    .join(", ")
}

export default async function ProductVersionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
id,
  name,
  product_variants( * )
    `
    )
    .eq("id", resolvedParams.id)
    .single()

  if (error || !product) {
    console.error("Error fetching product versions:", error)
    notFound()
  }

  // Enrich variants with images
  const enrichedVariants = await Promise.all(
    product.product_variants.map(async (variant: any) => {
      let imageUrl = "/placeholder-image.jpg"
      const localImage = await getLocalProductImage(variant.code)
      if (localImage) {
        imageUrl = localImage
      }
      return { ...variant, imageUrl }
    })
  )

  return (
    <Stack gap="xl" p="md" maw={1200} mx="auto">
      <Group justify="space-between" align="center">
        <div>
          <Title order={1}>Versiones de Producto</Title>
          <Text c="dimmed" size="lg">{product.name}</Text>
        </div>
        <Group>
          <LinkButton href="/products" variant="outline" leftSection={<IconArrowLeft size={16} />}>
            Volver a Productos
          </LinkButton>
          <LinkButton href={`/products/${product.id}/versions/create`} leftSection={<IconPlus size={16} />}>
            Nueva Versión
          </LinkButton>
        </Group>
      </Group>

      <Grid gutter="lg">
        {enrichedVariants.map((variant: any) => (
          <GridCol key={variant.id} span={{ base: 12, md: 6, lg: 4, xl: 3 }}>
            <Card
              withBorder
              radius="lg"
              className="group"
              style={{ transition: 'all 0.3s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
              padding="md"
            >
              <CardSection>
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1' }}>
                  <Image
                    src={variant.imageUrl}
                    alt={variant.name || "Variant Image"}
                    fit="cover"
                    h="100%"
                    w="100%"
                    style={{ transition: 'transform 0.5s' }}
                    className="group-hover:scale-110"
                  />
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge
                      color={variant.stock > 0 ? "blue" : "red"}
                      variant="filled"
                    >
                      {variant.stock > 0 ? "En Stock" : "Agotado"}
                    </Badge>
                  </div>
                </div>
              </CardSection>

              <Stack gap="sm" mt="md" flex={1}>
                <Title order={4} lineClamp={1}>{variant.name || "Sin Nombre"}</Title>

                <Group gap="xs" style={{ minHeight: '2.5rem' }}>
                  {Object.keys(variant.attributes).length > 0 ? (
                    Object.entries(variant.attributes).map(([key, value]) => (
                      <Badge key={key} variant="light" color="gray" size="sm">
                        {key}: {String(value)}
                      </Badge>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed" fs="italic">
                      <IconTag size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Sin atributos
                    </Text>
                  )}
                </Group>

                <div style={{ marginTop: 'auto' }}>
                  <Group align="baseline" gap={2}>
                    <Text fw={700} size="xl" c="blue">
                      ${variant.list_price_usd?.toFixed(2) ?? "0.00"}
                    </Text>
                    <Text size="sm" c="dimmed">USD</Text>
                  </Group>
                  <Group align="center" gap={4} mt={4}>
                    <IconPackage size={14} className="text-gray-500" />
                    <Text size="sm" c="dimmed">Stock: <Text span fw={500} c="dark">{variant.stock}</Text> unidades</Text>
                  </Group>
                </div>
              </Stack>
              <LinkButton
                href={`/products/${product.id}/versions/${variant.id}/edit`}
                fullWidth
                mt="md"
                leftSection={<IconEdit size={16} />}
              >
                Editar Versión
              </LinkButton>
            </Card >
          </GridCol >
        ))}
      </Grid >

      {
        enrichedVariants.length === 0 && (
          <Stack align="center" justify="center" py={64} style={{ border: '2px dashed #eee', borderRadius: 16 }}>
            <IconPackage size={32} className="text-gray-400" />
            <Title order={3} mt="sm">No hay versiones creadas</Title>
            <Text c="dimmed" maw={400} ta="center">
              Este producto aún no tiene versiones. Crea la primera versión para comenzar a vender diferentes variantes.
            </Text>
            <LinkButton href={`/products/${product.id}/versions/create`} mt="md" size="lg">
              Crear primera versión
            </LinkButton>
          </Stack>
        )
      }
    </Stack >
  )
}
