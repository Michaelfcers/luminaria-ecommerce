import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Card, Table, Title, Text, Group, Stack, Badge, ActionIcon, Container } from "@mantine/core";
import Link from "next/link";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { RoleUpdateForm } from "@/components/role-update-form";
import { LinkButton } from "@/components/link-button";

/**
 * @typedef {Object} MemberProfile
 * @property {string} display_name - The display name of the user.
 */

/**
 * @typedef {Object} StoreMember
 * @property {string} user_id - The ID of the user.
 * @property {string} role - The role of the user in the store (e.g., 'owner', 'manager', 'staff').
 * @property {MemberProfile} [profiles] - The profile information of the user.
 */
interface Member {
    user_id: string;
    role: string;
    profiles: {
        display_name: string | null;
    } | null;
}

// ---------- PÁGINA ----------
/**
 * Renders the Store Members Page, displaying a list of members for a specific store.
 * Allows the store owner to manage member roles.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.searchParams - The search parameters from the URL.
 * @param {string} [props.searchParams.store_id] - The ID of the store to display members for.
 * @returns {Promise<JSX.Element>} - A promise that resolves to the JSX element for the page.
 */
export default async function StoreMembersPage({
    searchParams,
}: {
    searchParams: Promise<{ store_id?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const storeId = resolvedSearchParams.store_id;

    if (!storeId) {
        return <div>Error: Store ID not provided.</div>;
    }

    // Verificar que el usuario actual es el owner de esta tienda
    const { data: ownedStore, error: ownedStoreError } = await supabase
        .from("stores")
        .select("id")
        .eq("id", storeId)
        .eq("owner_id", user.id)
        .single();

    if (ownedStoreError || !ownedStore) {
        console.error("Acceso denegado a miembros de tienda", ownedStoreError);
        return (
            <div className="p-4">
                Acceso denegado: No eres el propietario de esta tienda.
            </div>
        );
    }

    // Traer miembros de la tienda
    const { data: members, error: membersError } = await supabase
        .from("store_members")
        .select(
            `
      user_id,
      role,
      profiles (
        display_name
      )
    `
        )
        .eq("store_id", storeId);

    if (membersError) {
        console.error("Error fetching store members:", membersError);
        return <div>Error al cargar los miembros de la tienda.</div>;
    }

    const safeMembers = members ?? [];

    return (
        <Stack gap="lg" p="md">
            <Group justify="space-between" align="center">
                <Title order={1}>Miembros de la Tienda</Title>
                <LinkButton href="/dashboard" variant="outline" leftSection={<ArrowLeft size={16} />}>
                    Volver al Dashboard
                </LinkButton>
            </Group>

            <Card withBorder radius="lg" padding="lg">
                <Stack gap="md">
                    <Title order={3}>Gestionar Miembros</Title>
                    <Table highlightOnHover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeMembers.map((member: any) => (
                                <tr key={member.user_id}>
                                    <td>
                                        {member.profiles?.display_name || "Sin nombre"}
                                    </td>
                                    <td>
                                        <Badge variant="dot" tt="capitalize">{member.role}</Badge>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {/* Opcional: evitar que el owner se cambie a sí mismo el rol */}
                                        {member.user_id === user.id ? (
                                            <Text size="xs" c="dimmed">
                                                Eres el propietario
                                            </Text>
                                        ) : (
                                            <RoleUpdateForm
                                                storeId={storeId}
                                                memberId={member.user_id}
                                                currentRole={member.role}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {safeMembers.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', fontSize: 'var(--mantine-font-size-sm)' }}>
                                        No hay miembros para esta tienda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Stack>
            </Card>
        </Stack>
    );
}
