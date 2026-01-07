
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditVariantForm } from "@/features/admin/components/edit-variant-form"
import { Container, Title, Stack, Text } from "@mantine/core"

export default async function EditProductVersionPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Verify product and variant
  const { data: variant, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("id", resolvedParams.variantId)
    .eq("product_id", resolvedParams.id)
    .single()

  if (error || !variant) {
    console.error("Error fetching variant:", error)
    notFound()
  }

  return (
    <Container size="md" py="lg">
      <Stack gap="lg">
        <div>
          <Title order={2}>Editar Versión</Title>
          <Text c="dimmed">{variant.name}</Text>
        </div>

        <EditVariantForm variant={variant} />
      </Stack>
    </Container>
  )
}
