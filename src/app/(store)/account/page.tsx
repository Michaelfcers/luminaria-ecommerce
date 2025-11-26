import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile } from "@/lib/actions/profile"

export default async function AccountPage() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Mi Cuenta</CardTitle>
                    <CardDescription>
                        Administra tu información personal.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateProfile} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-sm text-muted-foreground">
                                El correo electrónico no se puede cambiar.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="display_name">Nombre Completo</Label>
                            <Input
                                id="display_name"
                                name="display_name"
                                defaultValue={profile?.display_name || ""}
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={profile?.phone || ""}
                                placeholder="Tu número de teléfono"
                            />
                        </div>

                        <Button type="submit">Guardar Cambios</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
