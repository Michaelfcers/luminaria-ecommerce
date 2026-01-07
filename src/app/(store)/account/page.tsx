import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button, Card, TextInput, Title, Text, Stack, Container } from "@mantine/core"
import { updateProfile } from "@/lib/actions/profile"

export default async function AccountPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    return (
        <Container size="sm" py="xl">
            <Card withBorder radius="md" padding="xl">
                <Stack gap="md" mb="lg">
                    <Title order={3}>Mi Cuenta</Title>
                    <Text c="dimmed" size="sm">
                        Administra tu información personal.
                    </Text>
                </Stack>

                <form action={async (formData) => {
                    "use server"
                    await updateProfile(formData)
                }}>
                    <Stack gap="md">
                        <TextInput
                            label="Correo Electrónico"
                            defaultValue={user.email}
                            disabled
                            description="El correo electrónico no se puede cambiar."
                            variant="filled"
                        />

                        <TextInput
                            label="Nombre Completo"
                            name="display_name"
                            defaultValue={profile?.display_name || ""}
                            placeholder="Tu nombre"
                        />

                        <TextInput
                            label="Teléfono"
                            name="phone"
                            defaultValue={profile?.phone || ""}
                            placeholder="Tu número de teléfono"
                        />

                        <Button type="submit">Guardar Cambios</Button>
                    </Stack>
                </form>
            </Card>
        </Container>
    )
}
