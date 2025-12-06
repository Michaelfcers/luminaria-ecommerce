
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
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function PromotionsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    // Fetch the user's store_id
    const { data: storeMembers } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .single()

    if (!storeMembers) {
        return <div>Error: No se pudo determinar la tienda del usuario.</div>
    }

    const store_id = storeMembers.store_id

    const { data: promotions, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("store_id", store_id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching promotions:", error)
        return <div>Error loading promotions.</div>
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Gestión de Promociones</h1>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/products">Volver a Productos</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/promotions/create">Crear Nueva Promoción</Link>
                    </Button>
                </div>
            </div>

            <Card className="rounded-3xl elegant-shadow bg-white">
                <CardHeader>
                    <CardTitle>Listado de Promociones</CardTitle>
                    <CardDescription>
                        Administra las ofertas y descuentos de tu tienda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Vigencia</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promotions.map((promo) => (
                                <TableRow key={promo.id}>
                                    <TableCell className="font-medium">{promo.name}</TableCell>
                                    <TableCell className="capitalize">
                                        {promo.type === "percentage" ? "Porcentaje" :
                                            promo.type === "amount" ? "Monto Fijo" : "Bundle"}
                                    </TableCell>
                                    <TableCell>
                                        {promo.type === "percentage" ? `${promo.value}%` : `$${promo.value}`}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${promo.status === 'active' ? 'bg-green-100 text-green-800' :
                                            promo.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {promo.status === 'active' ? 'Activa' :
                                                promo.status === 'scheduled' ? 'Programada' : 'Expirada'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                            {promo.starts_at && format(new Date(promo.starts_at), "d MMM", { locale: es })} -
                                            {promo.ends_at && format(new Date(promo.ends_at), "d MMM", { locale: es })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm" className="mr-2">
                                            <Link href={`/promotions/${promo.id}/edit`}>
                                                Editar
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {promotions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No hay promociones creadas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
