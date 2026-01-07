import { Button, Card, Table, Title, Text, Group, Stack, Badge, ActionIcon, Container, Avatar } from "@mantine/core";
import { DeleteProductButton } from "@/features/admin/components/delete-product-button";
import { LinkButton } from "@/components/link-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocalProductImage } from "@/lib/local-images";
import { Package, Plus } from "lucide-react";

export default async function ProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch the user's store_id from the store_members table
  const { data: storeMembers, error: storeMemberError } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", user.id)

  if (storeMemberError || !storeMembers || storeMembers.length === 0) {
    console.error("Error fetching user's store:", storeMemberError)
    return <div>Error: No se pudo determinar la tienda del usuario.</div>
  }

  const store_id = storeMembers[0].store_id
  console.log("Determined store ID for user:", store_id)

  const { data: productsData, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      code,
      status,
      stock,
      brands (name),
      product_media (url),
      product_variants (code),
      promotion_products (
        promotions (
            id,
            name,
            status,
            value,
            type
        )
      )
    `
    )
    .eq("store_id", store_id) // Filter by store_id
    .is("deleted_at", null) // Fetch only non-deleted products

  if (error) {
    console.error("Error fetching products:", error)
    // Handle error state appropriately
    return <div>Error loading products.</div>
  }

  // Enrich products with images
  const products = await Promise.all((productsData || []).map(async (product) => {
    let imageUrl = "/placeholder-image.jpg"

    // Determine the code to use for image lookup
    let codeToUse = product.code
    // @ts-ignore
    if (!codeToUse && product.product_variants && product.product_variants.length > 0) {
      // @ts-ignore
      codeToUse = product.product_variants[0].code
    }

    // Try to get local image first
    const localImage = await getLocalProductImage(codeToUse)

    if (localImage) {
      imageUrl = localImage
    } else {
      // @ts-ignore
      if (product.product_media && product.product_media.length > 0) {
        // @ts-ignore
        imageUrl = product.product_media[0].url
      }
    }

    return {
      ...product,
      imageUrl
    }
  }))

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={1}>Gestión de Productos</Title>
        <Group>
          <LinkButton href="/dashboard" variant="default">Dashboard</LinkButton>
          <LinkButton href="/products/create" leftSection={<Plus size={16} />}>Crear Nuevo Producto</LinkButton>
        </Group>
      </Group>

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <div>
            <Title order={3}>Listado de Productos</Title>
            <Text c="dimmed" size="sm">Administra los productos de tu tienda.</Text>
          </div>
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Estado</th>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Avatar src={product.imageUrl} alt={product.name} size="md" radius="sm" variant="outline">
                      <Package size={20} />
                    </Avatar>
                  </td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>
                    {/* @ts-ignore */}
                    {product.brands?.name || "N/A"}
                  </td>
                  <td>
                    <Group gap="xs">
                      {/* @ts-ignore */}
                      {product.promotion_products?.some((pp: any) => pp.promotions?.status === 'active') && (
                        <Badge color="pink" variant="light">Oferta</Badge>
                      )}
                      <Badge color={product.status === 'active' ? 'green' : 'gray'}>{product.status}</Badge>
                    </Group>
                  </td>
                  <td>{product.stock}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Group justify="flex-end" gap="xs">
                      <LinkButton href={`/products/${product.id}/edit`} size="xs" variant="default">
                        Editar
                      </LinkButton>
                      <LinkButton href={`/products/${product.id}/versions`} size="xs" variant="default">
                        Versiones
                      </LinkButton>
                      <DeleteProductButton productId={product.id} />
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      </Card>
    </Stack>
  )
}
