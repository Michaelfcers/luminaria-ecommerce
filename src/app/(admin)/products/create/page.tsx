import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductForm } from "@/features/admin/components/product-form"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function CreateProductPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch the user's store_id from their profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("store_id")
    .eq("user_id", user.id)
    .single()

  if (profileError || !profile || !profile.store_id) {
    console.error("Error fetching user profile or store_id:", profileError)
    return <div>Error: No se pudo determinar la tienda del usuario.</div>
  }

  const store_id = profile.store_id

  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .select("id, name")
    .is("deleted_at", null)
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .is("deleted_at", null)

  if (brandsError || categoriesError) {
    console.error(
      "Error fetching brands or categories:",
      brandsError || categoriesError
    )
    return <div>Error loading form data.</div>
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Crear Nuevo Producto</h1>
        <Button asChild variant="outline">
          <Link href="/products">Volver a Productos</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Producto</CardTitle>
          <CardDescription>
            Introduce la información del nuevo producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            brands={brands?.map((b) => ({ ...b, id: String(b.id) })) || []}
            categories={
              categories?.map((c) => ({ ...c, id: String(c.id) })) || []
            }
            store_id={store_id}
          />
        </CardContent>
      </Card>
    </div>
  )
}
