
import { Suspense } from "react";
import { Card, Table, Title, Text, Group, Stack, Badge, Avatar, Skeleton } from "@mantine/core";
import { DeleteProductButton } from "@/features/admin/components/delete-product-button";
import { LinkButton } from "@/components/link-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocalProductImage } from "@/lib/local-images";
import { IconPackage, IconPlus } from "@tabler/icons-react";
import { ProductSearch } from "./product-search";

// Definición de tipos para mejorar el rendimiento y eliminar @ts-ignore
interface ProductVariant {
  code: string;
}

interface ProductWithRelations {
  id: string;
  name: string;
  code: string | null;
  status: string;
  stock: number;
  brands: { name: string } | null;
  product_media: { url: string }[] | null;
  product_variants: ProductVariant[] | null;
  promotion_products: { promotions: { status: string } }[] | null;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={1}>Gestión de Productos</Title>
        <Group>
          <LinkButton href="/dashboard" variant="default">Dashboard</LinkButton>
          <LinkButton href="/products/create" leftSection={<IconPlus size={16} />}>Crear Nuevo Producto</LinkButton>
        </Group>
      </Group>

      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </Stack>
  )
}

async function ProductList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [resolvedSearchParams, supabase] = await Promise.all([searchParams, createClient()])

  // Optimizamos: Obtenemos usuario y su tienda en paralelo o de forma más directa
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: storeMember } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", user.id)
    .single() // .single() es más rápido que .select() si esperamos un solo resultado

  if (!storeMember) {
    return <Text c="red">Error: No se pudo determinar la tienda del usuario.</Text>
  }

  const store_id = storeMember.store_id

  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined

  // Configuración de paginación
  const currentPage = Number(resolvedSearchParams.page) || 1
  const pageSize = 25
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  let productsQuery = supabase
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
    `,
    { count: 'exact' }
    )
    .eq("store_id", store_id) // Filter by store_id
    .is("deleted_at", null)

  if (query) {
    productsQuery = productsQuery.or(`name.ilike.%${query}%,code.ilike.%${query}%`)
  }

  const { data: productsData, error, count } = await (productsQuery as any)
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) {
    return <Text c="red">Error al cargar productos.</Text>
  }

  // Enriquecimiento de imágenes optimizado
  const products = await Promise.all(((productsData as unknown as ProductWithRelations[]) || []).map(async (product) => {
    let imageUrl = "/placeholder-image.jpg"
    
    // Prioridad: Código de producto > Código de primera variante
    const codeToUse = product.code || product.product_variants?.[0]?.code

    // getLocalProductImage suele ser el punto lento si hace I/O
    const localImage = await getLocalProductImage(codeToUse)

    if (localImage) {
      imageUrl = localImage
    } else {
      imageUrl = product.product_media?.[0]?.url || imageUrl
    }

    return {
      ...product,
      imageUrl
    }
  }))

  return (
    <Card withBorder radius="lg" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3}>Listado de Productos</Title>
            <Text c="dimmed" size="sm">Administra los productos de tu tienda.</Text>
          </div>
          <ProductSearch />
        </Group>

        {products.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">No se encontraron productos.</Text>
        ) : (
          <Table highlightOnHover>
            <thead>
              <tr>
                <th style={{ width: 60 }}>Imagen</th>
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
                      <IconPackage size={20} />
                    </Avatar>
                  </td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.brands?.name || "N/A"}</td>
                  <td>
                    <Group gap="xs">
                      {product.promotion_products?.some(pp => pp.promotions?.status === 'active') && (
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
        )}

        <PaginationControls 
          currentPage={currentPage} 
          totalCount={count || 0} 
          pageSize={pageSize} 
          searchParams={resolvedSearchParams} 
        />
      </Stack>
    </Card>
  )
}

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  searchParams: Record<string, any>;
}

function PaginationControls({ currentPage, totalCount, pageSize, searchParams }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, Array.isArray(value) ? value.join(",") : String(value))
    })
    params.set("page", String(pageNumber))
    return `?${params.toString()}`
  }

  return (
    <Group justify="center" mt="xl">
      <LinkButton href={createPageUrl(currentPage - 1)} variant="default" disabled={currentPage <= 1}>
        Anterior
      </LinkButton>
      <Text size="sm" fw={500}>Página {currentPage} de {totalPages}</Text>
      <LinkButton href={createPageUrl(currentPage + 1)} variant="default" disabled={currentPage >= totalPages}>
        Siguiente
      </LinkButton>
    </Group>
  )
}

function ProductTableSkeleton() {
  return (
    <Card withBorder radius="lg" padding="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <Skeleton h={40} w={200} />
          <Skeleton h={40} w={300} />
        </Group>
        <Skeleton h={400} w="100%" />
      </Stack>
    </Card>
  )
}
