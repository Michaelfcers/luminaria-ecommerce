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
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLocalProductImage } from "@/lib/local-images"
import Image from "next/image"
import { Edit, Package, Tag } from "lucide-react"

// Helper to format JSONB attributes for display
const formatAttributes = (attributes: Record<string, any>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")
}

export default async function ProductVersionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

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
    .eq("id", resolvedParams.id)
    .single()

  if (error || !product) {
    console.error("Error fetching product versions:", error)
    notFound()
  }

  // Enrich variants with images
  const enrichedVariants = await Promise.all(
    product.product_variants.map(async (variant: any) => {
      let imageUrl = "/placeholder-image.jpg"
      const localImage = await getLocalProductImage(variant.code)
      if (localImage) {
        imageUrl = localImage
      }
      return { ...variant, imageUrl }
    })
  )

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Versiones de Producto</h1>
          <p className="text-lg text-muted-foreground mt-1">{product.name}</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="shadow-sm">
            <Link href="/products">Volver a Productos</Link>
          </Button>
          <Button asChild className="shadow-sm">
            <Link href={`/products/${product.id}/versions/create`}>
              Crear Nueva Versión
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {enrichedVariants.map((variant: any) => (
          <Card
            key={variant.id}
            className="group overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/60"
          >
            <div className="relative aspect-square w-full bg-muted overflow-hidden">
              <Image
                src={variant.imageUrl}
                alt={variant.name || "Variant Image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              <div className="absolute top-3 right-3">
                <Badge
                  variant={variant.stock > 0 ? "default" : "destructive"}
                  className="shadow-sm"
                >
                  {variant.stock > 0 ? "En Stock" : "Agotado"}
                </Badge>
              </div>
            </div>

            <CardHeader className="p-5 pb-2 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-semibold line-clamp-1 leading-tight" title={variant.name}>
                  {variant.name || "Sin Nombre"}
                </CardTitle>
              </div>

              <div className="min-h-[2.5rem]">
                {Object.keys(variant.attributes).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5 bg-secondary/50 text-secondary-foreground/80 hover:bg-secondary/70 transition-colors"
                      >
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Sin atributos
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-2 flex-grow">
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-primary tracking-tight">
                  ${variant.list_price_usd?.toFixed(2) ?? "0.00"}
                </span>
                <span className="text-sm font-medium text-muted-foreground">USD</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 bg-muted/30 p-2 rounded-md">
                <Package className="w-4 h-4" />
                <span>Stock: <span className="font-medium text-foreground">{variant.stock}</span> unidades</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 mt-auto">
              <Button asChild className="w-full group-hover:bg-primary/90 transition-colors shadow-sm" size="lg">
                <Link
                  href={`/products/${product.id}/versions/${variant.id}/edit`}
                  className="flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar Versión
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {enrichedVariants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-xl bg-muted/10">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No hay versiones creadas</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Este producto aún no tiene versiones. Crea la primera versión para comenzar a vender diferentes variantes.
          </p>
          <Button asChild size="lg">
            <Link href={`/products/${product.id}/versions/create`}>
              Crear primera versión
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
