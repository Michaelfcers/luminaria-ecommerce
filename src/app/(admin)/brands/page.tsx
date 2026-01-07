import { Button, Card, Title, Text, Group, Stack } from "@mantine/core";
import { LinkButton } from "@/components/link-button";
import { BrandsCrudContainer } from "@/features/admin/components/brands-crud-container";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BrandsPage() {
  const supabase = await createClient()
  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .is("deleted_at", null)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching brands:", error)
    return <div>Error loading brands.</div>
  }

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={1}>Gestión de Marcas</Title>
        <LinkButton href="/dashboard" variant="outline" leftSection={<ArrowLeft size={16} />}>
          Volver al Dashboard
        </LinkButton>
      </Group>

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <div>
            <Title order={3}>Marcas</Title>
            <Text c="dimmed" size="sm">Añade, edita y elimina las marcas de productos.</Text>
          </div>
          <BrandsCrudContainer brands={brands || []} />
        </Stack>
      </Card>
    </Stack>
  )
}
