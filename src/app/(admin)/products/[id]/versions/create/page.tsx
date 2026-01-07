
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreateVariantForm } from "@/features/admin/components/create-variant-form"
import { Container, Title, Stack, Text } from "@mantine/core"

export default async function CreateProductVersionPage({
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

    // Verify product exists
    const { data: product, error } = await supabase
        .from("products")
        .select("id, name")
        .eq("id", resolvedParams.id)
        .single()

    if (error || !product) {
        console.error("Error fetching product:", error)
        notFound()
    }

    return (
        <Container size="md" py="lg">
            <Stack gap="lg">
                <div>
                    <Title order={2}>Crear Nueva Versión</Title>
                    <Text c="dimmed">Para: {product.name}</Text>
                </div>

                <CreateVariantForm productId={product.id} />
            </Stack>
        </Container>
    )
}
