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
  const supabase = createClient()

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, product_categories(category_id)")
    .eq("id", id)
    .single()

  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .select("id, name")
    .is("deleted_at", null)

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .is("deleted_at", null)

  if (productError || !product) {
    notFound()
  }

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
            product={product}
            brands={brands || []}
            categories={categories || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
