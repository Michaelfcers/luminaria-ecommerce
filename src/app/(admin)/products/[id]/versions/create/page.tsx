import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreateVariantForm } from "@/features/admin/components/create-variant-form"

export default async function CreateProductVersionPage({
    params,
}: {
    params: { id: string }
}) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    // Verify product exists
    const { data: product, error } = await supabase
        .from("products")
        .select("id, name")
        .eq("id", params.id)
        .single()

    if (error || !product) {
        console.error("Error fetching product:", error)
        notFound()
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <div>
                <h1 className="text-3xl font-bold">Crear Nueva Versión</h1>
                <p className="text-xl text-muted-foreground">Para: {product.name}</p>
            </div>

            <CreateVariantForm productId={product.id} />
        </div>
    )
}
