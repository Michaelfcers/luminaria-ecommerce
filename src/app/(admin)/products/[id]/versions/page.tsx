import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
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

// Helper to format JSONB attributes for display
const formatAttributes = (attributes: Record<string, any>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")
}

export default async function ProductVersionsPage({
  params,
}: {
  params: { id: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      product_variants ( * )
    `
    )
    .eq("id", params.id)
    .single()

  if (error || !product) {
    console.error("Error fetching product versions:", error)
    notFound()
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Versiones de Producto</h1>
          <p className="text-xl text-muted-foreground">{product.name}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/products">Volver a Productos</Link>
          </Button>
          <Button asChild>
            <Link href={`/products/${product.id}/versions/create`}>
              Crear Nueva Versión
            </Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl elegant-shadow bg-white">
        <CardHeader>
          <CardTitle>Listado de Versiones</CardTitle>
          <CardDescription>
            Administra las diferentes versiones de este producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Atributos</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.product_variants.map((variant: any) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">{variant.name || "N/A"}</TableCell>
                  <TableCell>{formatAttributes(variant.attributes)}</TableCell>
                  <TableCell>
                    ${variant.list_price_usd?.toFixed(2) ?? "0.00"}
                  </TableCell>
                  <TableCell>{variant.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/products/${product.id}/versions/${variant.id}/edit`}
                      >
                        Editar
                      </Link>
                    </Button>
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
