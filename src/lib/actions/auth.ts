"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function registerUser(prevState: any, formData: FormData) {
    const rawEmail = formData.get("email") as string
    const email = rawEmail?.trim()
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const origin = headers().get("origin")

    console.log("Registering user:", { email, fullName, origin })

    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error("Registration error:", error)
        return { error: error.message }
    }

    if (data.user) {
        // Attempt to create profile. 
        // Note: This might fail if RLS requires authenticated session and email is not confirmed.
        // Ideally, a Postgres trigger should handle this.
        const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            display_name: fullName,
            role: 'buyer',
            created_at: new Date().toISOString(),
        })

        if (profileError) {
            console.error("Profile creation error:", profileError)
            // We continue even if profile creation fails, assuming the user might be able to complete it later
            // or that a trigger might have handled it and we just don't have permission to upsert.
        }
    }

    return { success: true }
}
