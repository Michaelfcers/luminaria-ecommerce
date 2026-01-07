
import { Button, Card, Table, Badge, Title, Text, Group, Stack, ActionIcon } from "@mantine/core";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { TerminatePromotionButton } from "@/features/admin/components/terminate-promotion-button";
import { IconPlus, IconArrowLeft, IconTag, IconCalendar, IconFileText } from "@tabler/icons-react";
import { LinkButton } from "@/components/link-button";

dayjs.locale("es");

export default async function PromotionsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    // Fetch the user's store_id
    const { data: storeMembers } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .single()

    if (!storeMembers) {
        return <div>Error: No se pudo determinar la tienda del usuario.</div>
    }

    const store_id = storeMembers.store_id

    const { data: promotions, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("store_id", store_id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching promotions:", error)
        return <div>Error loading promotions.</div>
    }

    return (
        <Stack gap="lg" p="md">
            <Group justify="space-between">
                <Title order={1}>Gestión de Promociones</Title>
                <Group>
                    <LinkButton href="/products" variant="default" leftSection={<IconArrowLeft size={16} />}>
                        Volver a Productos
                    </LinkButton>
                    <LinkButton href="/promotions/create" leftSection={<IconPlus size={16} />}>
                        Crear Nueva Promoción
                    </LinkButton>
                </Group>
            </Group>

            <Card withBorder radius="lg" padding="lg">
                <Stack gap="md">
                    <div>
                        <Title order={3}>Listado de Promociones</Title>
                        <Text c="dimmed" size="sm">
                            Administra las ofertas y descuentos de tu tienda.
                        </Text>
                    </div>
                    <Table highlightOnHover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Estado</th>
                                <th>Vigencia</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promo) => (
                                <tr key={promo.id}>
                                    <td style={{ fontWeight: 500 }}>{promo.name}</td>
                                    <td style={{ textTransform: 'capitalize' }}>
                                        {promo.type === "percentage" ? "Porcentaje" :
                                            promo.type === "amount" ? "Monto Fijo" : "Bundle"}
                                    </td>
                                    <td>
                                        {promo.type === "percentage" ? `${promo.value}% ` : `$${promo.value} `}
                                    </td>
                                    <td>
                                        <Badge
                                            color={promo.status === 'active' ? 'green' :
                                                promo.status === 'scheduled' ? 'blue' : 'gray'}
                                            variant="light"
                                        >
                                            {promo.status === 'active' ? 'Activa' :
                                                promo.status === 'scheduled' ? 'Programada' : 'Expirada'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Text size="sm" c="dimmed">
                                            {promo.starts_at && dayjs(promo.starts_at).format("D MMM")} -
                                            {promo.ends_at && dayjs(promo.ends_at).format("D MMM")}
                                        </Text>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Group justify="flex-end" gap="xs">
                                            <LinkButton href={`/promotions/${promo.id}/edit`} size="xs" variant="default">
                                                Editar
                                            </LinkButton>
                                            <TerminatePromotionButton promotionId={promo.id} />
                                        </Group>
                                    </td>
                                </tr>
                            ))}
                            {
                                promotions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                            <Text c="dimmed">No hay promociones creadas.</Text>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody >
                    </Table >
                </Stack >
            </Card >
        </Stack >
    )
}
