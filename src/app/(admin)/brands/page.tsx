import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BrandsCrudContainer } from "@/features/admin/components/brands-crud-container"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function BrandsPage() {
  const supabase = createClient()
  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .is("deleted_at", null)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching brands:", error)
    return <div>Error loading brands.</div>
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Marcas</h1>
        <Button asChild>
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marcas</CardTitle>
          <CardDescription>
            Añade, edita y elimina las marcas de productos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BrandsCrudContainer brands={brands || []} />
        </CardContent>
      </Card>
    </div>
  )
}
