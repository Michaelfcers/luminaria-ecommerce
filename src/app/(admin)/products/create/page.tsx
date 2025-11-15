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
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  console.log("User ID (create page):", user.id)

  let store_id: string | null = null

  // 1. Intentar encontrar una tienda donde el usuario sea el owner
  const { data: ownedStores, error: ownedStoresError } = await supabase
    .from("stores")
    .select("id, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true }) // o false si quieres la más reciente
    .limit(1)

  console.log("Owned Store Data:", ownedStores)
  console.log("Owned Store Error:", ownedStoresError)

  if (ownedStoresError) {
    console.error("Error buscando tienda como owner:", ownedStoresError)
  }

  if (ownedStores && ownedStores.length > 0) {
    store_id = ownedStores[0].id
  } else {
    // 2. Si no es owner (o no se tomó ninguna), buscar una tienda donde sea miembro
    const { data: memberStores, error: memberStoresError } = await supabase
      .from("store_members")
      .select("store_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)

    console.log("Store Member Data:", memberStores)
    console.log("Store Member Error:", memberStoresError)

    if (memberStoresError) {
      console.error("Error buscando tienda como miembro:", memberStoresError)
    }

    if (memberStores && memberStores.length > 0) {
      store_id = memberStores[0].store_id
    }
  }

  if (!store_id) {
    console.error(
      "Error: No se pudo determinar la tienda del usuario. User ID:",
      user.id
    )
    return (
      <div className="p-4">
        Error: No se pudo determinar la tienda del usuario. Por favor, asegúrate
        de que tu usuario esté asociado a una tienda.
      </div>
    )
  }

  console.log("Determined store ID for user (create page):", store_id)

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
