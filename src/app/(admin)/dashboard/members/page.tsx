import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { RoleUpdateForm } from "@/components/role-update-form";

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

// ---------- SERVER ACTION para actualizar rol ----------
/**
 * Server action to update a member's role within a store.
 * This function handles authentication, authorization, and database updates.
 * It revalidates the path upon successful role change.
 *
 * @param {FormData} formData - The form data containing storeId, memberId, and newRole.
 * @returns {Promise<void>} - A promise that resolves when the action is complete.
 */
export async function updateMemberRole(formData: FormData): Promise<void> {
  "use server";

  const storeId = formData.get("storeId") as string | null;
  const memberId = formData.get("memberId") as string | null;
  const newRole = formData.get("newRole") as string | null;

    if (!storeId || !memberId || !newRole) {

      console.error("updateMemberRole: datos incompletos", {

        storeId,

        memberId,

        newRole,

      });

      return; // Exit early if essential data is missing

    }

  

    const supabase = createClient();

  

    const {

      data: {

        user

      },

    } = await supabase.auth.getUser();

      if (!user) {
            console.error(
              "updateMemberRole: usuario no autenticado intentando cambiar roles."
            );
            return; // Exit early if user is null
          }  // Verificar que el usuario que llama la acción es el owner de esa tienda
  const { data: ownedStore, error: ownedStoreError } = await supabase
    .from("stores")
    .select("id")
    .eq("id", storeId)
    .eq("owner_id", user.id)
    .single();

  if (ownedStoreError || !ownedStore) {
    console.error(
      "updateMemberRole: usuario no es owner de la tienda",
      ownedStoreError
    );
    return; // Exit early if user is not the store owner
  }

  // Actualizar rol en store_members
  const { error: memberUpdateError } = await supabase
    .from("store_members")
    .update({ role: newRole })
    .eq("store_id", storeId)
    .eq("user_id", memberId);

  if (memberUpdateError) {
    console.error("Error actualizando rol en store_members:", memberUpdateError);
    return; // Exit early if member role update fails
  }

  // Si se convierte a 'owner', actualizar también stores.owner_id
  if (newRole === "owner") {
    const { error: storeOwnerError } = await supabase
      .from("stores")
      .update({ owner_id: memberId })
      .eq("id", storeId);

    if (storeOwnerError) {
      console.error("Error actualizando owner_id en stores:", storeOwnerError);
      // Log the error but continue, as the member's role was already updated.
      // In a more complex scenario, you might want to revert the member role or
      // provide more specific error feedback.
      return; // Exit early if store owner update fails
    }
  }

  // Revalidar la página para ver los cambios
  revalidatePath(`/dashboard/members?store_id=${storeId}`);

  // No return statement here, as the action should not return a value
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
  searchParams: { store_id?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const storeId = searchParams.store_id;

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
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Miembros de la Tienda</h1>
        <Button asChild>
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestionar Miembros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeMembers.map((member: any) => (
                <TableRow key={member.user_id}>
                  <TableCell>
                    {member.profiles?.display_name || "Sin nombre"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {member.role}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Opcional: evitar que el owner se cambie a sí mismo el rol */}
                    {member.user_id === user.id ? (
                      <span className="text-xs text-muted-foreground">
                        Eres el propietario
                      </span>
                    ) : (
                      <RoleUpdateForm
                        storeId={storeId}
                        memberId={member.user_id}
                        currentRole={member.role}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {safeMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm">
                    No hay miembros para esta tienda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
