import { Card, Table, Button, Title, Text, Group, Stack, Badge, ActionIcon } from "@mantine/core";
import { LinkButton } from "@/components/link-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      code,
      total,
      status,
      created_at,
      profiles (
        display_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    // Handle error appropriately
  }

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={1}>Órdenes de Compra</Title>
      </Group>

      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <Title order={3}>Todas las Órdenes</Title>
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td>{order.code || `#${order.id.substring(0, 5)}`}</td>
                  <td>{(order.profiles as any)?.display_name || 'N/A'}</td>
                  <td>${order.total?.toLocaleString()}</td>
                  <td>
                    <Badge color={order.status === 'completed' ? 'green' : order.status === 'pending' ? 'yellow' : 'gray'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <LinkButton href={`/dashboard/orders/${order.id}`} size="xs" variant="light" leftSection={<Eye size={14} />}>
                      Ver Detalles
                    </LinkButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      </Card>
    </Stack>
  );
}
