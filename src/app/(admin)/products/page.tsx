import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default function ProductsPage() {
  // Dummy data for products
  const products = [
    { id: "1", name: "Lámpara de Techo LED Circular", price: 120.00, stock: 50 },
    { id: "2", name: "Lámpara de Mesa Moderna", price: 75.50, stock: 30 },
    { id: "3", name: "Aplique de Pared Elegante", price: 45.00, stock: 100 },
    { id: "4", name: "Lámpara de Pie Minimalista", price: 99.99, stock: 20 },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/products/create">
              Crear Nuevo Producto
            </Link>
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
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm" className="mr-2">
                        Editar
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
