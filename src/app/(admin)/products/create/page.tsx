
import { redirect } from "next/navigation"
import { Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core"
import { ProductForm } from "@/features/admin/components/product-form"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { LinkButton } from "@/components/link-button"

export default async function CreateProductPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // console.log("User ID (create page):", user.id)

  let store_id: string | null = null

  // 1. Intentar encontrar una tienda donde el usuario sea el owner
  const { data: ownedStores, error: ownedStoresError } = await supabase
    .from("stores")
    .select("id, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true }) // o false si quieres la más reciente
    .limit(1)

  // console.log("Owned Store Data:", ownedStores)
  // console.log("Owned Store Error:", ownedStoresError)

  if (ownedStoresError) {
    console.error("Error buscando tienda como owner:", ownedStoresError)
  }

  if (ownedStores && ownedStores.length > 0) {
    store_id = ownedStores[0].id
  } else {
    // 2. Si no es owner (o no se tomó ninguna), buscar una tienda donde sea miembro
    const { data: memberStores, error: memberStoresError } = await supabase
      .from("store_members")
      .select("store_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)

    // console.log("Store Member Data:", memberStores)
    // console.log("Store Member Error:", memberStoresError)

    if (memberStoresError) {
      console.error("Error buscando tienda como miembro:", memberStoresError)
    }

    if (memberStores && memberStores.length > 0) {
      store_id = memberStores[0].store_id
    }
  }

  if (!store_id) {
    console.error(
      "Error: No se pudo determinar la tienda del usuario. User ID:",
      user.id
    )
    return (
      <div className="p-4">
        Error: No se pudo determinar la tienda del usuario. Por favor, asegúrate
        de que tu usuario esté asociado a una tienda.
      </div>
    )
  }

  // console.log("Determined store ID for user (create page):", store_id)

  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .select("id, name")
    .is("deleted_at", null)

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .is("deleted_at", null)

  if (brandsError || categoriesError) {
    console.error(
      "Error fetching brands or categories:",
      brandsError || categoriesError
    )
    return <div>Error loading form data.</div>
  }

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Crear Nuevo Producto</Title>
          <LinkButton href="/products" variant="default" leftSection={<IconArrowLeft size={16} />}>
            Volver
          </LinkButton>
        </Group>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <div>
              <Title order={3} size="h4">Detalles del Producto</Title>
              <Text c="dimmed" size="sm">
                Introduce la información del nuevo producto.
              </Text>
            </div>
            <ProductForm
              brands={brands?.map((b) => ({ ...b, id: String(b.id) })) || []}
              categories={
                categories?.map((c) => ({ ...c, id: String(c.id) })) || []
              }
              store_id={store_id}
            />
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
