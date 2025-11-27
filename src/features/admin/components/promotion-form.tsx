"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createPromotion, updatePromotion } from "@/lib/actions/promotions"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"

interface ProductVariant {
    id: string
    name: string
    attributes: Record<string, any>
}

interface Product {
    id: string
    name: string
    product_variants: ProductVariant[]
}

interface PromotionFormProps {
    storeId: string
    products: Product[]
    initialData?: any
    initialProductIds?: string[]
    initialVariantIds?: string[]
    isEditing?: boolean
}

export function PromotionForm({
    storeId,
    products,
    initialData,
    initialProductIds = [],
    initialVariantIds = [],
    isEditing = false
}: PromotionFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        type: initialData?.type || "percentage",
        value: initialData?.value || "",
        starts_at: initialData?.starts_at ? new Date(initialData.starts_at).toISOString().slice(0, 16) : "",
        ends_at: initialData?.ends_at ? new Date(initialData.ends_at).toISOString().slice(0, 16) : "",
        status: initialData?.status || "scheduled",
    })

    const [promotionLevel, setPromotionLevel] = useState<"product" | "variant">(
        initialVariantIds.length > 0 ? "variant" : "product"
    )

    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialProductIds)
    const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(initialVariantIds)

    const handleProductToggle = (productId: string) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleVariantToggle = (variantId: string) => {
        setSelectedVariantIds(prev =>
            prev.includes(variantId)
                ? prev.filter(id => id !== variantId)
                : [...prev, variantId]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const payload = {
                ...formData,
                store_id: storeId,
                value: Number(formData.value),
            }

            let result
            if (isEditing && initialData?.id) {
                result = await updatePromotion(
                    initialData.id,
                    payload,
                    promotionLevel === "product" ? selectedProductIds : [],
                    promotionLevel === "variant" ? selectedVariantIds : []
                )
            } else {
                result = await createPromotion(
                    payload,
                    promotionLevel === "product" ? selectedProductIds : [],
                    promotionLevel === "variant" ? selectedVariantIds : []
                )
            }

            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" })
            } else {
                toast({ title: "Éxito", description: `Promoción ${isEditing ? "actualizada" : "creada"} correctamente.` })
                router.push("/promotions")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    const formatVariantName = (variant: ProductVariant) => {
        if (variant.name) return variant.name
        return Object.entries(variant.attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <Card className="p-6">
                <CardContent className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre de la Promoción</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo de Descuento</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                                    <SelectItem value="amount">Monto Fijo ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="value">Valor del Descuento</Label>
                            <Input
                                id="value"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="starts_at">Fecha Inicio</Label>
                            <Input
                                id="starts_at"
                                type="datetime-local"
                                value={formData.starts_at}
                                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ends_at">Fecha Fin</Label>
                            <Input
                                id="ends_at"
                                type="datetime-local"
                                value={formData.ends_at}
                                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="scheduled">Programada</SelectItem>
                                <SelectItem value="active">Activa</SelectItem>
                                <SelectItem value="expired">Expirada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="p-6">
                <CardContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Aplicar a...</h3>
                        <div className="flex items-center space-x-2 bg-muted p-1 rounded-md">
                            <Button
                                type="button"
                                variant={promotionLevel === "product" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setPromotionLevel("product")}
                            >
                                Productos
                            </Button>
                            <Button
                                type="button"
                                variant={promotionLevel === "variant" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setPromotionLevel("variant")}
                            >
                                Versiones
                            </Button>
                        </div>
                    </div>

                    {promotionLevel === "product" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border p-4 rounded-md">
                            {products.map((product) => (
                                <div key={product.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`prod-${product.id}`}
                                        checked={selectedProductIds.includes(product.id)}
                                        onCheckedChange={() => handleProductToggle(product.id)}
                                    />
                                    <Label htmlFor={`prod-${product.id}`} className="text-sm cursor-pointer">
                                        {product.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-96 overflow-y-auto border p-4 rounded-md">
                            {products.map((product) => (
                                <div key={product.id} className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground sticky top-0 bg-background py-1">
                                        {product.name}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                                        {product.product_variants?.map((variant) => (
                                            <div key={variant.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`var-${variant.id}`}
                                                    checked={selectedVariantIds.includes(variant.id)}
                                                    onCheckedChange={() => handleVariantToggle(variant.id)}
                                                />
                                                <Label htmlFor={`var-${variant.id}`} className="text-sm cursor-pointer">
                                                    {formatVariantName(variant)}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : (isEditing ? "Actualizar Promoción" : "Crear Promoción")}
                </Button>
            </div>
        </form>
    )
}
