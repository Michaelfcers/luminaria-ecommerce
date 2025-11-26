"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function updateProfile(formData: FormData) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "No autenticado" }
    }

    const displayName = formData.get("display_name") as string
    const phone = formData.get("phone") as string

    const updates: any = {
        display_name: displayName,
        updated_at: new Date().toISOString(),
    }

    // Only add phone if it's provided (or empty string to clear it, depending on requirement, 
    // but usually we just update what's there. If the column doesn't exist, this might throw, 
    // so we'll see. For now, we assume it exists as per plan).
    if (phone !== null) {
        updates.phone = phone
    }

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

    if (error) {
        console.error("Error updating profile:", error)
        return { error: "Error al actualizar el perfil" }
    }

    revalidatePath("/account")
    return { success: "Perfil actualizado correctamente" }
}
