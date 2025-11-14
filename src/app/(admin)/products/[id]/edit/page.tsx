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

  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("id, name")
    .is("deleted_at", null)

  if (productError || !product) {
    notFound()
  }

  if (brandsError || categoriesError || storesError) {
    console.error(
      "Error fetching brands, categories or stores:",
      brandsError || categoriesError || storesError
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
            stores={stores || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
