import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CategoriesPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`*, parent:parent_id(name)`)
    .is("deleted_at", null)

  if (error) {
    console.error("Error fetching categories:", error)
    return <div>Error al cargar las categorías.</div>
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/products">Productos</Link>
          </Button>
          <Button asChild>
            <Link href="/categories/create">Crear Nueva Categoría</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Categorías</CardTitle>
          <CardDescription>
            Administra las categorías de tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Categoría Padre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    {/* @ts-ignore */}
                    {category.parent?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      <Link href={`/categories/${category.id}/edit`}>
                        Editar
                      </Link>
                    </Button>
                    {/* <DeleteCategoryButton categoryId={category.id} /> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}