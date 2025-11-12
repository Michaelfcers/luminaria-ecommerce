import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CategoriesCrudContainer } from "@/features/admin/components/categories-crud-container"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function CategoriesPage() {
  const supabase = createClient()
  // We perform a left join on the same table to get the parent category's name
  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      parent_id,
      parent:categories(name)
    `
    )
    .is("deleted_at", null)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return <div>Error loading categories.</div>
  }

  // Transform the data to a flatter structure for the client component
  const transformedCategories = categories.map((c: any) => ({
    ...c,
    // @ts-ignore
    parent_name: c.parent?.name,
  }))

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <Button asChild>
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categorías</CardTitle>
          <CardDescription>
            Añade, edita y elimina las categorías de productos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesCrudContainer categories={transformedCategories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
