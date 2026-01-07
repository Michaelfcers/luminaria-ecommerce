"use client"

import { Button, Card, NumberInput, Title, Text, Group, Stack, Image, Box, ActionIcon, Container, Grid, Loader, Divider } from "@mantine/core";
import { useCart } from "@/hooks/use-cart"
import { IconTrash } from "@tabler/icons-react"; // Replaced Trash2 with IconTrash

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, isLoading } = useCart()

  if (isLoading) {
    return (
      <Container size="xl" py="xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size="xl" />
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Tu Carrito</Title>

      {items.length === 0 ? (
        <Box p="xl" style={{ textAlign: 'center' }}>
          <Text size="lg" c="dimmed">Tu carrito está vacío.</Text>
        </Box>
      ) : (
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="lg">
              {items.map((item) => (
                <Card key={item.cartItemId} padding="md" radius="lg" withBorder shadow="sm">
                  <Group wrap="nowrap" align="center">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      w={100}
                      h={100}
                      radius="md"
                      fit="cover"
                    />
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text fw={600} size="md" lineClamp={2}>{item.name}</Text>
                    </Stack>

                    <Group gap="md" align="center">
                      <Stack gap={0} align="flex-end" visibleFrom="xs">
                        <Text fw={700} size="lg">${item.price.toFixed(2)}</Text>
                        {item.originalPrice && (
                          <Text size="sm" c="dimmed" td="line-through">${item.originalPrice.toFixed(2)}</Text>
                        )}
                      </Stack>

                      <NumberInput
                        value={item.quantity}
                        min={1}
                        w={80}
                        onChange={(val) => item.cartItemId && updateQuantity(item.cartItemId, Number(val))}
                      />

                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="lg"
                        onClick={() => item.cartItemId && removeItem(item.cartItemId)}
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card padding="xl" radius="lg" withBorder shadow="sm" pos="sticky" top={96}>
              <Title order={3} mb="lg">Resumen del Pedido</Title>
              <Stack gap="md">
                <Group justify="space-between">
                  <Text>Subtotal</Text>
                  <Text fw={500}>${total.toFixed(2)}</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Envío</Text>
                  <Text fw={500}>$0.00</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="xl" fw={700}>Total</Text>
                  <Text size="xl" fw={700}>${total.toFixed(2)}</Text>
                </Group>
                <Button fullWidth size="lg">Proceder al Pago</Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      )}
    </Container>
  );
}

function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}