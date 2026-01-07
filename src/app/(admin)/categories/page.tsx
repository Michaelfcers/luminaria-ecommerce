import { Button, Card, Title, Text, Group, Stack } from "@mantine/core";
import { LinkButton } from "@/components/link-button";
import { CategoriesCrudContainer } from "@/features/admin/components/categories-crud-container";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CategoriesPage() {
  const supabase = await createClient()
  // We perform a left join on the same table to get the parent category's name
  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      parent_id,
      parent:categories(name)
    `
    )
    .is("deleted_at", null)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return <div>Error loading categories.</div>
  }

  // Transform the data to a flatter structure for the client component
  const transformedCategories = categories.map((c: any) => ({
    ...c,
    // @ts-ignore
    parent_name: c.parent?.name,
  }))

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={1}>Gestión de Categorías</Title>
        <LinkButton href="/dashboard" variant="outline" leftSection={<ArrowLeft size={16} />}>
          Volver al Dashboard
        </LinkButton>
      </Group>

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <div>
            <Title order={3}>Categorías</Title>
            <Text c="dimmed" size="sm">Añade, edita y elimina las categorías de productos.</Text>
          </div>
          <CategoriesCrudContainer categories={transformedCategories || []} />
        </Stack>
      </Card>
    </Stack>
  )
}
