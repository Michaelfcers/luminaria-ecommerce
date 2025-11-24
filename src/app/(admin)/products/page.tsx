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
import { DeleteProductButton } from "@/features/admin/components/delete-product-button"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ProductsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  console.log("Logged in user ID:", user.id)

  // Fetch the user's store_id from the store_members table
  const { data: storeMembers, error: storeMemberError } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", user.id)

  if (storeMemberError || !storeMembers || storeMembers.length === 0) {
    console.error("Error fetching user's store:", storeMemberError)
    return <div>Error: No se pudo determinar la tienda del usuario.</div>
  }

  const store_id = storeMembers[0].store_id
  console.log("Determined store ID for user:", store_id)

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      status,
      list_price_usd,
      stock,
      brands (name)
    `
    )
    .eq("store_id", store_id) // Filter by store_id
    .is("deleted_at", null) // Fetch only non-deleted products

  if (error) {
    console.error("Error fetching products:", error)
    // Handle error state appropriately
    return <div>Error loading products.</div>
  }
  console.log("Fetched products:", products)

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/products/create">Crear Nuevo Producto</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Productos</CardTitle>
          <CardDescription>
            Administra los productos de tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {/* @ts-ignore */}
                    {product.brands?.name || "N/A"}
                  </TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>
                    ${product.list_price_usd?.toFixed(2) ?? "0.00"}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm" className="mr-2">
                      <Link href={`/products/${product.id}/edit`}>
                        Editar
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="mr-2">
                      <Link href={`/products/${product.id}/versions`}>
                        Editar Versiones
                      </Link>
                    </Button>
                    <DeleteProductButton productId={product.id} />
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
