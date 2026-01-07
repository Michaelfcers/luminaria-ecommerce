"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Server action to update a member's role within a store.
 * This function handles authentication, authorization, and database updates.
 * It revalidates the path upon successful role change.
 *
 * @param {FormData} formData - The form data containing storeId, memberId, and newRole.
 * @returns {Promise<void>} - A promise that resolves when the action is complete.
 */
export async function updateMemberRoleAction(formData: FormData): Promise<void> {
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

    const supabase = await createClient();

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
