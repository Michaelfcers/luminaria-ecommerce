import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let isStoreOwner = false;
  let storeId: string | null = null;

  const { data: ownedStore, error: ownedStoreError } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (ownedStore && !ownedStoreError) {
    isStoreOwner = true;
    storeId = ownedStore.id;
  }

  const [
    { count: totalCategories },
    { count: totalProducts },
    { count: totalVariants },
    { count: totalOrders },
  ] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("product_variants").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard de Administrador</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/products">
              Gestionar Productos
            </Link>
          </Button>
          <Button asChild>
            <Link href="/brands">
              Gestionar Marcas
            </Link>
          </Button>
          <Button asChild>
            <Link href="/categories">
              Gestionar Categorías
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/orders">
              Ver Órdenes
            </Link>
          </Button>
          {isStoreOwner && (
            <Button asChild>
              <Link href={`/dashboard/members?store_id=${storeId}`}>
                Gestionar Miembros
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/promotions">
              Gestionar Promociones
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-3xl elegant-shadow bg-white">
          <CardHeader>
            <CardTitle>Total de Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalCategories}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl elegant-shadow bg-white">
          <CardHeader>
            <CardTitle>Total de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl elegant-shadow bg-white">
          <CardHeader>
            <CardTitle>Total de Variantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalVariants}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl elegant-shadow bg-white">
          <CardHeader>
            <CardTitle>Total de Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Pedidos Recientes</h2>
        <Card className="rounded-3xl elegant-shadow bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#00125</TableCell>
                <TableCell>Juan Pérez</TableCell>
                <TableCell>$150.00</TableCell>
                <TableCell>Enviado</TableCell>
                <TableCell>2023-10-26</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#00124</TableCell>
                <TableCell>Ana Gómez</TableCell>
                <TableCell>$85.50</TableCell>
                <TableCell>Procesando</TableCell>
                <TableCell>2023-10-25</TableCell>
              </TableRow>
              {/* Más filas de pedidos */}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}