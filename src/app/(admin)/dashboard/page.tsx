import { Button, Card, Table, Badge, Title, Text, Group, Stack, ActionIcon, SimpleGrid } from "@mantine/core";
import Link from "next/link";
import { LinkButton } from "@/components/link-button"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let isStoreOwner = false;
  let storeId: string | null = null;

  const { data: ownedStore, error: ownedStoreError } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (ownedStore && !ownedStoreError) {
    isStoreOwner = true;
    storeId = ownedStore.id;
  }

  const [
    { count: totalCategories },
    { count: totalProducts },
    { count: totalVariants },
    { count: totalOrders },
  ] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("product_variants").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ]);

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between" align="center">
        <Title order={1}>Dashboard de Administrador</Title>
        <Group>
          <LinkButton href="/products">
            Gestionar Productos
          </LinkButton>
          <LinkButton href="/brands">
            Gestionar Marcas
          </LinkButton>
          <LinkButton href="/categories">
            Gestionar Categorías
          </LinkButton>
          <LinkButton href="/dashboard/orders">
            Ver Órdenes
          </LinkButton>
          {isStoreOwner && (
            <LinkButton href={`/ dashboard / members ? store_id = ${storeId} `}>
              Gestionar Miembros
            </LinkButton>
          )}
          <LinkButton href="/promotions">
            Gestionar Promociones
          </LinkButton>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
        <StatsCard title="Total de Categorías" value={totalCategories} />
        <StatsCard title="Total de Productos" value={totalProducts} />
        <StatsCard title="Total de Variantes" value={totalVariants} />
        <StatsCard title="Total de Órdenes" value={totalOrders} />
      </SimpleGrid>

      <Stack gap="md">
        <Title order={2}>Pedidos Recientes</Title>
        <Card withBorder radius="lg" shadow="sm">
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#00125</td>
                <td>Juan Pérez</td>
                <td>$150.00</td>
                <td>Enviado</td>
                <td>2023-10-26</td>
              </tr>
              <tr>
                <td>#00124</td>
                <td>Ana Gómez</td>
                <td>$85.50</td>
                <td>Procesando</td>
                <td>2023-10-25</td>
              </tr>
              {/* Más filas de pedidos */}
            </tbody>
          </Table>
        </Card>
      </Stack>
    </Stack>
  );
}

function StatsCard({ title, value }: { title: string, value: number | null }) {
  return (
    <Card withBorder padding="lg" radius="lg" shadow="sm">
      <Text size="sm" c="dimmed" fw={500} tt="uppercase">
        {title}
      </Text>
      <Text fw={700} size="xl" mt="xs">
        {value}
      </Text>
    </Card>
  )
}