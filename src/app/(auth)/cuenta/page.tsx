"use client"
import { Avatar, Button, Card, Container, Grid, SimpleGrid, Stack, Text, TextInput, Title, Group } from "@mantine/core"

export default function AccountPage() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">Mi Cuenta</Title>
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg" radius="md">
            <Stack align="center" gap="md">
              <Avatar src="/placeholder-user.jpg" alt="@shadcn" size={96} radius="xl">CN</Avatar>
              <div style={{ textAlign: "center" }}>
                <Title order={3} size="h4">Nombre de Usuario</Title>
                <Text c="dimmed" size="sm">usuario@example.com</Text>
              </div>
            </Stack>
            <Stack mt="lg" gap="sm">
              <Button variant="outline" fullWidth>Editar Perfil</Button>
              <Button variant="outline" fullWidth>Historial de Pedidos</Button>
              <Button variant="outline" fullWidth>Configuración de Seguridad</Button>
              <Button color="red" fullWidth>Cerrar Sesión</Button>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder padding="lg" radius="md">
            <Title order={3} mb="md">Información Personal</Title>
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput label="Nombre" id="firstName" defaultValue="Nombre" />
                <TextInput label="Apellido" id="lastName" defaultValue="Apellido" />
              </SimpleGrid>
              <TextInput label="Correo Electrónico" id="email" defaultValue="usuario@example.com" type="email" />
              <TextInput label="Teléfono" id="phone" defaultValue="+1 123 456 7890" type="tel" />
              <Group justify="flex-end" mt="md">
                <Button>Guardar Cambios</Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
