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
import { notFound } from "next/navigation"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  console.log("Logged in user ID (edit page):", user.id)

  // Get the user's profile ID
  const { data: userProfile, error: userProfileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (userProfileError || !userProfile) {
    console.error("Error fetching user profile:", userProfileError)
    return <div>Error: No se pudo cargar el perfil del usuario.</div>
  }

  // Now, find the store_id associated with this user's profile ID
  const { data: storeMember, error: storeMemberError } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", userProfile.id)
    .single()

  if (storeMemberError || !storeMember || !storeMember.store_id) {
    console.error("Error fetching store membership:", storeMemberError)
    return <div>Error: El usuario no está asociado a ninguna tienda.</div>
  }

  const store_id = storeMember.store_id
  console.log("Determined store ID for user (edit page):", store_id)

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, product_categories(category_id)")
    .eq("id", id)
    .eq("store_id", store_id) // Ensure product belongs to the user's store
    .single()

  if (productError || !product) {
    console.error("Error fetching product or product not found for store:", productError)
    notFound()
  }
  console.log("Fetched product (edit page):", product)

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

  const transformedProduct = {
    ...product,
    brand_id: product.brand_id ? String(product.brand_id) : "",
    product_categories:
      product.product_categories?.map(
        (pc: { category_id: number }) => ({
          category_id: String(pc.category_id),
        })
      ) || [],
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editar Producto</h1>
        <Button asChild variant="outline">
          <Link href="/products">Volver a Productos</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>
            Actualiza la información del producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            product={transformedProduct}
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
