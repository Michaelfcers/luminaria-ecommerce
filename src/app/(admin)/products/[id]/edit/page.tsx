
import { redirect } from "next/navigation"
import { Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core"
import { ProductForm } from "@/features/admin/components/product-form"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { LinkButton } from "@/components/link-button";
import { ArrowLeft } from "lucide-react"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // console.log("Logged in user ID (edit page):", user.id)

  let store_id: string | null = null;

  // 1. Try to find a store where the user is the owner
  const { data: ownedStore, error: ownedStoreError } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (ownedStore && !ownedStoreError) {
    store_id = ownedStore.id;
  } else {
    // 2. If not an owner, try to find a store where the user is a member
    const { data: storeMember, error: storeMemberError } = await supabase
      .from("store_members")
      .select("store_id")
      .eq("user_id", user.id)
      .single(); // Assuming a user is primarily associated with one store for product management

    if (storeMember && !storeMemberError) {
      store_id = storeMember.store_id;
    }
  }

  if (!store_id) {
    console.error("Error: No se pudo determinar la tienda del usuario.");
    return <div>Error: No se pudo determinar la tienda del usuario.</div>;
  }
  // console.log("Determined store ID for user (edit page):", store_id)

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, product_categories(category_id)")
    .eq("id", id)
    .eq("store_id", store_id) // Ensure product belongs to the user's store
    .single()

  if (productError || !product) {
    console.error("Error fetching product or product not found for store:", productError)
    notFound()
  }
  // console.log("Fetched product (edit page):", product)

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

  const transformedProduct = {
    ...product,
    brand_id: product.brand_id ? String(product.brand_id) : "",
    product_categories:
      product.product_categories?.map(
        (pc: { category_id: number }) => ({
          category_id: String(pc.category_id),
        })
      ) || [],
  }

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Editar Producto</Title>
          <LinkButton href="/products" variant="default" leftSection={<ArrowLeft size={16} />}>
            Volver
          </LinkButton>
        </Group>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <div>
              <Title order={3} size="h4">{product.name}</Title>
              <Text c="dimmed" size="sm">
                Actualiza la información del producto.
              </Text>
            </div>

            <ProductForm
              product={transformedProduct}
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
