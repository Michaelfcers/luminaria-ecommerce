
import { Card, Table, Button, Title, Text, Group, Stack, Badge, Grid } from "@mantine/core";
import { LinkButton } from "@/components/link-button";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      code,
      total,
      status,
      created_at,
      profiles (
        display_name
      ),
      order_items (
        id,
        name_snapshot,
        unit_price,
        quantity,
        product_snapshot
      )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between" align="center">
        <Title order={1}>Detalles del Pedido</Title>
        <LinkButton href="/dashboard/orders" variant="outline" leftSection={<IconArrowLeft size={16} />}>
          Volver a Órdenes
        </LinkButton>
      </Group>

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="lg">
          <Title order={2}>Pedido {order.code || `#${order.id.substring(0, 5)}`}</Title>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text><strong>Cliente:</strong> {(order.profiles as any)?.display_name || 'N/A'}</Text>
                <Group gap="xs">
                  <Text fw={700}>Estado:</Text>
                  <Badge color={order.status === 'completed' ? 'green' : 'blue'}>{order.status}</Badge>
                </Group>
                <Text><strong>Total:</strong> ${order.total?.toLocaleString()}</Text>
                <Text><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</Text>
              </Stack>
            </Grid.Col>
          </Grid>

          <Stack gap="md">
            <Title order={3}>Artículos del Pedido</Title>
            <Table withTableBorder withColumnBorders>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name_snapshot}</td>
                    <td>${item.unit_price?.toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.unit_price! * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
