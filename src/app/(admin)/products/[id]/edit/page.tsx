import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // In a real application, you would fetch product data using the 'id'
  const product = {
    id: id,
    name: "Lámpara de Techo LED Circular",
    description: "Una lámpara de techo moderna y eficiente con iluminación LED.",
    price: 120.00,
    stock: 50,
    imageUrl: "https://example.com/circular-led-ceiling-light.jpg",
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editar Producto: {product.name}</h1>
        <Link href="/products">
          <Button variant="outline">Volver a Productos</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Producto</CardTitle>
          <CardDescription>
            Actualiza la información del producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" defaultValue={product.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" defaultValue={product.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" defaultValue={product.price} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" defaultValue={product.stock} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input id="image" type="url" defaultValue={product.imageUrl} />
            </div>
            <Button type="submit" className="w-fit">Guardar Cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
