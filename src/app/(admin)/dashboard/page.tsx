import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
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
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">$25,430</p>
            <p className="text-sm text-gray-500">+15% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Nuevos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">120</p>
            <p className="text-sm text-gray-500">+5% desde la semana pasada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nuevos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">32</p>
            <p className="text-sm text-gray-500">+10% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Productos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">540</p>
            <p className="text-sm text-gray-500">+20 añadidos esta semana</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Pedidos Recientes</h2>
        <Card>
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