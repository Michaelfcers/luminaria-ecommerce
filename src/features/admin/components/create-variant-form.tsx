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
import { createVariant } from "@/lib/actions/product-variants"

export function CreateVariantForm({ productId }: { productId: string }) {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        list_price_usd: 0,
        stock: 0,
        sourcing_status: "active",
    })
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([])

    const handleAttributeChange = (index: number, field: "key" | "value", newValue: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev]
            newAttributes[index][field] = newValue
            return newAttributes
        })
    }

    const handleAddAttribute = () => {
        setAttributes((prev) => [...prev, { key: "", value: "" }])
    }

    const handleRemoveAttribute = (index: number) => {
        setAttributes((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const attributesObject = attributes.reduce((acc, curr) => {
            if (curr.key.trim()) {
                acc[curr.key.trim()] = curr.value
            }
            return acc
        }, {} as Record<string, string>)

        const dataToCreate = {
            name: formData.name,
            code: formData.code,
            list_price_usd: formData.list_price_usd,
            stock: formData.stock,
            sourcing_status: formData.sourcing_status,
            attributes: attributesObject,
        }

        const { error } = await createVariant(productId, dataToCreate)

        setIsSubmitting(false)

        if (error) {
            toast({
                title: "Error",
                description: "No se pudo crear la versión: " + error,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Éxito",
                description: "La versión ha sido creada.",
            })
            router.push(`/products/${productId}/versions`)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Nueva Versión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Color Rojo, Talla M"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Código (SKU)</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="Ej. PROD-RED-M"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio (USD)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.list_price_usd}
                                onChange={(e) =>
                                    setFormData({ ...formData, list_price_usd: parseFloat(e.target.value) })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({ ...formData, stock: parseInt(e.target.value, 10) })
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sourcing_status">Estado de Sourcing</Label>
                        <Select
                            value={formData.sourcing_status}
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
                            {attributes.map((attr, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={attr.key}
                                        onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                                        className="w-1/3"
                                        placeholder="Nombre (ej. Color)"
                                    />
                                    <Input
                                        value={attr.value}
                                        onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                        placeholder="Valor (ej. Rojo)"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAttribute(index)}
                                    >
                                        X
                                    </Button>
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
                {isSubmitting ? "Creando..." : "Crear Versión"}
            </Button>
        </form>
    )
}
