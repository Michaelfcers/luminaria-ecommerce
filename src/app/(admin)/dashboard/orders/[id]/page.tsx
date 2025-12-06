import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      code,
      total,
      status,
      created_at,
      profiles (
        display_name
      ),
      order_items (
        id,
        name_snapshot,
        unit_price,
        quantity,
        product_snapshot
      )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detalles del Pedido</h1>
        <Button asChild>
          <Link href="/dashboard/orders">
            Volver a Órdenes
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedido {order.code || `#${order.id.substring(0, 5)}`}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p><strong>Cliente:</strong> {(order.profiles as any)?.display_name || 'N/A'}</p>
            <p><strong>Estado:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${order.total?.toLocaleString()}</p>
            <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Artículos del Pedido</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name_snapshot}</TableCell>
                    <TableCell>${item.unit_price?.toLocaleString()}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${(item.unit_price! * item.quantity).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
