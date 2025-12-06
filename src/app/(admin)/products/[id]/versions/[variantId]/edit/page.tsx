
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditVariantForm } from "@/features/admin/components/edit-variant-form"

export default async function EditProductVersionPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: variant, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("id", resolvedParams.variantId)
    .eq("product_id", resolvedParams.id)
    .single()

  if (error || !variant) {
    console.error("Error fetching product variant:", error)
    notFound()
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold">Editar Versión de Producto</h1>

      <EditVariantForm variant={variant} />
    </div>
  )
}
