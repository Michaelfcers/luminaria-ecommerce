import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Crear Nuevo Producto</h1>
        <Link href="/products">
          <Button variant="outline">Volver a Productos</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Producto</CardTitle>
          <CardDescription>
            Introduce la información del nuevo producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" placeholder="Lámpara de Techo Moderna" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Una lámpara elegante y funcional..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" placeholder="99.99" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" placeholder="50" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input id="image" type="url" placeholder="https://example.com/image.jpg" />
            </div>
            <Button type="submit" className="w-fit">Guardar Producto</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
