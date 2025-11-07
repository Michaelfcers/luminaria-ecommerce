import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>
      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        <Card>
          <CardHeader className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle>Nombre de Usuario</CardTitle>
              <CardDescription>usuario@example.com</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline">Editar Perfil</Button>
            <Button variant="outline">Historial de Pedidos</Button>
            <Button variant="outline">Configuración de Seguridad</Button>
            <Button variant="destructive">Cerrar Sesión</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" defaultValue="Nombre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" defaultValue="Apellido" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" defaultValue="usuario@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" defaultValue="+1 123 456 7890" type="tel" />
            </div>
            <Button>Guardar Cambios</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}