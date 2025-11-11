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
            brands={brands || []}
            categories={categories || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
