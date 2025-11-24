"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { updateVariant } from "@/lib/actions/product-variants"

export function EditVariantForm({ variant }: { variant: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(variant)
  const [attributes, setAttributes] = useState(variant.attributes || {})

  const handleAttributeChange = (key: string, value: string) => {
    setAttributes((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleAddAttribute = () => {
    const newKey = `new_attribute_${Object.keys(attributes).length}`
    setAttributes((prev: any) => ({ ...prev, [newKey]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const dataToUpdate = {
      name: formData.name,
      code: formData.code,
      list_price_usd: formData.list_price_usd,
      stock: formData.stock,
      sourcing_status: formData.sourcing_status,
      attributes: attributes,
    }

    const { error } = await updateVariant(variant.id, dataToUpdate)

    setIsSubmitting(false)

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la versión: " + error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Éxito",
        description: "La versión ha sido actualizada.",
      })
      router.push(`/products/${variant.product_id}/versions`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Versión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input
              id="code"
              value={formData.code || ""}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (USD)</Label>
              <Input
                id="price"
                type="number"
                value={formData.list_price_usd || ""}
                onChange={(e) =>
                  setFormData({ ...formData, list_price_usd: parseFloat(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || ""}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value, 10) })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourcing_status">Estado de Sourcing</Label>
            <Select
              value={formData.sourcing_status || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, sourcing_status: value })
              }
            >
              <SelectTrigger id="sourcing_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="backorder">Backorder</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Atributos Dinámicos</h3>
            <div className="space-y-4">
              {Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Input value={key} disabled className="w-1/3" />
                  <Input
                    value={value as string}
                    onChange={(e) => handleAttributeChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleAddAttribute}
            >
              Añadir Atributo
            </Button>
          </div>
        </CardContent>
      </Card>
      <Button type="submit" className="mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  )
}
